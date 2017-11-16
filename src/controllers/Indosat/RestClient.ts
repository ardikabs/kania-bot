import * as linebot from 'linebot';
import config from "../../config/main";
declare var Promise: any;
import * as fetch from 'node-fetch';
import * as FormData from 'form-data';



export default class RestClient {

    private headers: {};
    endpoint: String;
    constructor() {

        this.headers = {
            Authorization: "Basic " + btoa(process.env.CONSUMER_KEY + ":" + process.env.CONSUMER_SECRET),
            'Content-Type': 'application/x-www-form-urlencoded'
        };

        this.endpoint = "https://blinke-stage.apigee.net";
    }

    auth(): void {
        let form = new FormData();
        form.append('grant_type', 'client_credentials');

        return fetch(this.endpoint + "/oauth/token", { method: "POST", headers: this.headers, body: form })
            .then((res) => {
                return res.json();
            })
            .then((json) => {
                console.log(json);
                return json;
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