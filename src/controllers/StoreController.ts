import { Request, Response, NextFunction } from "express";
import StoreService from "../services/StoreService";
import { AsyncHandler } from "../utils/AsyncHandler";
import HTTP_STATUS from "../utils/httpStatus";

export default class StoreController {
    // static createStore = AsyncHandler(async (req: Request, res: Response) => {
    //     const userId = req.user;
    //     if (!req.user) {
    //         return res.status(HTTP_STATUS.UNAUTHORIZED).json({ success: false, message: "Unauthorized" });
    //     }
    //     const store = await StoreService.createStore(req.body, userId);
    //     res.status(HTTP_STATUS.CREATED).json({ success: true, data: store });
    // });

    static getStore = AsyncHandler(async (req: Request, res: Response) => {
        const store = await StoreService.getStoreById(req.params.id);
        res.status(HTTP_STATUS.OK).json({ success: true, data: store });
    });

    static getAllStores = AsyncHandler(async (req: Request, res: Response) => {
        const stores = await StoreService.getAllStores();
        res.status(HTTP_STATUS.OK).json({ success: true, data: stores });
    });

    static updateStore = AsyncHandler(async (req: Request, res: Response) => {
        const updatedStore = await StoreService.updateStore(req.params.id, req.body);
        res.status(HTTP_STATUS.OK).json({ success: true, data: updatedStore });
    });

    static deleteStore = AsyncHandler(async (req: Request, res: Response) => {
        const deletedStore = await StoreService.deleteStore(req.params.id);
        res.status(HTTP_STATUS.OK).json({ success: true, data: deletedStore });
    });
}
