import { IToolbox } from '../types';

module.exports = (toolbox: IToolbox) => {
    toolbox.print.warnmark = toolbox.print.colors.warning('⚠');
};
