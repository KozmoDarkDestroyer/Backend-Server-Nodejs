import { Request, Response, NextFunction } from "express";
import { JsonWebTokenError } from 'jsonwebtoken';
import Token from '../classes/Token';

let jwt = new Token();

let verifyToken = (req:Request,res:Response,next:NextFunction) => {
    let token = req.get('token');
    
    jwt.verify(token,(err:JsonWebTokenError) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: err
                }
            });
        }

        next();
    });
};

export default verifyToken;