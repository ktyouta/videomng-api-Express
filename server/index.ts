import ENV from './env.json';
import { NextFunction, Request, Response } from 'express';
import { Logger } from './util/service/Logger';
import bodyParser from 'body-parser';
import { ROUTE_CONTROLLER_LIST } from './router/conf/RouteControllerList';


const express = require('express');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// コントローラーアクセス時のログ出力
function accessLogMiddleware(req: Request) {

    const userAgent = req.headers['user-agent'];
    const ip = req.ip;
    const queryParams = JSON.stringify(req.query);
    const requestBody = JSON.stringify(req.body);
    // 出力内容
    const output = `${req.method} ${req.originalUrl} | User-Agent: ${userAgent} | Query: ${queryParams} | Request Body: ${requestBody} | ip: ${ip}`;

    // ログに出力
    Logger.info(output);
};


// エラー時のログ出力
function errorLogMiddleware(err: Error, req: Request) {

    const userAgent = req.headers['user-agent'];
    const ip = req.ip;
    const queryParams = JSON.stringify(req.query);
    const requestBody = JSON.stringify(req.body);
    // 出力内容
    const output = `${req.method} ${req.originalUrl} | User-Agent: ${userAgent} | Query: ${queryParams} | Request Body: ${requestBody} | ip: ${ip} | ERROR: ${err}`;

    // エラーログに出力
    Logger.error(output);
};




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
    console.error(`Error occurred in Youtube Manage API : ${err.message}`);

    // エラーログ出力
    errorLogMiddleware(err, req);

    res.status(500).json({
        status: "error",
        message: "予期しないエラーが発生しました。",
    });
});


// サーバーを起動
app.listen(ENV.PORT, () => {

    console.log(`Youtube Manage API Server listening on port ${ENV.PORT}`);
});