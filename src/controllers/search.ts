import { Response, Request } from 'express';
import { searchUsers } from '../classes/SearchCollections';

export default class SearchCtrl {

    // ==========================================
    // Search by collection
    // ==========================================

    async searchCollections(req:Request,res:Response) {
        const parameter:string = req.params.parameter;
        const regexp:RegExp = new RegExp(parameter,'i');
        const table:string = req.params.table;
        let promise:any;

        switch (table) {
            case 'user':
                promise = searchUsers(regexp);
                break;
        
            default:
                res.status(400).json({
                    ok: false,
                    message: 'The types of search are only: users, ......',
                    error: {
                            message: `the table ${ table } is not valid`
                    }
                });
            break;
        }

        promise
            .then((info:any) => {
                res.status(200).json({
                    ok: true,
                    [table]: info
                });
            })

    }

    // ==========================================
    // General search
    // ==========================================

    async searchAll(req:Request,res:Response){
        const parameter:string = req.params.parameter;
        const regexp:RegExp = new RegExp(parameter,'i');

        Promise.all([
            searchUsers(regexp)
        ])
        .then((results:any) => {
            res.status(200).json({
                ok: true,
                users: results[0]
            });
        })
        .catch((err) => {
            res.status(500).json({
                ok: true,
                err: {
                    message: err
                }
            });
        })
    }

}