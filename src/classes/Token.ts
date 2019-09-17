import jwt, { JsonWebTokenError } from 'jsonwebtoken';
import { IUser } from '../models/user';
import config from '../config/config';

export default class Token {

    // ==========================================
    // Generate a token
    // ==========================================

    sign(user:IUser){
        let payload = {
            name: user.name,
            email: user.email,
            role: user.role
        }
        const token = jwt.sign(payload,config.secretKey,{  expiresIn: config.tokenExpiration });
        return token;
    }

    // ==========================================
    // Verify the authenticity of the token
    // ==========================================

    verify(token:any,callback:Function){
        jwt.verify(token,config.secretKey,(err:JsonWebTokenError,payload:any) => {
            if (err) {
                callback(err);
            }
            else{
                callback(null,payload);
            }
        });
    }

    // ==========================================
    // Get the payload
    // ==========================================

    decoded(token:any){
        let decoded:any = jwt.decode(token);
        return decoded;
    }
}