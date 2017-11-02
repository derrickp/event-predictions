
import { Store } from "../Store"
import { League } from "../League";

export interface LeagueStore extends Store<League> {
    get(id: string): Promise<League>;
    get(ids?: string[]): Promise<League[]>;
    save(league: League): Promise<void>;
    save(leagues: League[]): Promise<void>;
}