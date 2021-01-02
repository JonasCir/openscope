import _findKey from 'lodash/findKey';
import { convertStringToNumber } from '../utilities/unitConverters';
import {
    zeroArgumentsValidator,
    singleArgumentValidator,
    zeroOrOneArgumentValidator,
    altitudeValidator,
    fixValidator,
    headingValidator,
    holdValidator,
    squawkValidator,
    optionalAltitudeValidator,
    crossingValidator
} from './parser/ArgumentValidators';
import {
    altitudeParser,
    headingParser,
    holdParser,
    timewarpParser,
    optionalAltitudeParser,
    crossingParser
} from './parser/ArgumentParsers';

/**
 * Complete map of commands which can be transmitted to the plane.
 *
 *
 * Aliased commands map to a single root command that is shared among all aliases. The `validate` and `parse` keys
 * here then map to `validate` and `parse` functions for each root command. Some commands have very unique demands for
 * how arguments are formatted, those functions let us do that on a case by case basis.
 *
 * Keys are in lowercase so they can be accessed programmatically.
 *
 *
 * Root commands defined in the `commandMap` have a matching definition defined here. This definition
 * give us access to vaildate and parse functions. Some commands don't require either function and simply
 * pass the arguments through via `noop`. Other commands commands have very unique demands for how
 * arguments are formatted, these functions let us validate and parse on a case by case basis.
 *
 * Keys are lowercased here so they can be accessed programatically using input string segments
 * that are converted to lowercase for ease of comparison.
 * @propery AIRCRAFT_COMMAND_MAP
 * @type {Object}
 * @final
 */


/**
 * A no-op function used for command definitions that do not need a parser or validator
 *
 * This function will immediately return any arguments passed to it and is
 * used in place of an actual parser. this way `command.parse` can still
 * be called even with commands that don't need to be parsed.
 *
 * @function noop
 * @param args {*}
 * @return {*}
 */
const noop = (args) => args;

export const AIRCRAFT_COMMAND_MAP = {
    abort: {
        aliases: ['abort'],
        functionName: 'runAbort',
        validate: zeroArgumentsValidator,
        parse: noop
    },
    altitude: {
        aliases: ['a', 'altitude', 'c', 'climb', 'd', 'descend'],
        functionName: 'runAltitude',
        validate: altitudeValidator,
        parse: altitudeParser
    },
    cancelHold: {
        aliases: ['exithold', 'cancelhold', 'continue', 'nohold', 'xh'],
        functionName: 'runCancelHoldingPattern',
        validate: zeroOrOneArgumentValidator,
        parse: noop
    },
    clearedAsFiled: {
        aliases: ['caf', 'clearedAsFiled'],
        functionName: 'runClearedAsFiled',
        validate: zeroArgumentsValidator,
        parse: noop
    },
    climbViaSid: {
        aliases: ['climbViaSid', 'cvs'],
        functionName: 'runClimbViaSID',
        validate: optionalAltitudeValidator,
        parse: optionalAltitudeParser
    },
    cross: {
        aliases: ['cross', 'cr', 'x'],
        functionName: 'runCross',
        validate: crossingValidator,
        parse: crossingParser
    },
    delete: {
        aliases: ['del', 'delete', 'kill'],
        functionName: 'runDelete',
        validate: zeroArgumentsValidator,
        parse: noop
    },
    descendViaStar: {
        aliases: ['descendViaStar', 'dvs'],
        functionName: 'runDescendViaStar',
        validate: optionalAltitudeValidator,
        parse: optionalAltitudeParser
    },
    direct: {
        aliases: ['dct', 'direct', 'pd'],
        functionName: 'runDirect',
        validate: singleArgumentValidator,
        parse: noop
    },
    expectArrivalRunway: {
        aliases: ['e'],
        functionName: 'runExpectArrivalRunway',
        validate: singleArgumentValidator,
        parse: noop
    },
    fix: {
        aliases: ['f', 'fix', 'track'],
        functionName: 'runFix',
        validate: fixValidator,
        parse: noop
    },
    flyPresentHeading: {
        aliases: ['fph'],
        functionName: 'runFlyPresentHeading',
        validate: zeroArgumentsValidator,
        parse: noop
    },
    heading: {
        aliases: ['fh', 'h', 'heading', 't', 'turn'],
        functionName: 'runHeading',
        validate: headingValidator,
        parse: headingParser

    },
    hold: {
        aliases: ['hold'],
        functionName: 'runHold',
        validate: holdValidator,
        parse: holdParser
    },
    ils: {
        aliases: ['*', 'i', 'ils'],
        functionName: 'runIls',
        validate: singleArgumentValidator,
        // TODO: split this out to custom parser once the null value is defined
        parse: (args) => [null, args[0]]
    },
    land: {
        aliases: ['land'],
        functionName: 'runLand',
        validate: zeroOrOneArgumentValidator,
        parse: noop

    },
    moveDataBlock: {
        aliases: ['`'],
        functionName: 'runMoveDataBlock',
        validate: singleArgumentValidator,
        parse: noop
    },
    reroute: {
        aliases: ['reroute', 'rr'],
        functionName: 'runReroute',
        validate: singleArgumentValidator,
        parse: noop

    },
    route: {
        aliases: ['route'],
        functionName: 'runRoute',
        validate: singleArgumentValidator,
        parse: noop

    },
    sayAltitude: {
        aliases: ['sa'],
        functionName: 'runSayAltitude',
        validate: zeroArgumentsValidator,
        parse: noop

    },
    sayAssignedAltitude: {
        aliases: ['saa'],
        functionName: 'runSayAssignedAltitude',
        validate: zeroArgumentsValidator,
        parse: noop
    },
    sayAssignedHeading: {
        aliases: ['sah'],
        functionName: 'runSayAssignedHeading',
        validate: zeroArgumentsValidator,
        parse: noop
    },
    sayAssignedSpeed: {
        aliases: ['sas'],
        functionName: 'runSayAssignedSpeed',
        validate: zeroArgumentsValidator,
        parse: noop
    },
    sayHeading: {
        aliases: ['sh'],
        functionName: 'runSayHeading',
        validate: zeroArgumentsValidator,
        parse: noop

    },
    sayIndicatedAirspeed: {
        aliases: ['si'],
        functionName: 'runSayIndicatedAirspeed',
        validate: zeroArgumentsValidator,
        parse: noop
    },
    sayRoute: {
        aliases: ['sr'],
        functionName: 'runSayRoute',
        validate: zeroArgumentsValidator,
        parse: noop
    },
    sid: {
        aliases: ['sid'],
        functionName: 'runSID',
        validate: singleArgumentValidator,
        parse: noop
    },
    speed: {
        aliases: ['-', '+', 'slow', 'sp', 'speed'],
        functionName: 'runSpeed',
        validate: singleArgumentValidator,
        // calling method is expecting an array with values that will get spread later, thus we purposely
        // return an array here
        parse: (arg) => [convertStringToNumber(arg)]

    },
    squawk: {
        aliases: ['sq', 'squawk'],
        functionName: 'runSquawk',
        validate: squawkValidator,
        parse: noop

    },
    star: {
        aliases: ['star'],
        functionName: 'runSTAR',
        validate: singleArgumentValidator,
        parse: noop // FIXME(@JonasCir) Is this correct?

    },
    takeoff: {
        aliases: ['cto', 'to', 'takeoff'],
        functionName: 'runTakeoff',
        validate: zeroArgumentsValidator,
        parse: noop

    },
    taxi: {
        aliases: ['taxi', 'w', 'wait'],
        functionName: 'runTaxi',
        validate: zeroOrOneArgumentValidator,
        parse: noop

    }

};


/**
 * Complete map of system commands to control the simulation.
 *
 * Keys are in lowercase so they can be accessed programmatically.
 *
 * @propery AIRCRAFT_COMMAND_MAP
 * @type {Object}
 * @final
 */
export const SYSTEM_COMMAND_MAP = {
    airac: {
        validate: zeroArgumentsValidator,
        parse: noop
    },
    airport: {
        validate: singleArgumentValidator,
        parse: noop
    },
    auto: {
        validate: zeroArgumentsValidator,
        parse: noop
    },
    clear: {
        validate: zeroArgumentsValidator,
        parse: noop
    },
    debug: { // FIXME(@JonasCir) not sure where this belongs to
        validate: zeroArgumentsValidator,
        parse: noop
    },
    pause: {
        validate: zeroArgumentsValidator,
        parse: noop
    },
    rate: {
        validate: singleArgumentValidator,
        // calling method is expecting an array with values that will get spread later, thus we purposely
        // return an array here
        parse: (args) => [convertStringToNumber(args)]
    },
    timewarp: {
        validate: zeroOrOneArgumentValidator,
        parse: timewarpParser
    },
    transmit: {},
    tutorial: {
        validate: zeroArgumentsValidator,
        parse: noop
    }
};


/**
 * Retrieve the root command for a given alias
 *
 * @function findCommandNameWithAlias
 * @param where
 * @param commandAlias {string}
 * @return {string}
 */
export function aliasToRootCommand(where, commandAlias) {
    return _findKey(where, (command) => command.aliases.indexOf(commandAlias) !== -1);
}
