import { GluegunCommand } from 'gluegun';
import { IToolbox } from '../types';

enum TrackingParam {
    start = 'start',
    stop = 'stop',
    status = 'status',
    list = 'list',
}

const command: GluegunCommand = {
    name: 'tracking',
    alias: 'track',
    run: async (toolbox: IToolbox) => {
        const action: TrackingParam = TrackingParam[toolbox.parameters.first];
        if (action === TrackingParam.status || !action) return toolbox.tracking().printStatus();
        if (action === TrackingParam.stop) return toolbox.tracking().stop(toolbox.parameters.third);
        if (action === TrackingParam.start) return toolbox.tracking().start(toolbox.parameters.third);
        if (action === TrackingParam.list) return toolbox.tracking().printList();
    },
};

module.exports = command;
