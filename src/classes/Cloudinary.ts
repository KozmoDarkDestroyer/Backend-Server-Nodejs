import config from "../config/config";
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: config.cloudinaryCloudName,
    api_key: config.cloudinaryApiKey,
    api_secret: config.cloudinaryApiSecret
});

export default class Cloudinary {

    public static uploadCloudinary(reqFile:string,callback:Function){
        cloudinary.uploader.upload(reqFile,(err:any,result:any) => {
            if (err) {
                return callback(err);
            }
            else{
                return callback(null,result)
            }
        });
    }

    public static deleteCloudinary(id_img:string){
        cloudinary.uploader.destroy(id_img);
    }
}