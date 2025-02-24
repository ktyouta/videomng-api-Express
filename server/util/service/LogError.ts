import { ERROR_LOG_FILE, LOG_FILE_PATH } from "../const/FileInfoConst";
import { FileData } from "./FileData";
import { LogInterface } from "./LogInterface";

export class LogError implements LogInterface {

    // 出力先
    private static readonly FILE_PATH = `${LOG_FILE_PATH}${ERROR_LOG_FILE}`;

    /**
     * ログ出力
     * @param output 
     */
    output(output: string,) {
        // ログファイルに追記
        FileData.append(LogError.FILE_PATH, output);
    }
}