import * as linebot from 'linebot';
import * as fetch from 'node-fetch';
import * as googleMapClient from "@google/maps";
import config from "../../config/main";
declare var Promise: any;

import ButtonTemplates from "../Templates/ButtonTemplates";
import ConfirmTemplates from "../Templates/ConfirmTemplates";
import CarouselTemplates from "../Templates/CarouselTemplates";
import ImageCarouselTemplates from "../Templates/ImageCarouselTemplates";
import ActionBuilder from "../Templates/ActionBuilder";

import RestClient from "../Indosat/RestClient";

class Messages{

    public token:String;
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
            imageCarousel.addColumn(
                "https://image.ibb.co/cVxXJG/Voucher_1.png",
                ActionBuilder.createPostbackAction("Redeem","null")
            );
            imageCarousel.addColumn(
                "https://image.ibb.co/jSPq5w/Voucher_2.png",
                ActionBuilder.createPostbackAction("Redeem","null")                
            );
            imageCarousel.addColumn(
                "https://image.ibb.co/m8UeyG/Voucher_3.png",
                ActionBuilder.createPostbackAction("Redeem","null")
            );
            imageCarousel.addColumn(
                "https://image.ibb.co/d3DuXb/voucher_4.png",
                ActionBuilder.createPostbackAction("Redeem","null")
            );
            msg = imageCarousel.build(); 
        }
        else if(_userIn == "coba"){
            let rest = new RestClient();
            console.log(rest.auth());
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
        let latitude = this.event.message.latitude;
        let longitude = this.event.message.longitude;

        this.findPlace(latitude,longitude);
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

    findPlace(latitude,longitude){
        let mapsClient = googleMapClient.createClient({
            key: process.env.GMAPS_API_KEY
        });

        var placeQuery = {
            location: [latitude, longitude],
            radius: 1000,
            language: "id",
            keyword: "tempat makan",
            type: "restaurant"
          };

        mapsClient.placesNearby(placeQuery, (err,res) =>{
            if(err){
                console.log("Error query tempat : ",err);                
            }

            let msg;
            let result = res.json.results;
            let resultLength = result.length;
            let limit = 5;

            let carouselMsg = new CarouselTemplates("Makan Disini aja");
            carouselMsg.addColumn(
                "https://image.ibb.co/eX0PXb/Featured.png",
                "[\u2605\u2605\u2605] Ayam Goreng Nelongso ",
                "Jl. Nginden Semolo 43, Surabaya",
                [
                    ActionBuilder.createUriAction("Liat Map","https://www.google.com/maps/@-7.3001232,112.7660767,20z")
                ]
            );

            if(resultLength == 0){
                msg = 'Aku ngga bisa nemuin tempat makan dengan radius 1KM dari tempat kamu nih, coba jalan aja dulu';
                this.event.reply(msg);
            }
            else if(resultLength < limit){
                limit = result.length;
            }

            for(let i=0;i<resultLength;i++){
                let photoQuery;
                try{
                    photoQuery={ 
                        maxwidth: 400,
                        photoreference: result[i].photos[0].photo_reference,          
                    };
                    
                }catch(err){
                    // console.log("Ternyata di sini errornya",err);
                    continue;
                }


                let myFunction = function(i){
                    mapsClient.placesPhoto(photoQuery, (err,res)=>{
                        if(err)
                            console.log("Error query place photo : ", err);
                        
                        carouselMsg.addColumn(
                            "https://" + res.req.socket._host + "" + res.req.path,
                            trimString40(result[i].name),
                            trimString60(result[i].vicinity),
                            [
                                ActionBuilder.createUriAction("Liat Map","https://www.google.com/maps/@"+result[i].geometry.location.lat+","+result[i].geometry.location.lng+",20z")
                            ]
                        );
                        
                        if(carouselMsg.column.length == limit){
                            msg = carouselMsg.build();
                            console.log(JSON.stringify(msg));

                            this.bot.reply(this.token,msg);
                            // this.event.reply("Jancuk")
                            //     .then((data)=>{
                            //         console.log(data);
                            //     })
                            //     .catch((err)=>{
                            //         // this.event.reply("Kania bingung, ada yang salah, maaf ya, coba lagi deh");
                            //     });
                        }
                        else if(carouselMsg.column.length == 0 && i == (resultLength-1)){
                            console.log("Ngga ketemu apa apa");
                            
                            msg = 'Aku ngga bisa nemuin tempat makan dengan radius 1KM dari tempat kamu nih, coba jalan aja dulu';

                            this.event.reply(msg);
                        }
                        else if(carouselMsg.column.length < limit && i==(resultLength-1)){
                            msg = 'Kania bingung, ada yang salah, maaf ya, coba lagi deh';

                            this.event.reply(msg);
                        }
                    });
                }

                myFunction(i);
            }

            if(resultLength == 0){
                msg = 'Aku ngga bisa nemuin tempat makan dengan radius 1KM dari tempat kamu nih, coba jalan aja dulu';
                this.event.reply(msg);  
            }

        });
    }

}

function trimString40(stringnya){
    if(stringnya.length >= 40){
      return stringnya.substring(0,39);
    }else{
      return stringnya;
    }
  }
  
  function trimString60(stringnya){
    if(stringnya.length >= 60){
      return stringnya.substring(0,59);
    }else{
      return stringnya;
    }
  }

export default Messages;
