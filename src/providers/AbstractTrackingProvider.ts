import { SettingsProvider } from './SettingsProvider';
import { IToolbox, NaiveInterval } from '../types';
import { Duration } from 'luxon';

export abstract class AbstractTrackingProvider {
    protected settings: SettingsProvider;
    protected toolbox: IToolbox;

    constructor(toolbox: IToolbox) {
        this.settings = new SettingsProvider();
        this.toolbox = toolbox;
    }
    public abstract login(): Promise<void>;
    public abstract isAuthenticated(): Promise<boolean>;
    public abstract getLatestTrackingInterval(): Promise<NaiveInterval>;
    public abstract isTracking(): Promise<boolean>;
    public abstract startTracking(startTime?: string): Promise<void>;
    public abstract stopTracking(stopTime?: string): Promise<void>;
    public abstract getDailyDuration(): Promise<Duration>;
}
