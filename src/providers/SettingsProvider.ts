/* eslint-disable @typescript-eslint/no-var-requires */
import * as path from 'path';
import * as fs from 'fs';

export class SettingsProvider {
    private config: Map<string, unknown>;
    private configFile = path.join(require('os').homedir(), '.punchcard.json');
    constructor() {
        if (fs.existsSync(this.configFile)) {
            this.config = new Map(JSON.parse(fs.readFileSync(this.configFile, { encoding: 'utf-8' })));
        } else {
            this.config = new Map();
        }
    }
    public save(): SettingsProvider {
        fs.writeFileSync(this.configFile, JSON.stringify(Array.from(this.config)), 'utf-8');
        return this;
    }
    public add(key: string, value: unknown): SettingsProvider {
        this.config.set(key, value);
        this.save();
        return this;
    }
    public get(key: string): unknown {
        return this.config.get(key);
    }
}
