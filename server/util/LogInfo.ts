import { INFO_LOG_FILE, LOG_FILE_PATH } from "../common/const/FileInfoConst";
import { FileData } from "./FileData";
import { LogInterface } from "./LogInterface";

export class LogInfo implements LogInterface {

    // 出力先
    private static readonly FILE_PATH = `${LOG_FILE_PATH}${INFO_LOG_FILE}`;

    /**
     * ログ出力
     * @param output 
     */
    output(output: string,) {
        // ログファイルに追記
        FileData.append(LogInfo.FILE_PATH, output);
    }
}