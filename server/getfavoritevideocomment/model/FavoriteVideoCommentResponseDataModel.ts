import { BlockCommentTransaction } from "@prisma/client";
import { YouTubeDataApiCommentThreadModel } from "../../external/youtubedataapi/videocomment/model/YouTubeDataApiCommentThreadModel";
import { YouTubeDataApiCommentThreadResponseType } from "../../external/youtubedataapi/videocomment/type/YouTubeDataApiCommentThreadResponseType";
import { YouTubeDataApiCommentThreadItemType } from "../../external/youtubedataapi/videocomment/type/YouTubeDataApiCommentThreadItemType";
import { YouTubeDataApiCommentThreadReplyCommentType } from "../../external/youtubedataapi/videocomment/type/YouTubeDataApiCommentThreadReplyCommentType";
import { YouTubeDataApiCommentThreadReplyType } from "../../external/youtubedataapi/videocomment/type/YouTubeDataApiCommentThreadReplyType";

export class FavoriteVideoCommentResponseDataModel {

    private readonly _data: YouTubeDataApiCommentThreadResponseType;

    constructor(youTubeDataApiCommentThreadResponse: YouTubeDataApiCommentThreadModel,
        favoriteVideoBlockComment: BlockCommentTransaction[],
    ) {

        const responseCommentItems = youTubeDataApiCommentThreadResponse.response.items;

        const filterdItems: YouTubeDataApiCommentThreadItemType[] =
            responseCommentItems.map((e: YouTubeDataApiCommentThreadItemType) => {

                const topLevelCommentId = e.snippet.topLevelComment.id;

                // ブロックリストに存在するコメントを除外する
                const matchBlockComment = favoriteVideoBlockComment.find((e1) => {
                    return e1.commentId === topLevelCommentId;
                });

                if (matchBlockComment) {
                    return;
                }

                // 返信コメントの確認
                const commentReplys = e.replies?.comments;

                // ブロックリストに存在する返信コメントを除外する
                const matchBlockCommentReplys: YouTubeDataApiCommentThreadReplyCommentType[] = !!commentReplys ?
                    e.replies?.comments?.filter((e1) => {

                        const replyCommentId = e1.id;

                        const matchBlockCommentReply = favoriteVideoBlockComment.find((e2) => {
                            return e2.commentId === replyCommentId;
                        });

                        return !!matchBlockCommentReply;
                    })
                    :
                    [];

                const newReply: YouTubeDataApiCommentThreadReplyType = {
                    comments: matchBlockCommentReplys
                };

                return {
                    ...e,
                    replies: newReply
                }
            }).filter((e) => {
                return !!e;
            });

        this._data = {
            ...youTubeDataApiCommentThreadResponse.response,
            items: filterdItems
        }
    }

    get data() {
        return this._data;
    }
}