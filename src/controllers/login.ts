import Token from '../classes/Token';
import { Request, Response } from "express";
import User, { IUser, ILogin } from '../models/user';
import bcrypt from 'bcrypt';
import GoogleSignIn from '../classes/GoogleSignIn';
import { MongoError } from 'mongodb';

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
                user,
                token
            })

        } catch (error) {
            return res.status(500).json({
                ok: false,
                message: 'Login failed',
                error
            })
        }
    }

    // ===========================================
    // Login user Google
    // ===========================================

    async loginGoogle(req:Request,res:Response){
        const tokenGoogle = req.get("token");

        try {
            const client = new GoogleSignIn(tokenGoogle);
            const payload = await client.verify();

            User.findOne({ email: payload.email }, (error:MongoError,user:IUser) => {
                if (error) {
                    return res.status(500).json({
                        ok: false,
                        error
                    });
                }

                if (user) {
                    if (user.google === false) {
                        return res.status(400).json({
                            ok: false,
                            error: {
                                message: 'You must use your normal authentication'
                            }
                        }); 
                    }
                    else {
                        const jwt = new Token();
                        const token = jwt.sign(user);

                        res.status(200).json({
                            ok: true,
                            user,
                            token
                        })
                    }
                }

                else {
                    const user:IUser = new User({
                        name: payload.name,
                        email: payload.email,
                        img: payload.img_url,
                        role: 'USER',
                        password: bcrypt.hashSync('no-password',10),
                        google: payload.google
                    });

                    try {
                        user.save();

                        const jwt = new Token();
                        const token = jwt.sign(user);
                        
                        res.status(200).json({
                            ok: true,
                            user,
                            token
                        })
                        
                    } catch (error) {
                        res.status(500).json({
                            ok: false,
                            error
                        });
                    }
                }

            });

        } catch (error) {
            res.status(400).json({
                ok: false,
                message: 'invalid token',
                error
            });
        }       
    }
}