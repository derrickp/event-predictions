
import { Editor } from "./Editor";

export interface PredictionTemplate {
    _id: string;
    key: string;
    description: string;
    editors?: Editor[];
    title: string;
    tags: string[];
    points: number;
}