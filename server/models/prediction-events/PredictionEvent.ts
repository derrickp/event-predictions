
import { Observable } from "../../../common/Observable";
import { PredictionEventDTO } from "../../../common/dtos/PredictionEventDTO";

export class PredictionEvent extends Observable implements PredictionEventDTO {
    cutoff: string;
    date: string;
    description: string;
    leagueIds: string[];
    predictionIds: string[];
    tags: string[];
    title: string;

    constructor(dto: PredictionEventDTO) {
        super();
        this.cutoff = dto.cutoff;
        this.date = dto.date;
        this.description = dto.description;
        this.leagueIds = dto.leagueIds ? dto.leagueIds : [];
        this.tags = dto.tags ? dto.tags : [];
        this.title = dto.title;
    }

    

}