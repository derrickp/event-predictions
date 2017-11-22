
import { PredictionTemplate } from "../PredictionTemplate";

export interface PredictionDTO extends PredictionTemplate {
    freeEntry?: boolean;
    freeEntryType?: FreeEntryType;
    pickId?: string;
}

export enum FreeEntryType {
    NUMBER = "number",
    TEXT = "text"
};