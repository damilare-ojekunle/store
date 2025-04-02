import StoreService from "../services/StoreService";
import StoreRepository from "../repositories/StoreRepository";
import { BadRequestError, NotFoundError } from "../utils/errors";

// Mock the repository so that we don't hit the actual database
jest.mock("../repositories/StoreRepository");

describe("StoreService Unit Tests", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("createStore", () => {
        it("should create a new store when valid data is provided", async () => {
            const storeData = { name: "Test Store", address: "123 Test St", description: "A sample store" };
            const userId = "user123";
            const mockStore = { _id: "storeId", ...storeData, owner: userId };

            (StoreRepository.createStore as jest.Mock).mockResolvedValue(mockStore);

            const result = await StoreService.createStore(storeData, userId);

            expect(StoreRepository.createStore).toHaveBeenCalledWith({ ...storeData, owner: userId });
            expect(result).toEqual(mockStore);
        });

        it("should throw a BadRequestError if required fields are missing", async () => {
            const storeData = { description: "Missing required fields" };
            await expect(StoreService.createStore(storeData, "user123")).rejects.toThrow(BadRequestError);
        });
    });

    it("should throw a BadRequestError if required fields are missing", async () => {
        // Missing both name and address
        const storeData = { description: "Missing required fields" };

        await expect(StoreService.createStore(storeData, "user123"))
            .rejects.toThrow(BadRequestError);
    });
});

describe("getStoreById", () => {
    it("should return a store if found", async () => {
        const mockStore = { _id: "storeId", name: "Test Store", address: "123 Test St", description: "A sample store" };
        (StoreRepository.findStoreById as jest.Mock).mockResolvedValue(mockStore);

        const result = await StoreService.getStoreById("storeId");

        expect(StoreRepository.findStoreById).toHaveBeenCalledWith("storeId");
        expect(result).toEqual(mockStore);
    });

    it("should throw a NotFoundError if store is not found", async () => {
        (StoreRepository.findStoreById as jest.Mock).mockResolvedValue(null);

        await expect(StoreService.getStoreById("nonExistentId"))
            .rejects.toThrow(NotFoundError);
    });
});

describe("getAllStores", () => {
    it("should return all stores", async () => {
        const mockStores = [
            { _id: "storeId1", name: "Store 1", address: "Address 1", description: "Desc 1" },
            { _id: "storeId2", name: "Store 2", address: "Address 2", description: "Desc 2" },
        ];
        (StoreRepository.findAllStores as jest.Mock).mockResolvedValue(mockStores);

        const result = await StoreService.getAllStores();

        expect(StoreRepository.findAllStores).toHaveBeenCalled();
        expect(result).toEqual(mockStores);
    });
});

describe("updateStore", () => {
    it("should update and return the store if found", async () => {
        const updateData = { name: "Updated Store" };
        const mockUpdatedStore = { _id: "storeId", name: "Updated Store", address: "123 Test St", description: "A sample store" };
        (StoreRepository.updateStore as jest.Mock).mockResolvedValue(mockUpdatedStore);

        const result = await StoreService.updateStore("storeId", updateData);

        expect(StoreRepository.updateStore).toHaveBeenCalledWith("storeId", updateData);
        expect(result).toEqual(mockUpdatedStore);
    });

    it("should throw a NotFoundError if store to update is not found", async () => {
        (StoreRepository.updateStore as jest.Mock).mockResolvedValue(null);

        await expect(StoreService.updateStore("nonExistentId", { name: "New Name" }))
            .rejects.toThrow(NotFoundError);
    });
});

describe("deleteStore", () => {
    it("should delete and return the store if found", async () => {
        const mockStore = { _id: "storeId", name: "Test Store", address: "123 Test St", description: "A sample store" };
        (StoreRepository.deleteStore as jest.Mock).mockResolvedValue(mockStore);

        const result = await StoreService.deleteStore("storeId");

        expect(StoreRepository.deleteStore).toHaveBeenCalledWith("storeId");
        expect(result).toEqual(mockStore);
    });

    it("should throw a NotFoundError if store to delete is not found", async () => {
        (StoreRepository.deleteStore as jest.Mock).mockResolvedValue(null);

        await expect(StoreService.deleteStore("nonExistentId"))
            .rejects.toThrow(NotFoundError);
    });
});

