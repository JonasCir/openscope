/**
 * A definition of a specific command and it's arguments.
 *
 * Conatins a command name, which maps 1:1 with a name defined in `commandMap.js` and `commandDefinitions.js`.
 * Commands may have an alias or many, we care only about the root command. The command map will map any
 * alias to a root command and this `SystemCommandModel` is only concerned about those root commands. It has
 * no way of knowing what the original alias was, if one was used.
 *
 * Each `SystemCommandModel` will be expected to have, at a minimum, a `name` and a matching
 * `AIRCRAFT_COMMAND_DEFINITION`.
 *
 * @class SystemCommandModel
 */
import { SYSTEM_COMMAND_MAP } from './systemCommandMap';
import CommandModel from '../CommandModel';

export default class SystemCommandModel extends CommandModel {
    /**
     * @constructor
     * @for AircraftCommandModel
     */
    constructor(name = '') {
        super(name, SYSTEM_COMMAND_MAP[name]);
    }
}
