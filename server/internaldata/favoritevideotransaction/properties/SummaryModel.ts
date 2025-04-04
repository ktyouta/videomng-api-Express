export class SummaryModel {

    private readonly _summary: string;

    constructor(summary: string) {

        if (summary.length > 500) {
            throw Error(`要約が501文字以上入力されています。`);
        }

        this._summary = summary;
    }

    get summary() {
        return this._summary;
    }
}