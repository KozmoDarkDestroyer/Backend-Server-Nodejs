import { Request, Response } from "express";
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import Cloudinary from '../classes/Cloudinary';
import User, { IUser } from '../models/user';

export default class UserCtrl {
    
    // ==========================================
    // Get all users
    // ==========================================

    async getUsers(req:Request,res:Response){
        const limit:number = Number(req.query.limit) || 10;
        const skip:number = Number(req.query.skip) || 0;

        try {
            const users:IUser[] = await User.find({ }, 'name email img_url role')                                    
                                            .limit(limit)
                                            .skip(skip)
                                            .sort({ name: 1 })
            res.status(200).json({
                ok: true,
                users
            });

        } catch (error) {
            return res.status(500).json({
                ok: false,
                message: 'Error loading users',
                error
            });
        }    
    }

    // ==========================================
    // Get user
    // ==========================================

    async getUser(req:Request,res:Response){
        const id:string = String(req.params.id);

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: `Invalid id ${ id }, Conversion to ObjectId failed`
                }
            });
        }

        try {
            const user:IUser|null = await User.findById(id);
            
            if (user === null) {
                return res.status(404).json({
                    ok: false,
                    error: {
                        message: `The id ${ id } does not exist in the database`
                    }
                });
            }
            
            res.status(200).json({
                ok: true,
                user
            });

        } catch (error) {
            return res.status(500).json({
                ok: false,
                message: 'Error loading user',
                error
            });
        }
    }

     // ==========================================
    // Post user
    // ===========================================

    async createUser(req:Request,res:Response){
        const model:IUser = req.body;

        const user:IUser = new User({
            name: model.name,
            email: model.email,
            password: bcrypt.hashSync(model.password,10),
            role: model.role
        });

        try {
            await user.save();
            res.status(200).json({
                ok: true,
                user
            });

        } catch (error) {
            return res.status(400).json({
                ok: false,
                message: 'Error creating user',
                error
            });
        }
    }

    // ===========================================
    // Put user
    // ===========================================

    async putUser(req:Request,res:Response){
        const id:string = req.params.id;
        const model:IUser = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: `Invalid id ${ id }, Conversion to ObjectId failed`
                }
            });
        }

        try {
            const user:IUser|null = await User.findById(id);

            if (user === null) {
                return res.status(404).json({
                    ok: false,
                    error: {
                        message: `The id ${ id } does not exist in the database`
                    }
                });
            }

            try {
                user.name = model.name;
                user.password = bcrypt.hashSync(model.password,10);

                await user.save();

                res.status(200).json({
                    ok: true,
                    user
                });

            } catch (error) {
                return res.status(500).json({
                    ok: false,
                    message: 'Error updating user',
                    error
                });
            }

        } catch (error) {
            return res.status(500).json({
                ok: false,
                message: 'Error updating user',
                error
            });
        }
    }

    // ===========================================
    // Delete user
    // ===========================================

    async deleteUser(req:Request,res:Response){
        const id:string = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: `Invalid id ${ id }, Conversion to ObjectId failed`
                }
            });
        }

        try {
            const user:IUser|null = await User.findByIdAndRemove(id);
            if (user === null) {
                return res.status(404).json({
                    ok: false,
                    error: {
                        message: `The id ${ id } does not exist in the database`
                    }
                });
            }

            res.status(200).json({
                ok: true,
                user
            });

            await Cloudinary.deleteCloudinary(user.id_img_url);

        } catch (error) {
            return res.status(500).json({
                ok: false,
                error
            });
        }
    }
};