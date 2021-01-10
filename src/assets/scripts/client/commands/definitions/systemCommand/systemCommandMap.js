/**
 * This definition give us access to vaildate and parse functions. Some commands don't require either function and simply
 * pass the arguments through via `noop`. Other commands commands have very unique demands for how
 * arguments are formatted, these functions let us validate and parse on a case by case basis.
 *
 * @fileoverview
 */

import { singleArgumentValidator, zeroArgumentsValidator, zeroOrOneArgumentValidator } from '../../parsers/argumentValidators';
import { convertStringToNumber } from '../../../utilities/unitConverters';
import { timewarpParser } from '../../parsers/argumentParsers';
import noop from '../utils';

/**
 * Complete map of system commands
 *
 * Keys are lowercased here so they can be accessed programmatically.
 *
 * @propery SYSTEM_COMMAND_MAP
 * @type {Object}
 * @final
 */
export const SYSTEM_COMMAND_MAP = {
    airac: {
        validate: zeroArgumentsValidator,
        parse: noop
    },
    airport: {
        parse: noop,
        validate: singleArgumentValidator
    },

    auto: {
        validate: zeroArgumentsValidator,
        parse: noop
    },
    clear: {
        validate: zeroArgumentsValidator,
        parse: noop
    },
    debug: {
        // todo hat entry in commands
        validate: zeroArgumentsValidator,
        parse: noop
    },
    pause: {
        validate: zeroArgumentsValidator,
        parse: noop
    },

    rate: {
        // calling method is expecting an array with values that will get spread later, thus we purposely
        // return an array here
        parse: (args) => [convertStringToNumber(args)],
        validate: singleArgumentValidator
    },
    timewarp: {
        parse: timewarpParser,
        validate: zeroOrOneArgumentValidator
    },
    transmit: {},
    tutorial: {
        validate: zeroArgumentsValidator,
        parse: noop
    },

    //todo
    moveDataBlock: {
        validate: singleArgumentValidator,
        parse: noop
    },

    '`': {
        // todo: weired
        // calling method is expecting an array with values that will get spread later, thus we purposly
        // return an array here
        parse: (args) => [convertStringToNumber(args)],
        validate: singleArgumentValidator

    }
};

/**
 * Encapsulation of boolean logic used to determine if the `callsignOrSystemCommandName`
 * is in fact a system command.
 *
 *
 * @for CommandParser
 * @method _isSystemCommand
 * @param cmd {string}
 * @return {boolean}
 */
export const isSystemCommand = (cmd) => {
    return cmd in SYSTEM_COMMAND_MAP;
};
