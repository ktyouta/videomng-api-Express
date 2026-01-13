import { Request } from 'express';
import { CONFIDENTIIAL_FIELDS } from '../common/const/ConfidentialFields';
import { Logger } from '../logger/Logger';


/**
 * コントローラーアクセス時のログ出力コントローラーアクセス時のログ出力
 * @param req 
 */
export function accessLogMiddleware(req: Request) {

    const userAgent = req.headers['user-agent'];
    const ip = req.ip;
    const queryParams = JSON.stringify(req.query);
    const confidentialBody = { ...req.body };
    CONFIDENTIIAL_FIELDS.forEach(e => {
        if (confidentialBody[e]) {
            confidentialBody[e] = '[REDACTED]';
        }
    });
    const requestBody = JSON.stringify(confidentialBody);

    // 出力内容
    const output = `${req.method} ${req.originalUrl} | User-Agent: ${userAgent} | Query: ${queryParams} | Request Body: ${requestBody} | ip: ${ip}`;

    // ログに出力
    Logger.info(output);
};