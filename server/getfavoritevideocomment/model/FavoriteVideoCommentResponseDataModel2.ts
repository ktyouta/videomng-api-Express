import { BlockCommentTransaction, FavoriteCommentTransaction } from "@prisma/client";
import { YouTubeDataApiCommentThreadModel } from "../../external/youtubedataapi/videocomment/model/YouTubeDataApiCommentThreadModel";
import { YouTubeDataApiCommentThreadResponseType } from "../../external/youtubedataapi/videocomment/type/YouTubeDataApiCommentThreadResponseType";
import { YouTubeDataApiCommentThreadItemType } from "../../external/youtubedataapi/videocomment/type/YouTubeDataApiCommentThreadItemType";
import { YouTubeDataApiCommentThreadReplyCommentType } from "../../external/youtubedataapi/videocomment/type/YouTubeDataApiCommentThreadReplyCommentType";
import { YouTubeDataApiCommentThreadReplyType } from "../../external/youtubedataapi/videocomment/type/YouTubeDataApiCommentThreadReplyType";
import { FavoriteVideoCommentThreadItemType } from "../type/FavoriteVideoCommentThreadItemType";
import { COMMENT_FAVORITE_STATUS } from "../const/GetFavoriteVideoCommentConst";
import { FavoriteVideoCommentReplyType } from "../type/FavoriteVideoCommentReplyType";
import { FavoriteVideoCommentThreadReplyType } from "../type/FavoriteVideoCommentThreadReplyType";
import { FavoriteVideoCommentSnippetType } from "../type/FavoriteVideoCommentSnippetType";
import { FavoriteVideoCommentThreadResponseType } from "../type/FavoriteVideoCommentThreadResponseType";
import { FilterdBlockCommentModel } from "./FilterdBlockCommentModel";



export class FavoriteVideoCommentResponseDataModel {

    private readonly _data: FavoriteVideoCommentThreadResponseType;

    constructor(filterdBlockCommentModel: FilterdBlockCommentModel,
        favoriteComment: FavoriteCommentTransaction[],
    ) {

        const responseCommentItems = filterdBlockCommentModel.data.items;

        const responseItems: FavoriteVideoCommentThreadItemType[] =
            responseCommentItems.map((e: YouTubeDataApiCommentThreadItemType) => {

                const topLevelCommentId = e.snippet.topLevelComment.id;

                // お気に入りステータスを取得
                const favoriteCommentObj = favoriteComment.find((e1: FavoriteCommentTransaction) => {
                    return e1.commentId === topLevelCommentId;
                });

                const favoriteStatus = !!favoriteCommentObj ? COMMENT_FAVORITE_STATUS.FAVORITE : COMMENT_FAVORITE_STATUS.NONE;

                const snippet: FavoriteVideoCommentSnippetType = {
                    ...e.snippet,
                    favoriteStatus: favoriteStatus
                };

                // 返信コメントの確認
                const commentReplys = e.replies?.comments;

                // ブロックリストに存在する返信コメントを除外する
                const matchBlockCommentReplys: FavoriteVideoCommentReplyType[] = !!commentReplys ?
                    commentReplys.map((e1) => {

                        const replyCommentId = e1.id;

                        // お気に入りステータスを取得
                        const favoriteCommentObj = favoriteComment.find((e1: FavoriteCommentTransaction) => {
                            return e1.commentId === replyCommentId;
                        });

                        const favoriteStatus = !!favoriteCommentObj ? COMMENT_FAVORITE_STATUS.FAVORITE : COMMENT_FAVORITE_STATUS.NONE;

                        const reply = {
                            ...e1,
                            favoriteStatus
                        }

                        return reply;
                    })
                    :
                    [];

                const newReply: FavoriteVideoCommentThreadReplyType = {
                    comments: matchBlockCommentReplys
                };

                return {
                    ...e,
                    snippet: snippet,
                    replies: newReply
                }
            });

        this._data = {
            ...filterdBlockCommentModel.data,
            items: responseItems
        }
    }

    get data() {
        return this._data;
    }
}