import { YouTubeDataApiVideoListKeyword } from "../../external/youtubedataapi/videolist/properties/YouTubeDataApiVideoListKeyword";
import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";

export class CreateSearchWordEntity {

    // ユーザーID
    private readonly _frontUserIdModel: FrontUserIdModel;
    // 検索ワード
    private readonly _word: YouTubeDataApiVideoListKeyword;

    constructor(frontUserIdModel: FrontUserIdModel, word: YouTubeDataApiVideoListKeyword) {
        this._frontUserIdModel = frontUserIdModel;
        this._word = word;
    }

    get frontUserId() {
        return this._frontUserIdModel.frontUserId;
    }

    get word() {
        return this._word.keywrod;
    }
}