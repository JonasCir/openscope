/**
 * Represents specific command and it's arguments.
 *
 * Contains a command name, which maps 1:1 with a name defined in `CommandDefinition`.
 * Commands may have an alias (or many), but we only care about the root command. As an example, the `takeoff` root command
 * is aliased by `to` and `cto`. The command map will map any  alias to a root command and this `Command`
 * is only concerned about those root commands. It has no way of knowing what the original alias was, if one was used.
 *
 * Each `Command` will be expected to have, at a minimum, a `name` and a matching `COMMAND_DEFINITION`.
 *
 * @class Command
 */

export default class Command {
    /**
     * @constructor
     * @for Command
     */
    constructor(name, commandType, callsign, args) {
        /**
         * command name, should match a root command in the command map
         *
         * @property name
         * @type {string}
         */
        this.name = name;

        /**
         * Command type
         *
         * Could be either Transmit or a System command
         *
         * @type {string}
         * @default ''
         */
        this.commandType = commandType;


        /**
         * Aircraft callsign
         *
         * this is optional and not included with system commands
         *
         * @type {string}
         * @default ''
         */
        this.callsign = callsign; // FIXME(@JonasCir)


        /**
         * Parsed and validated list of command arguments
         *
         * - assumed to be the text command names
         * - may be empty, depending on the command
         * - should only ever be strings on initial set immediately after instantiation
         * @property args
         * @type {array}
         * @default []
         */
        this.args = args;
    }

    /**
     * Return an array of [name, ...args]
     *
     * We use this shape solely to match the existing api.
     *
     * @property nameAndArgs
     * @return {array}
     */
    get nameAndArgs() {
        return [
            this.name,
            ...this.args
        ];
    }
}
