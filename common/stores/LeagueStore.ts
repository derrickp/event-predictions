
import { Store } from "../Store"
import { League } from "../League";

export interface LeagueStore extends Store<League> {
    create(league: League): Promise<string>;
    get(key: string): Promise<League | null>;
    getMany(keys?: string[]): Promise<League[]>;
    save(league: League): Promise<void>;
    saveMany(leagues: League[]): Promise<void>;
}