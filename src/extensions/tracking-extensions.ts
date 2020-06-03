import { IToolbox, TrackingProviders, NaiveInterval } from '../types';
import { Interval, DateTime } from 'luxon';
import { AbsenceIOProvider } from '../providers/AbsenceIOProvider';
import { SettingsProvider } from '../providers/SettingsProvider';
import { AbstractTrackingProvider } from '../providers/AbstractTrackingProvider';

const timespanToArray = (timespan: NaiveInterval): string[] => {
    const { start, end = DateTime.local() } = timespan;
    return [start.toISODate(), end.toISODate(), timespan.duration.toString()];
};

module.exports = (toolbox: IToolbox) => {
    toolbox.getProvider = (): AbstractTrackingProvider => {
        if (toolbox.provider !== undefined) return toolbox.provider;

        const providerString = new SettingsProvider().get('provider');

        if (providerString === TrackingProviders.absence) return new AbsenceIOProvider(toolbox);
    };
    class Auth {
        async login() {
            if (await toolbox.getProvider().isAuthenticated()) {
                toolbox.print.warning(`${toolbox.print.warnmark} you're already signed in`);
            } else {
                const spinner = toolbox.print.spin('trying to login').stop();
                try {
                    await toolbox.getProvider().login();
                    spinner.start();
                    spinner.succeed(`login successful`);
                } catch (error) {
                    spinner.fail(`login not successful (${error.message})`);
                }
            }
        }
    }
    toolbox.auth = () => new Auth();

    class Tracking {
        async printTrackingStatus(): Promise<void> {
            return (await toolbox.getProvider().isTracking())
                ? toolbox
                      .getProvider()
                      .getLatestTrackingInterval()
                      .then((interval: NaiveInterval) => {
                          const duration = Interval.fromDateTimes(interval.start, new Date())
                              .toDuration()
                              .shiftTo('hours', 'minutes')
                              .toFormat('hh:mm');
                          toolbox.print.info(
                              `${toolbox.print.checkmark} timer running for: ${duration.toString()} [hh:mm]`,
                          );
                      })
                : toolbox.print.warning(`${toolbox.print.warnmark} no timer running`);
        }

        async printDailyTrackingReport(): Promise<void> {
            return toolbox.print.info(
                `${toolbox.print.checkmark} tracked today: ${(await toolbox.getProvider().getDailyDuration())
                    .shiftTo('hours', 'minutes')
                    .toFormat('hh:mm')} [hh:mm]`,
            );
        }

        async printStatus(): Promise<void> {
            await this.printDailyTrackingReport();
            await this.printTrackingStatus();
        }

        async start(time?: string): Promise<void> {
            if (await toolbox.getProvider().isTracking()) {
                return toolbox.print.warning(`${toolbox.print.warnmark} already tracking`);
            }
            return toolbox
                .getProvider()
                .startTracking(time)
                .then(() => toolbox.print.success(`${toolbox.print.checkmark} started tracking`));
        }

        async stop(time?: string): Promise<void> {
            if (!(await toolbox.getProvider().isTracking())) {
                return toolbox.print.warning(`${toolbox.print.warnmark} no tracking running at the moment!`);
            }
            return toolbox
                .getProvider()
                .stopTracking(time)
                .then(() => toolbox.print.success(`${toolbox.print.checkmark} stopped tracking!`));
        }

        async getListTable(interval?: NaiveInterval): Promise<string[][]> {
            const header: string[][] = [['From', 'To', 'Net']];
            return toolbox
                .getProvider()
                .getTrackingEntries(interval)
                .then((entries) => header.concat(entries.map((entry) => timespanToArray(entry))));
        }

        async printList(interval?: NaiveInterval): Promise<void> {
            const entries = await this.getListTable(interval);
            return toolbox.print.table(entries, {
                format: 'markdown',
            });
        }
    }
    toolbox.tracking = () => new Tracking();
};
