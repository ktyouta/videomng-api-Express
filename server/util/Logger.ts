import { DateUtil } from "./DateUtil";
import { LogError } from "./LogError";
import { LogInfo } from "./LogInfo";
import { LogInterface } from "./LogInterface";
import { LogWarn } from "./LogWarn";

// ログレベル
export enum LogLevel {
    info = `INFO`,
    warn = `WARN`,
    error = `ERROR`,
}

export class Logger {

    // ログレベルを追加する場合はloggersに追加する
    private static readonly loggers: Record<LogLevel, LogInterface> = {
        [LogLevel.info]: (new LogInfo()),
        [LogLevel.warn]: (new LogWarn()),
        [LogLevel.error]: (new LogError()),
    }

    /**
     * ログを出力
     * @param level 
     * @param message 
     */
    private static log(level: LogLevel, message: string,) {

        // 現在時刻
        const timestamp = DateUtil.getNowDatetime('yyyy-MM-dd HH:mm:ss');
        // 出力内容
        const output = `[${timestamp}] [${level}] ${message}\n`;

        // ログレベルに応じて出力
        const logger = this.loggers[level];

        logger.output(output);
    }


    /**
     * 通常ログ出力
     * @param message 
     */
    public static info(message: string) {
        Logger.log(LogLevel.info, message);
    }


    /**
     * 警告ログ出力
     * @param message 
     */
    public static warn(message: string) {
        Logger.log(LogLevel.warn, message);
    }


    /**
     * エラーログ出力
     * @param message 
     */
    public static error(message: string) {
        Logger.log(LogLevel.error, message);
    }
}