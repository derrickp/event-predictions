
import { Option } from "./Option";

export interface PickTemplate {
    key: string;
    name: string;
    options: Option[];
}

export interface Pick extends PickTemplate { }