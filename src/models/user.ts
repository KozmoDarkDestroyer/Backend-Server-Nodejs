import mongoose, { Schema, Document } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

export interface IUser extends Document {
    name: string,
    email: string,
    password: string,
    img_url:string,
    role: string,
    id_img_url:string
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
        required: true,
        default: 'USER',
        enum: validRoles
    },
    img_url: {
        type: String,
        required: false
    },
    id_img_url: {
        type: String,
        required: false
    }
});

user.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject;
};

user.plugin(uniqueValidator, {
    defaultMessage: "This custom message will be used as the default"
});


export default mongoose.model<IUser>('User',user);
