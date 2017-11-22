
import { Store } from "../Store"
import { LeagueDTO } from "../dtos/LeagueDTO";

export interface LeagueStore extends Store<LeagueDTO> {
    create(league: LeagueDTO): Promise<string>;
    get(key: string): Promise<LeagueDTO | null>;
    getMany(keys?: string[]): Promise<LeagueDTO[]>;
    save(league: LeagueDTO): Promise<void>;
    saveMany(leagues: LeagueDTO[]): Promise<void>;
}