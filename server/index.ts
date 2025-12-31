import bodyParser from 'body-parser';
import { NextFunction, Request, Response } from 'express';
import { accessLogMiddleware } from './middleware/accessLogMiddleware';
import { errorLogMiddleware } from './middleware/errorLogMiddleware';
import { ROUTE_CONTROLLER_LIST } from './router/conf/RouteControllerList';
import { envConfig } from './util/const/EnvConfig';
import { HTTP_STATUS_INTERNAL_SERVER_ERROR } from './util/const/HttpStatusConst';


const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require("cookie-parser");


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

const corsProtocol = envConfig.corsProtocol ?? ``;
const corsDomain = envConfig.corsDomain ?? ``;
const corsPort = envConfig.corsPort ?? ``;
const corsOrigin = `${corsProtocol}${corsDomain}${corsPort}`;

// プロキシ信頼設定
app.set('trust proxy', 1);

// cors設定
app.use(cors({
    origin: corsOrigin,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
        "Origin",
        "X-Requested-With",
        "Content-Type",
        "Accept",
        "Authorization",
        "X-CSRF-Token"
    ]
}));

// エラーハンドリング
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection:', reason);
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
});


//コントローラーアクセス時のログ出力
app.use((req: Request, res: Response, next: NextFunction) => {

    // アクセスログを出力
    accessLogMiddleware(req);

    next();
});


// コントローラーのルートを設定
ROUTE_CONTROLLER_LIST.forEach((e) => {
    app.use('/', e.router);
});


// エラー時共通処理
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {

    // コンソールログ出力
    console.error(`Error occurred in Video Manage API : ${err.message}`);

    // エラーログ出力
    errorLogMiddleware(err, req);

    res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
        status: HTTP_STATUS_INTERNAL_SERVER_ERROR,
        message: "予期しないエラーが発生しました。",
    });
});


// サーバーを起動
app.listen(envConfig.port, () => {
    console.log(`Video Manage API Server listening on port ${envConfig.port}`);
});