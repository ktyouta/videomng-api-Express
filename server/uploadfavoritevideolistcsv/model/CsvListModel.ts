import { parse } from "csv-parse/sync";
import { object } from "zod";


export class CsvListModel {

    private readonly _csvList: string[][];

    constructor(file: Express.Multer.File) {

        if (!file) {
            throw Error(`取込用ファイルが存在しません。`);
        }

        const csvString = file.buffer.toString("utf-8");

        // CSVをリストに変換
        const csvList: string[][] = parse(csvString, {
            columns: false,
            skip_empty_lines: true,
            trim: true,
            from_line: 2,
        });

        const filterdCsvList = csvList.filter((e: string[]) => {
            return !!e[0];
        });

        this._csvList = filterdCsvList;
    }

    get csvList() {
        return this._csvList;
    }
}