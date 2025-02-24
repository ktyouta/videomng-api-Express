import { ERROR_LOG_FILE, LOG_FILE_PATH, WARN_LOG_FILE } from "../const/FileInfoConst";
import { FileData } from "./FileData";
import { LogInterface } from "./LogInterface";


export class LogWarn implements LogInterface {
    // 出力先
    private static readonly FILE_PATH = `${LOG_FILE_PATH}${WARN_LOG_FILE}`;

    /**
     * ログ出力
     * @param output 
     */
    output(output: string,) {
        // ログファイルに追記
        FileData.append(LogWarn.FILE_PATH, output);
    }
}