import config from '../config/config';
import { OAuth2Client } from 'google-auth-library';

export default class GoogleSignIn {
    private token:any;
    private client:OAuth2Client;

    constructor(token:any){
        this.token = token;
        this.client = new OAuth2Client(config.googleClientId);
    }

    async verify() {
        const ticket = await this.client.verifyIdToken({
            idToken: this.token,
            audience: config.googleClientId
        });

        const payload:any = ticket.getPayload();

        return {
            name: payload.name,
            email: payload.email,
            img_url: payload.picture,
            google: true
        }
      }
};