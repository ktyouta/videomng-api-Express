import { HTTP_STATUS_CREATED, HTTP_STATUS_NO_CONTENT, HTTP_STATUS_UNPROCESSABLE_ENTITY } from "../../util/const/HttpStatusConst";
import { ApiResponse } from "../../util/service/ApiResponse";
import { Router, Request, Response, NextFunction } from 'express';
import { HttpMethodType, RouteSettingModel } from "../../router/model/RouteSettingModel";
import { ApiEndopoint } from "../../router/conf/ApiEndpoint";
import { FrontUserInfoMasterRepositoryInterface } from "../../internaldata/frontuserinfomaster/repository/interface/FrontUserInfoMasterRepositoryInterface";
import { PrismaClientInstance } from "../../util/service/PrismaClientInstance";
import { FrontUserLoginMasterRepositoryInterface } from "../../internaldata/frontuserloginmaster/repository/interface/FrontUserLoginMasterRepositoryInterface";
import { FrontUserIdModel } from "../../internaldata/common/properties/FrontUserIdModel";
import { FrontUserInfoMasterInsertEntity } from "../../internaldata/frontuserinfomaster/entity/FrontUserInfoMasterInsertEntity";
import { RouteController } from "../../router/controller/RouteController";
import { DownloadFavoriteVideoListCsvService } from "../service/DownloadFavoriteVideoListCsvService";
import { DateUtil } from "../../util/service/DateUtil";


export class DownloadFavoriteVideoListCsvController extends RouteController {

    private readonly downloadFavoriteVideoListCsvService = new DownloadFavoriteVideoListCsvService();

    protected getRouteSettingModel(): RouteSettingModel {

        return new RouteSettingModel(
            HttpMethodType.GET,
            this.doExecute,
            ApiEndopoint.FAVORITE_VIDEO_CSV_DOWNLOAD
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
    public async doExecute(req: Request, res: Response, next: NextFunction) {

        // jwtの認証を実行する
        const jsonWebTokenVerifyModel = await this.downloadFavoriteVideoListCsvService.checkJwtVerify(req);
        const frontUserIdModel: FrontUserIdModel = jsonWebTokenVerifyModel.frontUserIdModel;

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