import User, { IUser } from '../models/user';
import { MongoError } from 'mongodb';

// ========================================================================
// Search Users
// ========================================================================

export function searchUsers(regexp:RegExp) {
    return new Promise((resolve,reject) => {
        User.find()
            .or([{ name: regexp }, { email: regexp }])
            .exec((err:MongoError,users:IUser[]) => {
                if (err) {
                    reject(err);
                }
                else{
                    resolve(users);
                }
            })
    })
}

// ========================================================================
// Search User
// ========================================================================

export function searchUser(id:string){
    return new Promise((resolve,reject) => {
        User.findById(id,(err:MongoError,user:IUser) => {
            if (err) {
                reject(err);
            }
            else if (user === null) {
                reject(`The id ${ id } does not exist in the database`);
            }
            else{
                resolve(user);
            }   
        })
    })
}