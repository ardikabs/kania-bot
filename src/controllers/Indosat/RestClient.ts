import * as linebot from 'linebot';
import config from "../../config/main";
declare var Promise: any;
import * as fetch from 'node-fetch';



export default class RestClient {

    private headers: {};
    endpoint: String;
    constructor() {

        this.headers = {
            Authorization: "Basic "+ new Buffer(process.env.CONSUMER_KEY + ":" + process.env.CONSUMER_SECRET).toString('base64'),
            'Content-Type': 'application/x-www-form-urlencoded'
        };

        this.endpoint = "https://blinke-stage.apigee.net";
        
    }

    auth(): void {
        return fetch(this.endpoint + "/oauth/token", { method: "POST", headers: this.headers, body: "grant_type=client_credentials" })
            .then((res) => {
                return res.json();
            })
            .then((json) => {
                return json.access_token;
            })
    }

    getSendSMS() {

    }

    getSendSMSLBA() {

    }

    get(path): any{
        return fetch(this.endpoint + path, { method: "GET", headers: this.headers });
    }

    post(path, body): any{
        return fetch(this.endpoint + path, { method: "POST", headers: this.headers, body: JSON.stringify(body) });
    }
}