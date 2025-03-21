import { YouTubeDataApiCommentThreadEndPointModel } from '../../external/youtubedataapi/videocomment/model/YouTubeDataApiCommentThreadEndPointModel';
import { YouTubeDataApiCommentThreadModel } from '../../external/youtubedataapi/videocomment/model/YouTubeDataApiCommentThreadModel';
import { YouTubeDataApiCommentThreadMaxResult } from '../../external/youtubedataapi/videocomment/properties/YouTubeDataApiCommentThreadMaxResult';
import { YouTubeDataApiCommentThreadNextPageToken } from '../../external/youtubedataapi/videocomment/properties/YouTubeDataApiCommentThreadNextPageToken';
import { YouTubeDataApiCommentThreadItemType } from '../../external/youtubedataapi/videocomment/type/YouTubeDataApiCommentThreadItemType';
import { YouTubeDataApiVideoListEndPointModel } from '../../external/youtubedataapi/videolist/model/YouTubeDataApiVideoListEndPointModel';
import { YouTubeDataApiVideoListModel } from '../../external/youtubedataapi/videolist/model/YouTubeDataApiVideoListModel';
import { YouTubeDataApiVideoListKeyword } from '../../external/youtubedataapi/videolist/properties/YouTubeDataApiVideoListKeyword';
import { YouTubeDataApiVideoListMaxResult } from '../../external/youtubedataapi/videolist/properties/YouTubeDataApiVideoListMaxResult';
import { YouTubeDataApiVideoListVideoType } from '../../external/youtubedataapi/videolist/properties/YouTubeDataApiVideoListVideoType';
import { VideoIdModel } from '../../internaldata/favoritevideotransaction/properties/VideoIdModel';
import { ApiEndopoint } from '../../router/conf/ApiEndpoint';
import { SearchCommentByKeywordKeywordModel } from '../model/SearchCommentByKeywordKeywordModel';
import { SearchCommentByKeywordResponseCommentType } from '../type/SearchCommentByKeywordResponseCommentType';


export class SearchCommentByKeywordService {


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
                    authorDisplayName: authorDisplayName
                }];
            }

            // 返信コメント
            const replyComments = e.replies?.comments;

            // 返信リストチェック
            if (replyComments && replyComments.length > 0) {

                replyComments.forEach((e1) => {

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
                            authorDisplayName: replyAuthorDisplayName
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
}