import multer from 'multer';
import uuid from 'uuid';
import { Request } from 'express';
import path from 'path';
import fs from 'fs';

export default class Multer {
    private imgPath:string;
    private size:number;
    private storage:any;
    
    constructor(imgPath:string,size:number){
        this.imgPath = imgPath;
        this.size = size;
        this.storageMulter(this.imgPath);
    }

    storageMulter(imgPath:string){
        this.storage = multer.diskStorage({
            destination: imgPath,
            filename: function(req:Request,file:Express.Multer.File,callback:Function){
                callback(null,`${ new Date().getMilliseconds() }${ uuid() }${ path.extname(file.originalname) }`.toLowerCase())
            }
        });
    }

    uploadFile(){
        const upload = multer({
            storage: this.storage,
            dest: this.imgPath,
            limits: { fileSize: this.size },
            fileFilter(req:Request,file:Express.Multer.File,callback:Function){
                const fileType = /jpg|jpeg|png|gif/;
                const mimetype =   fileType.test(file.mimetype);
                const ext = fileType.test(path.extname(file.originalname)); 
                if (mimetype && ext) {
                    callback(null,true);
                }
                else{
                    callback(`The extension ${ file.mimetype } is not allowed`);
                }
            }
        }).single('file');
        return upload;
    }

    deleteFile(imgPath:string, img:string) {

        if (fs.existsSync(`${ imgPath }/${ img }`)) {
            fs.unlinkSync(`${ imgPath }/${ img }`)
        }
    }
};