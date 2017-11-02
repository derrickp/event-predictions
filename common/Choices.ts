
export interface UserPredictionChoice {
    predictionId: string;
    choice: string;
}

export interface EventChoice {
    eventId: string;
    userChoices: UserPredictionChoice[];
}