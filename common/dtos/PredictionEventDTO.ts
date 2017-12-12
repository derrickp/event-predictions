
export interface PredictionEventDTO {
    key: string;
    cutoff: string;
    date: string;
    description: string;
    leagueIds?: string[];
    predictionIds?: string[];
    tags: string[];
    title: string;
}
