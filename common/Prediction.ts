
export interface Prediction {
    id: string;
    description: string;
    title: string;
    tags: string[];
    points: number;
    freeEntry?: boolean;
    freeEntryType?: FreeEntryType;
    pickId?: string;
}

export enum FreeEntryType {
    NUMBER = "number",
    TEXT = "text"
};