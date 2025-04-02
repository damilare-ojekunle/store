import mongoose from "mongoose";

export default class Database {
    static async connect(): Promise<void> {
        try {
            await mongoose.connect(process.env.MONGO_URI as string);
            console.log("DB Connected");
        } catch (error) {
            console.error("MongoDB Connection Error:", error);
            process.exit(1);
        }
    }
}

