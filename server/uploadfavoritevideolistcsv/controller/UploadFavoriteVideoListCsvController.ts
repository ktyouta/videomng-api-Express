import { Router, Request, Response, NextFunction } from 'express';
import { RouteController } from '../../router/controller/RouteController';
import { AsyncErrorHandler } from '../../router/service/AsyncErrorHandler';
import { HTTP_STATUS_CREATED, HTTP_STATUS_OK, HTTP_STATUS_UNPROCESSABLE_ENTITY } from '../../util/const/HttpStatusConst';
import { ApiResponse } from '../../util/service/ApiResponse';
import { ZodIssue } from 'zod';
import { FrontUserIdModel } from '../../internaldata/common/properties/FrontUserIdModel';
import { HttpMethodType, RouteSettingModel } from '../../router/model/RouteSettingModel';
import { ApiEndopoint } from '../../router/conf/ApiEndpoint';
import { UploadFavoriteVideoListCsvService } from '../service/UploadFavoriteVideoListCsvService';
import { PrismaTransaction } from '../../util/service/PrismaTransaction';
import { FavoriteVideoTransaction, Prisma, PrismaClient } from '@prisma/client';
import multer from "multer";
import { parse } from "csv-parse/sync";
import { RegisterVideoIdListModel } from '../model/RegisterVideoIdListModel';
import { VideoIdModel } from '../../internaldata/common/properties/VideoIdModel';
import { CsvListModel } from '../model/CsvListModel';


export class UploadFavoriteVideoListCsvController extends RouteController {

    private readonly uploadFavoriteVideoListCsvService = new UploadFavoriteVideoListCsvService();

    protected getRouteSettingModel(): RouteSettingModel {

        return new RouteSettingModel(
            HttpMethodType.POST,
            this.doExecute,
            ApiEndopoint.FAVORITE_VIDEO_CSV_UPLOAD,
            [multer().single("file")]
        );
    }

    /**
     * CSV取込
     * @param req 
     * @param res 
     * @returns 
     */
    public async doExecute(req: Request, res: Response, next: NextFunction) {

        // jwtの認証を実行する
        const jsonWebTokenVerifyModel = await this.uploadFavoriteVideoListCsvService.checkJwtVerify(req);
        const frontUserIdModel: FrontUserIdModel = jsonWebTokenVerifyModel.frontUserIdModel;

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