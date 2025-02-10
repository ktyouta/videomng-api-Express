import { FileData } from "./FileData";
import * as fs from 'fs';

export class JsonFileData {

    private static readonly fs = fs;

    /**
     * ファイル書き込み
     * @param filePath 
     * @param data 
     * @returns 
     */
    public static overWrite<T>(filePath: string, data: T) {

        try {
            //json文字列に変換
            const stream: string = JSON.stringify(data, null, '\t');
            this.fs.writeFileSync(filePath, stream);
        } catch (err) {
            throw Error(`jsonファイルの書き込みに失敗しました。 filePath:${filePath} ERROR:${err}`);
        }
    }


    /**
     * ファイルを読み込んでオブジェクトを返却
     * @param filePath 
     * @returns 
     */
    public static getFileObj<T>(filePath: string): T {

        //ファイルの読み込み
        const fileData = FileData.read(filePath);

        try {
            return JSON.parse(fileData);
        } catch (err) {
            throw Error(`jsonのパースに失敗しました。 filePath:${filePath} ERROR:${err}`);
        }
    }
}