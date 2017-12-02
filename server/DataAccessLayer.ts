
import { DBLeagueStore } from "./stores/DBLeagueStore";
import { DBMembershipStore } from "./stores/DBMembershipStore";
import { DBUserStore } from "./stores/DBUserStore";
import { getDb } from "./db/connection";
import { LeagueDTO } from "../common/dtos/LeagueDTO";
import League from "./models/leagues/League";
import User from "./models/users/User";
import { uuidv4 } from "./utilities/guid";

export namespace DAL {

    export namespace Leagues {
        const leagueMap: Map<string, League> = new Map();
        const dirtyLeagues: Set<string> = new Set();
    
        export async function getNewLeagueKey() {
            let key = uuidv4();
            
            let league = getLeague(key);
            while (league) {
                key = uuidv4();
                league = getLeague(key);
            }
    
            return key;
        }
    
        export async function addLeague(leagueDTO: LeagueDTO) {
            if (!leagueDTO.key) {
                const key = await getNewLeagueKey();
                leagueDTO.key = key;
            } else {
                const existing = await getLeague(leagueDTO.key);
                if (existing) {
                    throw new Error("league-exists");
                }
            }
            const league = new League(leagueDTO);
            leagueMap.set(leagueDTO.key, league);
            dirtyLeagues.add(league.key);
        }
    
        export async function getLeague(key: string): Promise<League | undefined> {
            if (leagueMap.has(key)) return leagueMap.get(key);
            const db = getDb();
            const store = new DBLeagueStore(db);
    
            const dto = await store.get(key);
            if (dto) {
                const league = new League(dto);
                league.watch((propertyName) => {
                    if (!dirtyLeagues.has(key)) {
                        dirtyLeagues.add(key);
                    }
                });
                leagueMap.set(key, league);
                return league;
            }
            return undefined;
        }
    
        export async function getLeagues(keys: string[]): Promise<League[]> {
            const leagues: League[] = [];
            const db = getDb();
            const store = new DBLeagueStore(db);
            const leagueDTOs = await store.getMany(keys);
            for (const dto of leagueDTOs) {
                const league = new League(dto);
                leagueMap.set(league.key, league);
                leagues.push(league);
            }
            return leagues;
        }
    
        export async function save() {
            const db = getDb();
            const leagueStore = new DBLeagueStore(db);
            for (const leagueKey of dirtyLeagues) {
                if (leagueMap.has(leagueKey)) {
                    const league = leagueMap.get(leagueKey) as League;
                    const dto = league.dto;
                    await leagueStore.save(dto);
                }
            }
        }
    }

    export namespace Memberships {
        
        export async function changeUserLeaguePrivilege(user: User, league: League, privilege: Privilege) { 
            const db = getDb();
            const store = new DBMembershipStore(db);
            await store.changeUserPrivilege(user.key, league.key, privilege);
        }
    }

    export namespace Users {
        const dirtyUsers: Set<string> = new Set();
        const users: Map<string, User> = new Map();
    
        export async function addUser(user: User) {
            if (!user.key) {
                const key = user.email;
                user.key = key;
            } else {
                const existing = await getByKey(user.key);
                if (existing) {
                    throw new Error("user-exists");
                }
            }
            users.set(user.key, user);
            dirtyUsers.add(user.key);
        }
    
        export async function getByKey(key: string): Promise<User | undefined> {
            if (users.has(key)) return users.get(key);
            
            const db = getDb();
            const store = new DBUserStore(db);
            const dto = await store.get(key);
            if (dto) {
                const user = new User(dto);
                user.watch((propertyName) => {
                    if (!dirtyUsers.has(key)) {
                        dirtyUsers.add(key);
                    }
                });
            }
            return undefined;
        }
    
        export async function getByEmail(email: string): Promise<User | undefined> {
            const key = email;
            return getByKey(key);
        }
    
        export async function save() {
            const db = getDb();
    
            const userStore = new DBUserStore(db);
            for (const userKey of dirtyUsers) {
                if (users.has(userKey)) {
                    const user = users.get(userKey) as User;
                    const dto = user.dto;
                    await userStore.save(dto);
                }
            }
        }
    }

    export async function save() {
        await Leagues.save();
        await Users.save();
    }
}