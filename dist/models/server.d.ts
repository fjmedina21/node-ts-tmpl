import "reflect-metadata";
import "dotenv/config";
export declare class Server {
    private app;
    private PORT;
    private readonly path;
    contructor(): void;
    private middlewares;
    private dbConnection;
    private routes;
    private listen;
}
