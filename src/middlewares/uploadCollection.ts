import path from 'path';
import Multer from '../classes/Multer';
import { Response, Request } from 'express';
import Cloudinary from '../classes/Cloudinary';
import { MongoError } from 'mongodb';

export function uploadCollection(obj:any,req:Request,res:Response,size:number){
    const imgPath:string = path.join(__dirname,`../public/uploads`);
    const multer = new Multer(imgPath,size);
    const uploadImage = multer.uploadFile();

    uploadImage(req,res,(err) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: {
                        message: err
                }
            });
        }
        else{
            Cloudinary.deleteCloudinary(obj.id_img_url);
            Cloudinary.uploadCloudinary(req.file.path,(err:any,result:any) => {
                if (err) {
                    multer.deleteFile(imgPath,req.file.filename);
                    res.status(500).json({
                        ok: false,
                        err: {
                            message: err
                        }
                    })
                }
                else{
                    obj.id_img_url = result.public_id;
                    obj.img_url = result.secure_url;

                    obj.save((err:MongoError,userSave:any) => {
                        if (err) {
                            multer.deleteFile(imgPath,req.file.filename);
                            Cloudinary.deleteCloudinary(obj.id_img_url);
                            return res.status(500).json({
                                ok: false,
                                err: {
                                    message: err
                                }
                            }); 
                        }
                        else{
                            res.status(200).json({
                                ok: true,
                                user: userSave
                            });
                            multer.deleteFile(imgPath,req.file.filename);
                        }
                    })
                }
            })
        }
    })
}