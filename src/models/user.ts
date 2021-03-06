import mongoose, { Schema, Document } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

export interface IUser extends Document {
    name: string,
    email: string,
    password: string,
    img:string,
    role: string,
    id_img:string,
    google:boolean
};

export interface ILogin extends Document {
    email: string,
    password: string
};

let validRoles = {
    values: ['ADMIN','USER'],
    message: '{VALUE} is not a valid role'
};

let user = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'USER',
        enum: validRoles
    },
    img: {
        type: String,
        required: false
    },
    id_img: {
        type: String,
        required: false
    },
    google: {
        type: Boolean,
        default: false
    }
});

user.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    delete userObject.id_img_url;
    return userObject;
};

user.plugin(uniqueValidator, {
    defaultMessage: "This custom message will be used as the default"
});


export default mongoose.model<IUser>('User',user);
