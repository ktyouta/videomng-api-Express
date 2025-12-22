import { Prisma } from '@prisma/client';
import { NextFunction, Response } from 'express';
import multer from "multer";
import { authMiddleware } from '../../middleware/authMiddleware';
import { ApiEndopoint } from '../../router/conf/ApiEndpoint';
import { RouteController } from '../../router/controller/RouteController';
import { HttpMethodType, RouteSettingModel } from '../../router/model/RouteSettingModel';
import { AuthenticatedRequest } from '../../types/AuthenticatedRequest';
import { HTTP_STATUS_OK } from '../../util/const/HttpStatusConst';
import { ApiResponse } from '../../util/service/ApiResponse';
import { PrismaTransaction } from '../../util/service/PrismaTransaction';
import { CsvListModel } from '../model/CsvListModel';
import { RegisterVideoIdListModel } from '../model/RegisterVideoIdListModel';
import { UploadFavoriteVideoListCsvService } from '../service/UploadFavoriteVideoListCsvService';


export class UploadFavoriteVideoListCsvController extends RouteController {

    private readonly uploadFavoriteVideoListCsvService = new UploadFavoriteVideoListCsvService();

    protected getRouteSettingModel(): RouteSettingModel {

        return new RouteSettingModel(
            HttpMethodType.POST,
            this.doExecute,
            ApiEndopoint.FAVORITE_VIDEO_CSV_UPLOAD,
            [
                multer().single("file"),
                authMiddleware,
            ]
        );
    }

    /**
     * CSV取込
     * @param req 
     * @param res 
     * @returns 
     */
    public async doExecute(req: AuthenticatedRequest, res: Response, next: NextFunction) {

        const frontUserIdModel = req.jsonWebTokenUserModel.frontUserIdModel;
        const file = req.file;

        if (!file) {
            throw Error(`取込用ファイルが送信されていません。`);
        }

        // CSVリスト
        const csvListModel = new CsvListModel(file);

        // 動画IDリスト
        const registerVideoIdListModel = new RegisterVideoIdListModel(csvListModel);

        // トランザクション開始
        PrismaTransaction.start(async (tx: Prisma.TransactionClient) => {

            // 削除済み動画の削除フラグを元に戻す
            await this.uploadFavoriteVideoListCsvService.updateDeleteFlg(
                frontUserIdModel,
                registerVideoIdListModel,
                tx,
            );

            // 動画を登録
            await this.uploadFavoriteVideoListCsvService.register(
                frontUserIdModel,
                registerVideoIdListModel,
                tx,
            );

            return ApiResponse.create(res, HTTP_STATUS_OK, `お気に入り動画に登録しました。`);
        }, next);
    }
}