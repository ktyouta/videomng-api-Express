export class ViewStatusModel {

    private readonly _viewStatus: string;

    constructor(viewStatus: string) {

        this._viewStatus = viewStatus;
    }

    get viewStatus() {
        return this._viewStatus;
    }
}