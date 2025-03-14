export class VideoMemoSeqModel {

    private readonly _videoMemoSeq: number;

    constructor(videoMemoSeq: number) {

        this._videoMemoSeq = videoMemoSeq;
    }

    get videoMemoSeq() {
        return this._videoMemoSeq;
    }
}