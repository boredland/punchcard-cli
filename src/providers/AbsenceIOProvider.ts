import { prompt } from 'gluegun';
import { AbsenceIO, Timespan } from 'absence.io';
import { Duration, DateTime, Interval } from 'luxon';
import { AbstractTrackingProvider } from './AbstractTrackingProvider';
import { NaiveInterval } from '../types';
import { setTimeOnDate, getLocalISOTimezone } from '../helpers';

type AbsenceCredentials = {
    apiKeyId: string;
    apiKey: string;
};

export class AbsenceIOProvider extends AbstractTrackingProvider {
    private authenticatedClient: AbsenceIO;

    public async login(): Promise<void> {
        this.toolbox.print.info(
            `To use the absence.io API you will need an API Key. To generate an API Key, please go to your profile (https://app.absence.io/#/actions/login) in your absence.io account and click on the Integrations link. Here you can generate an API Key by clicking on the 'Generate API Key' button.`,
        );
        const apiKeyIdQuestion = { type: 'input', name: 'apiKeyId', message: 'Please enter your api ID' };
        const apiKeyQuestion = { type: 'input', name: 'apiKey', message: 'Please enter your api Key' };
        const questions = [apiKeyIdQuestion, apiKeyQuestion];
        const newCredentials: AbsenceCredentials = await prompt.ask(questions);
        return this.getAuthenticatedClient(newCredentials)
            .api.user.retrieveUsers()
            .then(async () => {
                this.settings.add('credentials', newCredentials);
            });
    }

    private getAuthenticatedClient(credentialsInput?: AbsenceCredentials): AbsenceIO {
        if (credentialsInput) {
            return new AbsenceIO(credentialsInput);
        }
        if (!this.authenticatedClient) {
            const credentials = this.settings.get('credentials') as AbsenceCredentials;
            this.authenticatedClient = new AbsenceIO(credentials);
        }
        return this.authenticatedClient;
    }

    public async isAuthenticated(): Promise<boolean> {
        return new Promise((resolve) => {
            try {
                return this.getAuthenticatedClient()
                    .api.user.retrieveUsers()
                    .then(() => {
                        return resolve(true);
                    });
            } catch {
                return resolve(false);
            }
        });
    }

    private async getLatestTrackingItem(): Promise<Timespan> {
        return this.getAuthenticatedClient()
            .api.timespan.retrieveTimespans({
                limit: 1,
                skip: 0,
                sortBy: {
                    start: -1,
                },
            })
            .then((timespans) => timespans.data[0]);
    }

    public async getLatestTrackingInterval(): Promise<NaiveInterval> {
        const { start, end = null } = await this.getLatestTrackingItem();
        return new NaiveInterval(start, end);
    }

    public async isTracking(): Promise<boolean> {
        return this.getLatestTrackingItem().then((interval) => !interval.end);
    }

    public async getTrackingEntries(timespan?: NaiveInterval): Promise<NaiveInterval[]> {
        if (!timespan) timespan = new NaiveInterval(DateTime.local());
        const { start, end = DateTime.local().plus({ days: 1 }) } = timespan;
        return this.getAuthenticatedClient()
            .api.timespan.retrieveTimespans({
                filter: {
                    userId: await this.getUserId(),
                    start: { $gte: start.toISODate() },
                    end: { $lte: end.toISODate() },
                },
                limit: 1000,
                skip: 0,
            })
            .then((res) => res.data.map(({ start, end = null }) => new NaiveInterval(start, end)));
    }

    private async getUserId(): Promise<string> {
        return this.getLatestTrackingItem().then((timespan) => timespan.userId);
    }

    public async startTracking(startTime?: string): Promise<void> {
        if (await this.isTracking()) throw new Error('timer already running');
        return this.getAuthenticatedClient()
            .api.timespan.createTimespan({
                start: (startTime ? setTimeOnDate(new Date(), startTime) : new Date()).toISOString(),
                type: 'work',
                timezone: getLocalISOTimezone(),
                userId: await this.getUserId(),
            })
            .then(() => null)
            .catch((error) => {
                throw new Error(error.response.data);
            });
    }

    public async stopTracking(stopTime?: string): Promise<void> {
        if (!(await this.isTracking())) throw new Error('timer not running');
        const { _id: latestTrackingItemId } = await this.getLatestTrackingItem();
        const stopDate = (stopTime ? setTimeOnDate(new Date(), stopTime) : new Date()).toISOString();
        return this.getAuthenticatedClient()
            .api.timespan.updateTimespan(latestTrackingItemId, {
                end: stopDate,
            })
            .then(() => null)
            .catch((error) => {
                throw new Error(error.response.data);
            });
    }

    public async getDailyDuration(): Promise<Duration> {
        return this.getTrackingEntries(new NaiveInterval(DateTime.local().toISODate())).then((data) => {
            return data
                .map((el) => (el.end ? el : { ...el, end: DateTime.local() }))
                .reduce((acc, unit) => {
                    const nextInterval = Interval.fromDateTimes(unit.start, unit.end);
                    return acc.plus(nextInterval.toDuration());
                }, Duration.fromMillis(0));
        });
    }
}
