

import * as linebot from 'linebot';
import * as schedule from 'node-schedule';
import * as fetch from 'node-fetch';

import RestClient from "../Indosat/RestClient";
import admin from '../../config/admin';
declare const Promise: any;

class Advertisement{

    private headers: Object;
    private db: any;
    private client: RestClient;
    private usersRef:any;
    constructor(private bot:linebot){
        this.headers={
            Accept:"application/json",
            "Content-Type":"application/json"
        };
        this.client = new RestClient();
        
        this.db = admin.database();
        this.usersRef = admin.database().ref("users");
        
        this.scheduleJob();
    }

    scheduleJob(){
        const rule1 = new schedule.RecurrenceRule();
        rule1.hour=23;

        schedule.scheduleJob(rule1, ()=>{
            this.usersRef.off();
            this.smsNotifWorker();
        })
    }

    smsNotifWorker(){
        let client = this.client;

        client.auth().then((access)=>{
            this.usersRef.on("child_added",(snapshot)=>{
                let userId:String = snapshot.key;
                let data:Object = snapshot.val();
                let indosatValidNumber = ["62815","62816","62855","62856","62857"];
                let phoneNumber = data["phoneNumber"];
                if(indosatValidNumber.indexOf(phoneNumber.substring(0,5)) > -1){
                    client.sendSMSNotif(
                        access,phoneNumber,
                        "Hai Pengguna Kania!\n"+
                        "Saat ini Kania sedang menyediakan layanan Targeted Promote berbasis lokasi, bagi 100 pengguna pertama akan mendapatkan potongan 1/2 harga untuk 1 kali promote.\n"+
                        "Segera chat aku untuk mengetahui lebih lanjut!\n\n"+
                        "Kania: @kaniachatbot\nhttps://kania.gravicodev.id"
                    );
                }
            });

        });
    }

    smsLBAWorker(){
        let client = this.client;
        client.auth().then((access)=>{
            
        }); 

    }
}

export default Advertisement;