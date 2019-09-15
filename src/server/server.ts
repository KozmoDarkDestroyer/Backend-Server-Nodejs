import express, { Application } from 'express';
import bodyParser from 'body-parser';
import config from '../config/config';

export default class Server {
    private app:Application
    private port:number;

    constructor(){
        this.app = express();
        this.port = config.port;
        this.bodyParser();
    }

    static init():Server{
        return new Server();
    }

    // ==========================================
    // Initialize Server
    // ==========================================

    public listen(callback:Function){
        this.app.listen(this.port,callback(this.port));
    }

    public get App():Application{
        return this.app;
    }

    // ==========================================
    // Body Parser
    // ==========================================

    private bodyParser(){
        this.app.use(bodyParser.urlencoded({ extended: true}));
        this.app.use(bodyParser.json());
    }
}