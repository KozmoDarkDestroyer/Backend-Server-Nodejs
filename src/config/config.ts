import dotenv from 'dotenv';
dotenv.config();

interface IConfig {
    port:number,
    url: string,
    secretKey: string,
    tokenExpiration:string,
    cloudinaryCloudName:string,
    cloudinaryApiKey:string,
    cloudinaryApiSecret: string,
    googleClientId: string,

};

const config:IConfig = {
    port: Number(process.env.PORT),
    url: String(process.env.MONGO_URL),
    secretKey: String(process.env.AUTH_JWT_SECRET),
    tokenExpiration: String(process.env.TOKEN_EXPIRATION),
    cloudinaryCloudName: String(process.env.CLOUDINARY_CLOUD_NAME),
    cloudinaryApiKey: String(process.env.CLOUDINARY_API_KEY),
    cloudinaryApiSecret: String(process.env.CLOUDINARY_API_SECRET),
    googleClientId: String(process.env.GOOGLE_CLIENT_ID)
};

export default config;