import dotenv from "dotenv";

dotenv.config();

export const envConfig = {
    databaseUrl: process.env.DATABASE_URL,
    youtubeApiKey: process.env.YOUTUBE_API_KEY,
    jwtKey: process.env.VIDEOMNG_JWT_KEY,
};