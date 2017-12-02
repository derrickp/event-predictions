import { Privilege } from "../Privilege";

export interface MembershipStore {
    changeUserPrivilege(userKey: string, leagueKey: string, privilege: Privilege): Promise<void>;
}