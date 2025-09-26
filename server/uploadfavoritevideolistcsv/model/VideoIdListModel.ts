import { VideoIdModel } from "../../internaldata/common/properties/VideoIdModel";
import { CsvListModel } from "./CsvListModel";

export class VideoIdListModel {

    private readonly _videoIdListModel: VideoIdModel[];

    constructor(csvListModel: CsvListModel) {

        const videoIdListModel = csvListModel.csvList.map((e) => {
            return new VideoIdModel(e[0]);
        });

        this._videoIdListModel = videoIdListModel;
    }

    get videoIdListModel() {
        return this._videoIdListModel;
    }

    get videoIdList() {
        return this._videoIdListModel.map((e) => {
            return e.videoId;
        });
    }
}