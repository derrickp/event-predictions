
import { apiUrl } from "../config";
import { LeagueDTO } from "../../common/dtos/LeagueDTO";

export async function getLeagues(token: string): Promise<LeagueDTO[]> {
    const url = `${apiUrl}/leagues`;
    const response = await fetch(url, {
        headers: [
            ["Authorization", `Bearer ${token}`]
        ]
    });

    if (!response.ok) {
        const error = await response.json();
        console.error(error);
        throw new Error(error);
    } else {
        const dtos: LeagueDTO[] = await response.json();
        return dtos;
    }
}