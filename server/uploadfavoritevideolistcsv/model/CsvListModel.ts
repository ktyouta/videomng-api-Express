import { parse } from "csv-parse/sync";


export class CsvListModel {

    private readonly _csvList: string[][];

    constructor(file: Express.Multer.File) {

        if (!file) {
            throw Error(`取込用ファイルが存在しません。`);
        }

        const csvString = file.buffer.toString("utf-8");

        // CSVをリストに変換
        const csvList: string[][] = parse(csvString, {
            columns: true,
            skip_empty_lines: true,
            trim: true,
        });

        this._csvList = csvList;
    }

    get csvList() {
        return this._csvList;
    }
}