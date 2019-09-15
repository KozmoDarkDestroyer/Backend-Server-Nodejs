import mongoose from 'mongoose';
import config from '../config/config';
import { MongoError } from 'mongodb';

export default class Database {
    private static instance:Database;
    private url:string;

    private constructor(){
        this.url = config.url;
        this.mongoConnect();
    }

    // ==============================================
    // Get the database instance (Singleton Pattern)
    // ==============================================

    static getInstance(){
        if (!this.instance) {
            this.instance = new Database();
        }
        else{
            return this.instance;
        }
    }

    // =============================================
    // Connect to the database
    // =============================================

    mongoConnect(){
        mongoose.connect(this.url,{ useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true })
            .then(() => console.log('Database online'))
            .catch((err:MongoError) => console.log(err));
    }
};