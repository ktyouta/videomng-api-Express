import { NextFunction, Response } from 'express';
import { RepositoryType } from '../../common/const/CommonConst';
import { authMiddleware } from "../../middleware/authMiddleware/authMiddleware";
import { ApiEndopoint } from "../../router/conf/ApiEndpoint";
import { RouteController } from "../../router/controller/RouteController";
import { HttpMethodType, RouteSettingModel } from "../../router/model/RouteSettingModel";
import { AuthenticatedRequest } from "../../types/AuthenticatedRequest";
import { DateUtil } from "../../util/DateUtil";
import { DownloadFavoriteVideoListRepositorys } from '../repository/DownloadFavoriteVideoListRepositorys';
import { DownloadFavoriteVideoListCsvService } from "../service/DownloadFavoriteVideoListCsvService";


export class DownloadFavoriteVideoListCsvController extends RouteController {

    private readonly downloadFavoriteVideoListCsvService = new DownloadFavoriteVideoListCsvService((new DownloadFavoriteVideoListRepositorys()).get(RepositoryType.POSTGRESQL));

    protected getRouteSettingModel(): RouteSettingModel {

        return new RouteSettingModel(
            HttpMethodType.GET,
            this.doExecute,
            ApiEndopoint.FAVORITE_VIDEO_CSV_DOWNLOAD,
            [authMiddleware]
        );
    }

    // CSVヘッダ
    private readonly CSV_HEADER = [`動画ID`];
    // CSVファイル接頭辞
    private readonly CSV_FILE_PREFIX = "favorite_video_";

    /**
     * お気に入り動画リストのCSVを取得する
     * @param req 
     * @param res 
     * @returns 
     */
    public async doExecute(req: AuthenticatedRequest, res: Response, next: NextFunction) {

        const frontUserIdModel = req.userInfo.frontUserIdModel;

        // お気に入り動画リストを取得
        const favoriteVideoList = await this.downloadFavoriteVideoListCsvService.getFavoriteVideoList(
            frontUserIdModel,
        );

        // CSV出力内容
        const csvContent = `${this.CSV_HEADER.join(`,`)}\n${favoriteVideoList.map((e) => {
            return e.videoId;
        }).join(`\n`)}`;

        const formatted = DateUtil.getNowDatetime(`yyyy-MM-dd HH:mm:ss`);
        const fileName = `${this.CSV_FILE_PREFIX}${formatted}.csv`;

        const bom = "\uFEFF";
        res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);
        res.setHeader("Content-Type", "text/csv; charset=utf-8");
        res.send(`${bom}${csvContent}`);
    }
}