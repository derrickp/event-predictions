
export interface PredictionEvent {
    date: string;
    cutoff: string;
    description: string;
    title: string;
    tags: string[];
    leagueIds: string[];
    predictionIds: string[];
}