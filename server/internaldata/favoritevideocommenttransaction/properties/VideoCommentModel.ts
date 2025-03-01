export class VideoCommentModel {

    private readonly _videoComment: string;

    constructor(videoComment: string) {

        this._videoComment = videoComment;
    }

    get videoComment() {
        return this._videoComment;
    }
}