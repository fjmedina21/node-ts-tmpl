import { Response, Request } from "express";
export declare function usersGet(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function userGetById(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function userPost(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function userPut(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function userDelete(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
