import { VideoIdModel } from "../../../../internaldata/common/properties/VideoIdModel";

export class VideoIdListModel {

    private readonly _videoIdList: VideoIdModel[];

    constructor() {

        this._videoIdList = [];
    }

    add(videoId: VideoIdModel) {
        this._videoIdList.push(videoId);
    }

    get videoId() {
        return this._videoIdList.map((e) => e.videoId).join(`,`);
    }
}