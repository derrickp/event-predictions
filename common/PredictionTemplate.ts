
import { Editor } from "./Editor";

export interface PredictionTemplate {
    key: string;
    description: string;
    editors?: Editor[];
    title: string;
    tags: string[];
    points: number;
}
