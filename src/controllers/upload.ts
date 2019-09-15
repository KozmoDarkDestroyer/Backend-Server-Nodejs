import { Request, Response } from "express";
import mongoose from 'mongoose';
import { searchUser } from '../functions/SearchCollections';
import { uploadCollection } from '../middlewares/uploadCollection';

export default class UploadCtrl {

    // ==========================================
    // Upload images
    // ==========================================

    async uploadImage(req:Request,res:Response){
        const id:string = req.params.id;
        const size:number = 2500000;
        const table:string = req.params.table;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                ok: false,
                error: {
                        message: `Invalid id ${ id }, Conversion to ObjectId failed`
                }
            });
        }

        switch (table) {
            case 'user':
                    searchUser(id)
                    .then((user:any) => {
                        uploadCollection(user,req,res,size);
                    })
                    .catch((err) => {
                        return res.status(500).json({
                            ok: false,
                            err: {
                                message: err
                            }
                        })
                    })
                break;
        
            default:
                res.status(400).json({
                    ok: false,
                    err: {
                        message: `The ${ table } collection does not exist in the database`
                    }
                });
            break;
        }
    }
};


