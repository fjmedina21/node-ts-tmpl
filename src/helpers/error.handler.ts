export class ErrorHandler extends Error {
    readonly ok: boolean = false;
    readonly statusCode: number;

    constructor(message: string, statusCode: number) {
        super()
        this.message = message;
        this.statusCode = statusCode;
    }

    toJson() {
        return { ok: this.ok, message: this.message, }
    }
}

