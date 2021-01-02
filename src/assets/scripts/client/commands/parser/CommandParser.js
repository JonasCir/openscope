import _isString from 'lodash/isString';
import _tail from 'lodash/tail';
import Command from '../Command';
import {
    AIRCRAFT_COMMAND_MAP,
    aliasToRootCommand, SYSTEM_COMMAND_MAP
} from '../CommandDefinition';


/**
 * Symbol used to split the command string as it enters the class.
 *
 * @property COMMAND_ARGS_SEPARATOR
 * @type {string}
 * @final
 */
const COMMAND_ARGS_SEPARATOR = ' ';

/**
 * This class is responsible for taking the content of the `$commandInput` and parsing it
 * out into commands and arguments.
 *
 * Everything this class needs comes in as a single string provided by `InputController.input_run()`.
 * ex:
 * - `timewarp 50`
 * - `AA777 fh 0270 d 050 sp 200`
 * - `AA777 hold dumba left 2min`
 *
 * **Differentiation of commands and arguments is determined by splitting the string on an empty space. This
 * is very important, so legacy commands did not have spaces between the command and argument. With this
 * implementation _every_ command shall have a space between itself and it's arguments.**
 *
 * There are two command categories: `System` and `Transmit`.
 * - System commands are zero or single argument commands that are used for interacting with the app
 *   itself (e.g., `timewarp` or `tutorial`).
 *
 * - Transmit commands are instructions meant for a specific aircraft within the controlled airspace.
 *   These commands can have zero to many arguments, depending on the command. Some examples of transmit
 *   commands are `to`, `taxi`, `hold`.
 *
 * Commands go through a lifecycle as they move from raw to parsed:
 * - user types command and presses enter
 * - command string is captured via input value, then passed as an argument to this class
 * - the command is parsed and classified as `System Command` or `Transmit` command
 * - creation of `Command` objects for each command/argument group found
 * - parse and validate command arguments (number of arguments and data type)
 *
 * All available commands are defined in the `commandMap`. Two terms of note are alias and root command.
 * We would call the `takeoff` command a root command and `to` and `cto` aliases. The root command is the
 * one that shares the same key as the command definition which gives us the correct validator and parser.
 * The root command is also what the `AircraftModel` is expecting when it receives commands
 * from the `InputController`.
 *
 * @class CommandParser
 */
export default class CommandParser {
    /**
     * Try to parse the entire input into a command.
     *
     * @for CommandParser
     * @method _parse
     * @param rawInput {string}
     */
    static parse(rawInput) {
        if (!_isString(rawInput)) {
            throw new TypeError(`AircraftCommandParser expects a string but received ${typeof rawInput}`);
        }

        // CLI input is separated by spaces, split them to receive our tokens
        const tokens = rawInput.toLowerCase()
            .split(COMMAND_ARGS_SEPARATOR);

        // the first token is either a system command to control the game
        // or a callsign to address a plane
        const callsignOrSystemCommand = tokens[0];
        if (CommandParser._isSystemCommand(callsignOrSystemCommand)) {
            return CommandParser._parseSystemCommand(tokens);
        }
        return CommandParser._parseAircraftCommand(tokens);
    }

    /**
     * Build a `Command` for a system command
     *
     * @for CommandParser
     * @method _parseSystemCommand
     * @param tokens {string[]}
     * @private
     */
    static _parseSystemCommand(tokens) {
        // system command index
        const commandName = tokens[0];
        // effectively a slice of the array that returns everything but the first item
        const argTokens = _tail(tokens);
        const rootCmd = aliasToRootCommand(SYSTEM_COMMAND_MAP, commandName);

        const parsedArgs = SYSTEM_COMMAND_MAP[rootCmd].parse(argTokens);
        const validatedArgs = SYSTEM_COMMAND_MAP[rootCmd].validate(parsedArgs);
        return new Command(rootCmd, 'system', '', validatedArgs);
    }

    /**
     * Build a `Command` for an aircraft command
     *
     * @for CommandParser
     * @method _parseSystemCommand
     * @param tokens {string[]}
     * @private
     */
    static _parseAircraftCommand(tokens) {
        // callsign index
        const callsign = tokens[0];
        // effectively a slice of the array that returns everything but the first item
        let tail = _tail(tokens);
        while (tail.length > 0) {
            const commandName = tail[0];
            const rootCmd = aliasToRootCommand(AIRCRAFT_COMMAND_MAP, commandName);
            const [parsedArgs, tmp] = AIRCRAFT_COMMAND_MAP[rootCmd].parse(tail);
            tail = tmp;
            const validatedArgs = AIRCRAFT_COMMAND_MAP[rootCmd].validate(parsedArgs);
            return new Command(rootCmd, 'aircraft', callsign, validatedArgs);
        }
    }

    /**
     * Check if the current token is a system command
     *
     * @for CommandParser
     * @method _isSystemCommand
     * @param token {string}
     * @return {boolean}
     * @private
     */
    static _isSystemCommand(token) {
        // check if the dictionary key exists
        return token in SYSTEM_COMMAND_MAP;
    }
}
