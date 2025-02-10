import { Router } from "express";

export abstract class RouteController {

    public router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }

    abstract routes(): void;
}