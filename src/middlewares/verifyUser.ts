import { Request, Response, NextFunction } from "express";
import Token from '../classes/Token';

let jwt = new Token();

let verifyUser = (req:Request,res:Response,next:NextFunction) => {
    let token = req.get('token');

    let payload = jwt.decoded(token);
    
    if (payload.role === 'USER' || payload.role === 'ADMIN') {
        next();
    }
    else{
        return res.status(401).json({
            ok: false,
            err: {
                message: 'Unauthorized User'
            }
        });
    }
}

export default verifyUser;