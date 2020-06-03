import { GluegunCommand } from 'gluegun';
import { IToolbox, TrackingProviders } from '../types';
import { SettingsProvider } from '../providers/SettingsProvider';

const command: GluegunCommand = {
    name: 'authentication',
    alias: 'auth',
    run: async (toolbox: IToolbox) => {
        const first: TrackingProviders = TrackingProviders[toolbox.parameters.first];
        if (first === undefined) {
            return toolbox.print.error(
                `${toolbox.print.xmark} \'${first}\' is not a known provider. Use one of [${Object.values(
                    TrackingProviders,
                )}]`,
            );
        }
        new SettingsProvider().add('provider', first);
        return toolbox.auth().login();
    },
};

module.exports = command;
