import * as linebot from 'linebot';
import config from "../../config/main";
import * as fetch from 'node-fetch';
declare var Promise: any;

import ButtonTemplates from "../Templates/ButtonTemplates";
import ConfirmTemplates from "../Templates/ConfirmTemplates";
import CarouselTemplates from "../Templates/CarouselTemplates";
import ImageCarouselTemplates from "../Templates/ImageCarouselTemplates";
import ActionBuilder from "../Templates/ActionBuilder";

class Messages{

    public token:string;
    public headers: {};
    
    constructor(public event:any,public bot:linebot){
        this.token = event.replyToken;
        this.headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        };

        // Webhook handler
        let type = event.message.type;
        if(type == "text"){
            if(event.source.type == "user"){
                this.userMsg();                
            }
        }
        else if(type == "location"){
            this.locationMsg();
        }
        else{
            let msg="Kalau masih bingung sama Eksi, gunakan perintah @help aja";
            this.event.reply(msg)
                .then((data)=>{
                    console.log("Success :",data);
                })
                .catch((error)=>{
                    console.log("Error :",error);
                });
        }
    }

    public userMsg(){
        // User Input
        let msg;
        let replyToken = this.event.replyToken;
        let _userIn = this.event.message.text.toLowerCase();
        
        if(_userIn == "howto"){msg= "Kalau kamu mau cari tempat makan, langsung aja share location kamu ke aku";}
        else if(_userIn == "help"){msg= 'Kania masih tahap beta, jadi command-nya cuman ada tiga, "help", "howto", "tentang kania", dan buat yang mau intip source code kania bisa pake command "techdev" :D';}
        else if(_userIn == "tentang kania"){msg = 'Kania bisa bantuin kamu cari tempat makan di sekitar kamu, kania dibantu sama kk google buat cari tempat makan terdekat';}
        else if(_userIn == "techdev"){msg= 'Buat kalian yang mau belajar gimana caranya Kania bisa cari tempat makan di sekitar kamu, kamu bisa intip github Kania di sini : https://github.com/dimasmamot/kania, bebas buat dicabangin kok kak';}
        else if(_userIn == "voucher"){      
            let imageCarousel = new ImageCarouselTemplates("Voucher ini bisa buat makan kamu disekitarmu");
            // imageCarousel.addColumn(
            //     "https://image.ibb.co/cVxXJG/Voucher_1.png",
            //     ActionBuilder.createPostbackAction("Redeem","null")
            // );
            // imageCarousel.addColumn(
            //     "https://image.ibb.co/jSPq5w/Voucher_2.png",
            //     ActionBuilder.createPostbackAction("Redeem","null")                
            // );
            // imageCarousel.addColumn(
            //     "https://image.ibb.co/m8UeyG/Voucher_3.png",
            //     ActionBuilder.createPostbackAction("Redeem","null")
            // );
            // imageCarousel.addColumn(
            //     "https://image.ibb.co/d3DuXb/voucher_4.png",
            //     ActionBuilder.createPostbackAction("Redeem","null")
            // );
            msg = imageCarousel.build(); 
            console.log(JSON.stringify(msg));
        }
        else{msg = 'Aku masih belum diajarin ngomong itu sama developerku, kayanya sih dia masih sibuk, tapi kamu bisa coba chat "help" buat command yang aku pahamin :D';}
        
        this.event.reply(msg)
            .then((data)=>{
                console.log("Success Reply Message:"+data);
            })
            .catch((err)=>{
                console.log("Error Reply Message:"+err);
            });
    }   

    public locationMsg(){
        let addr = this.event.message.address;
        this.event.reply("Alamat :"+addr)
            .then((data)=>{
                console.log("Success :",data);
            })
            .catch((error)=>{
                console.log("Error :",error);
            });
    }

    public groupMsg(){
        // Group Input
        let _groupIn = this.event.message.text;
    }
  
    public imageMsg(){
        // Message Id
        let msgId = this.event.message.id;

        // Reply Message for Image Message
        // this.event.reply("Gambar yang kamu kirim bisa dilihat dimari "+config.HOST_URL+"content/image/"+messageId)
        //     .then((data)=>{
        //         console.log("Success :",data);
        //     })
        //     .catch((error)=>{
        //         console.log("Error :",error);
        //     });
    }

    public videoMsg(){
        // Message Id
        let msgId = this.event.message.id;

        // Reply Message for Video Message
        // this.event.reply("Video yang kamu kirim bisa dilihat dimari "+config.HOST_URL+"content/video/"+messageId)
        //     .then((data)=>{
        //         console.log("Success :",data);
        //     })
        //     .catch((error)=>{
        //         console.log("Error :",error);
        //     });
    }

    public audioMsg(){
        // Message Id
        let msgId = this.event.message.id;

        // Reply Message for Audio Message

        // this.event.reply("Audio yang kamu kirim bisa diakses dimari "+config.HOST_URL+"content/audio/"+messageId)
        //     .then((data)=>{
        //         console.log("Success :",data);
        //     })
        //     .catch((error)=>{
        //         console.log("Error :",error);
        //     });
    }

    get (path){
        return fetch(path,{method : "GET", headers: this.headers});
    }

    post (path, body){
        return fetch(path,{method : "POST", headers: this.headers, body: JSON.stringify(body)});
    }


    push (userId, message){
        this.bot.push(userId,message)
            .then((data)=>{
                console.log("Success :"+data);
            })
            .catch((err)=>{
                console.log("Error :"+err);
            });
    }
}

function validate(val):any[]{
    let result = [];
    if(val.includes("@jne")){
        result.push(true);
        result.push("@jne");
        result.push(5);
        return result;
    }
    else if(val.includes("@sicepat")){
        result.push(true);
        result.push("@sicepat");
        result.push(9);        
        return result;    
    }
    else if(val.includes("@wahana")){
        result.push(true);
        result.push("@wahana");
        result.push(8);        
        return result;    
    }
    result.push(false)
    return result;
}

function splitInput(val,index):string{
    return val.substring(index);
}

export default Messages;
