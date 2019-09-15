import Token from '../classes/Token';
import { Request, Response } from "express";
import User, { IUser, ILogin } from '../models/user';
import bcrypt from 'bcrypt';

export default class loginCtrl {

    // ===========================================
    // Login
    // ===========================================

    async login(req:Request,res:Response){
        const model:ILogin = req.body;
        try {
            const user:IUser|null = await User.findOne({ email: model.email });

            if (!user) {
                return res.status(400).json({
                    ok: false,
                    error: {
                        message: 'Bad credentials - email',
                    }
                });
            }

            if (!bcrypt.compareSync(model.password,user.password)) {
                return res.status(401).json({
                    ok: false,
                    error: {
                        message: 'Bad credentials - password',
                    }
                });
            }

            const jwt = new Token();

            const token = jwt.sign(user);

            res.status(200).json({
                ok: true,
                user: token
            })

        } catch (error) {
            return res.status(500).json({
                ok: false,
                message: 'Login failed',
                error
            })
        }
    }

}