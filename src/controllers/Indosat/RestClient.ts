import * as linebot from 'linebot';
import config from "../../config/main";
declare var Promise: any;
import * as fetch from 'node-fetch';



export default class RestClient {

    private headersAuth: Object;
    private headers: Object;
    
    endpoint: String;
    constructor() {

        this.headersAuth = {
            Authorization: "Basic "+ new Buffer(process.env.CONSUMER_KEY + ":" + process.env.CONSUMER_SECRET).toString('base64'),
            'Content-Type': 'application/x-www-form-urlencoded'
        };

        this.headers = {
            'Content-Type': 'application/json'
        };

        this.endpoint = "https://blinke-stage.apigee.net";
        
    }

    auth(){
        return fetch(this.endpoint + "/oauth/token", { method: "POST", headers: this.headersAuth, body: "grant_type=client_credentials" })
            .then((res) => {
                return res.json();
            })
            .then((json)=>{
                return json.access_token;
            })
    }

    sendSMSNotif(accessToken:String, msisdn:String, message:String) {
        this.headers["Authorization"] = "Bearer "+accessToken;
        let body = {
            "msisdn":msisdn,
            "message":message
        };
        return this.post("/imx/sms",body)
                    .then((res) => {
                        // success, transId, message 
                        return res.json();
                    });
    }

    getCityLBA(accessToken:String) {
        this.headers["Authorization"] = "Bearer "+accessToken;
        return this.get("/lba/cities")
                    .then((res)=>{
                        // success, totalResults, results
                        return res.json();
                    });  
    }

    getLocationLBA(accessToken:String){
        this.headers["Authorization"] = "Bearer "+accessToken;
        return this.get("/lba/locations")
                    .then((res)=>{
                        // success, totalResults, results
                        return res.json();
                    });
    }

    createCampaignLBA(accessToken:String){
        this.headers["Authorization"] = "Bearer "+accessToken;
        let body ={
            "name":"Kesenian November",
            "description":"Promosi Kesenian",
            "categoryId":3,
            "channels":[{
                "sender":"Kania",
                "locationId":"161",
                "smsQty":10,
                "message":"Testing",
                "startDate":"2017-11-16",
                "endDate":"2017-11-21",
                "telcoId":"isat"
            }],

        };
        return this.post("/lba/campaign",body).then((res)=>{
            return res.json();
        })

    }

    getCampaignLBA(accessToken:String,campaignId:String){
        this.headers["Authorization"] = "Bearer "+accessToken;
        
        return this.get(this.endpoint+"/lba/campaign/"+campaignId+"/result").then((res)=>{
            return res.json();
        })
    }


    get(path): any{
        return fetch(this.endpoint + path, { method: "GET", headers: this.headers });
    }

    post(path, body): any{
        return fetch(this.endpoint + path, { method: "POST", headers: this.headers, body: JSON.stringify(body) });
    }
}