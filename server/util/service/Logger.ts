import { ERROR_LOG_FILE, INFO_LOG_FILE, LOG_FILE_PATH, WARN_LOG_FILE } from "../const/FileInfoConst";
import { DateUtil } from "./DateUtil";
import { FileData } from "./FileData";

export class Logger {

    // ログレベル
    private static readonly LOG_LEVEL = {
        INFO: "INFO",
        WARN: "WARN",
        ERROR: "ERROR",
    }

    // 出力先ファイル
    private static readonly LOG_FILE_PATH = {
        INFO: `${LOG_FILE_PATH}${INFO_LOG_FILE}`,
        WARN: `${LOG_FILE_PATH}${WARN_LOG_FILE}`,
        ERROR: `${LOG_FILE_PATH}${ERROR_LOG_FILE}`,
    }

    /**
     * ログを出力
     * @param level 
     * @param message 
     */
    private static log(level: string, message: string,) {

        // 現在時刻
        const timestamp = DateUtil.getNowDatetime('yyyy-MM-dd HH:mm:ss');
        // 出力内容
        const output = `[${timestamp}] [${level}] ${message}\n`;
        // 出力先
        let outputFile = "";

        // 出力先を取得
        switch (level) {
            case Logger.LOG_LEVEL.INFO:
                outputFile = Logger.LOG_FILE_PATH.INFO;
                break;
            case Logger.LOG_LEVEL.WARN:
                outputFile = Logger.LOG_FILE_PATH.WARN;
                break;
            case Logger.LOG_LEVEL.ERROR:
                outputFile = Logger.LOG_FILE_PATH.ERROR;
                break;
        }

        if (!outputFile) {
            return;
        }

        // ログファイルに出力
        FileData.append(outputFile, output);
    }


    /**
     * 通常ログ出力
     * @param message 
     */
    public static info(message: string) {

        Logger.log(Logger.LOG_LEVEL.INFO, message);
    }


    /**
     * 警告ログ出力
     * @param message 
     */
    public static warn(message: string) {

        Logger.log(Logger.LOG_LEVEL.WARN, message);
    }


    /**
     * エラーログ出力
     * @param message 
     */
    public static error(message: string) {

        Logger.log(Logger.LOG_LEVEL.ERROR, message);
    }
}