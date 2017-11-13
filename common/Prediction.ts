
export interface PredictionTemplate {
    key: string;
    description: string;
    title: string;
    tags: string[];
    points: number;
}

export interface Prediction extends PredictionTemplate {
    freeEntry?: boolean;
    freeEntryType?: FreeEntryType;
    pickId?: string;
}

export enum FreeEntryType {
    NUMBER = "number",
    TEXT = "text"
};