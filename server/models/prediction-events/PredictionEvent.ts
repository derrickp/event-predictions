
import * as moment from "moment";

import { PredictionEventDTO } from "../../../common/dtos/PredictionEventDTO";
import { Observable } from "../../../common/Observable";
import { uuidv4 } from "../../utilities/guid";

export class PredictionEvent extends Observable {
    key: string;
    cutoff: moment.Moment;
    date: moment.Moment;
    description: string;
    leagueIds: string[];
    predictionIds: string[];
    tags: string[];
    title: string;

    get dto(): PredictionEventDTO {
        return {
            key: this.key,
            cutoff: this.cutoff.format(),
            date: this.date.format(),
            title: this.title,
            tags: this.tags,
            description: this.description,
            leagueIds: this.leagueIds,
            predictionIds: this.predictionIds,
        };
    }

    constructor(dto: PredictionEventDTO) {
        super();
        this.key = dto.key ? dto.key : uuidv4();
        if (dto.cutoff) {
            this.cutoff = moment(dto.cutoff);
        }
        if (dto.date) {
            this.date = moment(dto.date);
        }
        this.description = dto.description;
        this.leagueIds = dto.leagueIds ? dto.leagueIds : [];
        this.tags = dto.tags ? dto.tags : [];
        this.title = dto.title;
    }

    complete(currentDate: Date): boolean {
        if (!this.cutoff) {
            return false;
        }

        const current = moment(currentDate);
        if (current.isAfter(this.cutoff)) {
            return true;
        } else {
            return false;
        }
    }
}
