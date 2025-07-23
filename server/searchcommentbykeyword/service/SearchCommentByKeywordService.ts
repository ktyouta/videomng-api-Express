import { BlockCommentTransaction, FavoriteCommentTransaction } from '@prisma/client';
import { CookieModel } from '../../cookie/model/CookieModel';
import { YouTubeDataApiCommentThreadEndPointModel } from '../../external/youtubedataapi/videocomment/model/YouTubeDataApiCommentThreadEndPointModel';
import { YouTubeDataApiCommentThreadModel } from '../../external/youtubedataapi/videocomment/model/YouTubeDataApiCommentThreadModel';
import { YouTubeDataApiCommentThreadMaxResult } from '../../external/youtubedataapi/videocomment/properties/YouTubeDataApiCommentThreadMaxResult';
import { YouTubeDataApiCommentThreadNextPageToken } from '../../external/youtubedataapi/videocomment/properties/YouTubeDataApiCommentThreadNextPageToken';
import { YouTubeDataApiCommentThreadItemType } from '../../external/youtubedataapi/videocomment/type/YouTubeDataApiCommentThreadItemType';
import { YouTubeDataApiCommentThreadReplyCommentType } from '../../external/youtubedataapi/videocomment/type/YouTubeDataApiCommentThreadReplyCommentType';
import { YouTubeDataApiVideoListEndPointModel } from '../../external/youtubedataapi/videolist/model/YouTubeDataApiVideoListEndPointModel';
import { YouTubeDataApiVideoListModel } from '../../external/youtubedataapi/videolist/model/YouTubeDataApiVideoListModel';
import { YouTubeDataApiVideoListKeyword } from '../../external/youtubedataapi/videolist/properties/YouTubeDataApiVideoListKeyword';
import { YouTubeDataApiVideoListMaxResult } from '../../external/youtubedataapi/videolist/properties/YouTubeDataApiVideoListMaxResult';
import { YouTubeDataApiVideoListVideoType } from '../../external/youtubedataapi/videolist/properties/YouTubeDataApiVideoListVideoType';
import { FrontUserIdModel } from '../../internaldata/common/properties/FrontUserIdModel';
import { VideoIdModel } from '../../internaldata/common/properties/VideoIdModel';
import { JsonWebTokenModel } from '../../jsonwebtoken/model/JsonWebTokenModel';
import { JsonWebTokenUserModel } from '../../jsonwebtoken/model/JsonWebTokenUserModel';
import { ApiEndopoint } from '../../router/conf/ApiEndpoint';
import { SearchCommentByKeywordFavoriteCommentSelectEntity } from '../entity/SearchCommentByKeywordFavoriteCommentSelectEntity';
import { SearchCommentByKeywordKeywordModel } from '../model/SearchCommentByKeywordKeywordModel';
import { SearchCommentByKeywordResponseCommentType } from '../type/SearchCommentByKeywordResponseCommentType';
import { Router, Request, Response, NextFunction } from 'express';
import { SearchCommentByKeywordBlockCommentSelectEntity } from '../entity/SearchCommentByKeywordBlockCommentSelectEntity';
import { SearchCommentByKeywordRepositorys } from '../repository/SearchCommentByKeywordRepositorys';
import { FLG, RepositoryType } from '../../util/const/CommonConst';


export class SearchCommentByKeywordService {

    private searchCommentByKeywordRepositorys = (new SearchCommentByKeywordRepositorys()).get(RepositoryType.POSTGRESQL);

    /**
     * 動画コメントを取得する
     * @param videoIdModel 
     */
    public async getCommentList(videoIdModel: VideoIdModel) {

        let nextPageToken = "";
        let commentList: YouTubeDataApiCommentThreadItemType[] = [];

        do {

            const nextPageTokenModel = new YouTubeDataApiCommentThreadNextPageToken(nextPageToken);

            // YouTube Data API(コメント)を呼び出す
            const videoCommentResponseModel = await this.callYouTubeDataCommentApi(videoIdModel, nextPageTokenModel);

            const response = videoCommentResponseModel.response;
            // 次データ取得用トークン
            nextPageToken = response.nextPageToken;
            // コメント
            const items = response.items;
            commentList = [...commentList, ...items];

        } while (nextPageToken);

        return commentList;
    }

    /**
     * YouTube Data Apiを呼び出す
     * @param videoIdModel 
     * @returns 
     */
    private async callYouTubeDataCommentApi(videoIdModel: VideoIdModel,
        nextPageTokenModel: YouTubeDataApiCommentThreadNextPageToken
    ) {

        try {

            // YouTube Data APIのエンドポイント
            const youTubeDataApiCommentThreadEndPointModel = new YouTubeDataApiCommentThreadEndPointModel(
                videoIdModel,
                new YouTubeDataApiCommentThreadMaxResult(),
                nextPageTokenModel,
            );

            // YouTube Data Apiデータ取得
            const youTubeDataApiCommentThreadModel = await YouTubeDataApiCommentThreadModel.call(youTubeDataApiCommentThreadEndPointModel);

            return youTubeDataApiCommentThreadModel;

        } catch (err) {
            throw Error(`ERROR:${err} endpoint:${ApiEndopoint.SEARCH_COMMENT_BY_KEYWORD} id:${videoIdModel}`);
        }
    }


    /**
     * 取得したコメントをフィルターする
     * @param commentList 
     * @param searchCommentByKeywordKeywordModel 
     */
    public filterComment(commentList: YouTubeDataApiCommentThreadItemType[],
        searchCommentByKeywordKeywordModel: SearchCommentByKeywordKeywordModel
    ) {

        const keywrod = searchCommentByKeywordKeywordModel.keywrod;
        const escapedKeyword = this.escapeRegExp(keywrod);
        const keywordRegex = new RegExp(escapedKeyword, "i");
        // フィルターしたコメントリスト
        let filterdCommentList: SearchCommentByKeywordResponseCommentType[] = [];

        commentList.forEach((e: YouTubeDataApiCommentThreadItemType) => {

            const topLevelCommentSnippet = e.snippet.topLevelComment.snippet;
            // コメント
            const textOriginal = topLevelCommentSnippet.textOriginal;

            // キーワードにヒットした場合
            if (keywordRegex.test(textOriginal)) {

                // コメントの投稿日時
                const publishedAt = topLevelCommentSnippet.publishedAt;
                // コメント投稿者の表示名
                const authorDisplayName = topLevelCommentSnippet.authorDisplayName;

                filterdCommentList = [...filterdCommentList, {
                    textOriginal: textOriginal,
                    publishedAt: publishedAt,
                    authorDisplayName: authorDisplayName,
                    commentId: e.snippet.topLevelComment.id,
                    favoriteStatus: FLG.OFF,
                }];
            }

            // 返信コメント
            const replyComments = e.replies?.comments;

            // 返信リストチェック
            if (replyComments && replyComments.length > 0) {

                replyComments.forEach((e1: YouTubeDataApiCommentThreadReplyCommentType) => {

                    const replySnipet = e1.snippet;
                    // コメント
                    const replyTextOriginal = replySnipet.textOriginal;

                    // キーワードにヒットした場合
                    if (keywordRegex.test(replyTextOriginal)) {

                        // コメントの投稿日時
                        const replyPublishedAt = replySnipet.publishedAt;
                        // コメント投稿者の表示名
                        const replyAuthorDisplayName = replySnipet.authorDisplayName;

                        filterdCommentList = [...filterdCommentList, {
                            textOriginal: replyTextOriginal,
                            publishedAt: replyPublishedAt,
                            authorDisplayName: replyAuthorDisplayName,
                            commentId: e1.id,
                            favoriteStatus: FLG.OFF,
                        }];
                    }
                });
            }
        });

        return filterdCommentList;
    }

    /**
     * コメントのエスケープ
     * @param text 
     * @returns 
     */
    private escapeRegExp(text: string) {
        return text.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }

    /**
     * jwtを取得
     */
    public getToken(req: Request) {

        const cookieModel = new CookieModel(req);
        const jsonWebTokenModel = new JsonWebTokenModel(cookieModel);

        return jsonWebTokenModel.token;
    }


    /**
     * jwtからユーザー情報を取得
     * @param req 
     * @returns 
     */
    public checkJwtVerify(req: Request) {

        try {

            const cookieModel = new CookieModel(req);
            const jsonWebTokenUserModel = JsonWebTokenUserModel.get(cookieModel);

            return jsonWebTokenUserModel;
        } catch (err) {
            throw Error(`キーワード検索(コメント)処理中の認証エラー ERROR:${err}`);
        }
    }

    /**
     * お気に入り動画ブロックコメント取得
     * @param getFavoriteVideoCommentRepository 
     * @param frontUserIdModel 
     * @returns 
     */
    public async getBlockComment(frontUserIdModel: FrontUserIdModel,
        videoIdModel: VideoIdModel
    ): Promise<BlockCommentTransaction[]> {

        // お気に入り動画ブロックコメント取得用Entity
        const searchCommentByKeywordBlockCommentSelectEntity = new SearchCommentByKeywordBlockCommentSelectEntity(
            frontUserIdModel,
            videoIdModel
        );

        // お気に入り動画ブロックコメント取得
        const blockComment = await this.searchCommentByKeywordRepositorys.selectBlockComment(searchCommentByKeywordBlockCommentSelectEntity);

        return blockComment;
    }


    /**
     * お気に入りコメント取得
     * @param frontUserIdModel 
     * @returns 
     */
    public async getFavoriteComment(frontUserIdModel: FrontUserIdModel,
        videoIdModel: VideoIdModel
    ): Promise<BlockCommentTransaction[]> {

        // お気に入りコメント取得用Entity
        const searchCommentByKeywordFavoriteCommentSelectEntity = new SearchCommentByKeywordFavoriteCommentSelectEntity(
            frontUserIdModel,
            videoIdModel
        );

        // お気に入りコメント取得
        const favoriteComment = await this.searchCommentByKeywordRepositorys.selectFavoriteComment(searchCommentByKeywordFavoriteCommentSelectEntity);

        return favoriteComment;
    }

    /**
     * 非表示コメントでフィルター
     * @param filterdCommentList 
     * @param blockCommentList 
     */
    public filterCommentByBlock(commentList: SearchCommentByKeywordResponseCommentType[],
        blockCommentList: BlockCommentTransaction[]
    ) {

        const filterdCommentList = commentList.filter((e) => {

            // 非表示コメントリストに対して該当IDをチェック
            const blockComment = blockCommentList.find((e1) => {
                return e1.commentId === e.commentId;
            });

            return !blockComment;
        });

        return filterdCommentList;
    }


    /**
     * お気に入りステータスチェック
     * @param filterdCommentList 
     * @param blockCommentList 
     */
    public favoriteStatusCheck(commentList: SearchCommentByKeywordResponseCommentType[],
        favoriteCommentList: FavoriteCommentTransaction[]
    ) {

        const checkedCommentList = commentList.map((e) => {

            // お気に入りコメントリストに対して該当IDをチェック
            const favoriteComment = favoriteCommentList.find((e1) => {
                return e1.commentId === e.commentId;
            });


            return {
                ...e,
                favoriteStatus: !!favoriteComment ? FLG.ON : FLG.OFF
            }
        });

        return checkedCommentList;
    }
}