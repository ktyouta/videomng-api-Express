import dotenv from "dotenv";

dotenv.config();

export const envConfig = {
    databaseUrl: process.env.DATABASE_URL,
    youtubeApiKey: process.env.YOUTUBE_API_KEY,
    jwtKey: process.env.VIDEOMNG_JWT_KEY,
    port: process.env.PORT,
    corsProtocol: process.env.CORS_PROTOCOL,
    corsDomain: process.env.CORS_DOMAIN,
    corsPort: process.env.CORS_PORT,
    timeout: process.env.TIMEOUT,
    allowUserOperation: process.env.ALLOW_USER_OPERATION,
    envProduction: process.env.ENV_PRODUCTION,
    accessTokenExpires: process.env.ACCESS_TOKEN_EXPIRES,
};