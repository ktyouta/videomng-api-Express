import { parse } from "csv-parse/sync";
import { object } from "zod";

type CSV_COLUMN = `動画ID`;
type csvType = { [k in CSV_COLUMN]: string };

export class CsvListModel {

    private readonly _csvList: csvType[];

    constructor(file: Express.Multer.File) {

        if (!file) {
            throw Error(`取込用ファイルが存在しません。`);
        }

        const csvString = file.buffer.toString("utf-8");

        // CSVをリストに変換
        const csvList: csvType[] = parse(csvString, {
            columns: true,
            skip_empty_lines: true,
            trim: true,
        });

        const filterdCsvList = csvList.filter((e: csvType) => {
            return !!e[`動画ID`];
        });

        this._csvList = filterdCsvList;
    }

    get csvList() {
        return this._csvList;
    }
}