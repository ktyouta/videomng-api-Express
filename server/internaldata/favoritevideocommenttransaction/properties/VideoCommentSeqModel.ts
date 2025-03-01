export class VideoCommentSeqModel {

    private readonly _videoCommentSeq: number;

    constructor(videoCommentSeq: number) {

        this._videoCommentSeq = videoCommentSeq;
    }

    get videoCommentSeq() {
        return this._videoCommentSeq;
    }
}