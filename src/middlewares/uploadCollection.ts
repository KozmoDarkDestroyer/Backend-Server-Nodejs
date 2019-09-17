import path from 'path';
import Multer from '../classes/Multer';
import { Response, Request } from 'express';
import Cloudinary from '../classes/Cloudinary';
import { MongoError } from 'mongodb';

export function uploadCollection(model:any,req:Request,res:Response,size:number){

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
            Cloudinary.deleteCloudinary(model.id_img);
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
                    model.id_img = result.public_id;
                    model.img = result.secure_url;

                    model.save((err:MongoError,modelSave:any) => {
                        if (err) {
                            multer.deleteFile(imgPath,req.file.filename);
                            Cloudinary.deleteCloudinary(model.id_img);
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
                                model: modelSave
                            });
                            multer.deleteFile(imgPath,req.file.filename);
                        }
                    })
                }
            })
        }
    })
}