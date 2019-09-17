import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import Cloudinary from '../classes/Cloudinary';
import User, { IUser } from '../models/user';

export default class UserCtrl {
    
    // ==========================================
    // Get all users
    // ==========================================

    async getUsers(req:Request,res:Response,next:NextFunction){
        let perPage = Number(req.params.perpage || 5);
        let page = Number(req.params.page || 1);

        try {
            const users:IUser[] = await User.find({ }, 'name email img role google')                                    
                                            .skip((perPage * page) - perPage)
                                            .limit(perPage)
                                            .sort({ name: 1 })

            User.countDocuments((err:any,count:any) => {
                if (err) return next(err);
                res.status(200).json({
                    ok: true,
                    users,
                    pages: Math.ceil(count/perPage),
                    count
                });
            })

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

                if (model.role === null) {
                    user.role = user.role;
                    user.password = bcrypt.hashSync(model.password,10);
                }
                else{
                    user.role = model.role;
                }

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

            await Cloudinary.deleteCloudinary(user.id_img);

        } catch (error) {
            return res.status(500).json({
                ok: false,
                error
            });
        }
    }
};