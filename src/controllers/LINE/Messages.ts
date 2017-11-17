import * as linebot from 'linebot';
import * as fetch from 'node-fetch';
import * as googleMapClient from "@google/maps";
import config from "../../config/main";
import admin from '../../config/admin';
declare var Promise: any;

import ButtonTemplates from "../Templates/ButtonTemplates";
import ConfirmTemplates from "../Templates/ConfirmTemplates";
import CarouselTemplates from "../Templates/CarouselTemplates";
import ImageCarouselTemplates from "../Templates/ImageCarouselTemplates";
import ImagemapMessage from "../Templates/ImagemapMessage";
import ActionBuilder from "../Templates/ActionBuilder";

import Utils from "../App/Utils";
import RestClient from "../Indosat/RestClient";

class Messages{

    public token:String;
    public headers: Object;
    private db=admin.database();
    
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
        
        if(_userIn == "@howto"){
            msg = [
                "Untuk berinteraksi dengan Kania, kalian cukup membagi lokasi kamu ke Kania, dan Kania akan memberitahu tempat makan terdekatmu. Secara default, Kania mencari tempat makan yang berjarak 1KM dari sekitarmu.",
                "Untuk menggunakan tambahan fitur pencarian tempat makan kalian dapat menggunakan perintah berikut ini:\n"+
                "1. Set-jarak: 1km (Dengan ketentuan minimal jarak yang dapat dimasukkan adalah 1 kilometer)"+
                "2. Set-keyword: bakso (Dengan tanpa ketentuan. Secara default adalah rumah makan)"
            ];
        }
        else if(_userIn == "@help"){
            msg= ["Saat ini Kania masih dalam tahap pengembangan, untuk perintah yang dapat digunakan adalah sebagai berikut:\n"+
                "1. @howto - Perintah untuk mengetahui cara berinteraksi dengan Kania\n"+
                "2. @promo - Perintah untuk mengetahui promo kuliner yang ada sekitar kalian\n"+
                "3. @voucher - Perintah untuk mengetahui voucher kuliner yang sedang berlaku di sekitar kalian"+
                "4. @help - Perintah untuk mendapatkan informasi bantuan pada Kania\n"+
                "5. @about - Perintah untuk mengetahui tentang Kania\n",
                Utils.showImagemap()
            ]
        }
        else if(_userIn == "@about"){
            msg =[
                "Kania merupakan Chatbot yang akan membantu kamu untuk mengetahui tempat makanan terdekat disekitarmu.\nKania menggunakan bantuan Google untuk mencari informasi tersebut.",
                "Status Kania Saat ini:\nDeveloper Trial Bot\nVersion: 1.0\nTeknologi: Typescript (2.5.3) & NodeJS (6.11.2)\nDeveloper: ardikabs@gmail.com & dimas.rizky.hp@gmail.com",
                Utils.showImagemap()
            ]         
        }
        else if(_userIn == "@techdev"){
            msg= "Buat kalian yang ingi belajar bagaimana Kania bekerja untuk bisa mencari tempat makan di sekitar kamu, kamu bisa melakukan request source code Kania melalui kania@gravicodev.id";
        }
        else if(_userIn == "@voucher"){      
            let imageCarousel = new ImageCarouselTemplates("Voucher ini bisa kamu redeem, buruan!");
            imageCarousel.addColumn(
                "https://image.ibb.co/ezb3Xm/kode_voucher1.png",
                ActionBuilder.createPostbackAction("Redeem","null")
            );
            imageCarousel.addColumn(
                "https://image.ibb.co/g4NMJR/kode_voucher2.png",
                ActionBuilder.createPostbackAction("Redeem","null")                
            );
            imageCarousel.addColumn(
                "https://image.ibb.co/jg0VCm/kode_voucher3.png",
                ActionBuilder.createPostbackAction("Redeem","null")
            );
            msg = [imageCarousel.build(), Utils.showImagemap()]; 
        }
        else if(_userIn == "@promo"){      
            let imageCarousel = new ImageCarouselTemplates("Promo sedang berada disekitarmu loh!");
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
            msg = [imageCarousel.build(), Utils.showImagemap()]; 
        }
        else if(_userIn == "@subscribe"){
            msg = [
                "Fitur Subscribe, merupakan fitur yang memungkinkankan kamu untuk mendapatkan promo dan voucher secara otomatis yang dapat kamu atur harian/mingguan/bulanan.\n"+
                "Jadi kamu pasti dapat informasi terbaru untuk promo dan voucher berdasarkan lokasi terakhir yang kamu kirim.",
                "Untuk memulai menggunakan fitur Subscribe, kamu hanya perlu mengkonfirmasikan nomor handphone kamu dengan perintah berikut ini:\n"+
                "1. Join-subscribe: 0856xxxxxx"
            ];
        }
        else if(_userIn.includes("set-")){
            let opt = _userIn.substring(4).split(":");      
            this.event.source.profile()
                .then((profile)=>{
                    let val:Object = {};
                    if(opt[0].trim() === "jarak"){
                        let radius = opt[1].trim().split("km")[0].trim();
                        radius = radius * 1000;
                        this.db.ref("userSetup").child(profile.userId).child("jarak").set(radius);  
                    }
                    else if(opt[0].trim() === "keyword"){
                        let keyword = opt[1].trim();
                        this.db.ref("userSetup").child(profile.userId).child("keyword").set(keyword);
                    }
                });
            msg = "Oke pengaturan baru untuk ["+opt[0].trim()+"] menjadi ["+opt[1].trim()+"] telah diterima.";

        }

        else if(_userIn.includes("join-subscribe")){
            let numSplit = _userIn.trim().split(":")[1].trim();

            if(numSplit[0] == "0"){
                let phoneNumber = "62"+numSplit.substring(1,numSplit.length);
                this.event.source.profile().then((profile)=>{
                    this.db.ref("users").child(profile.userId).update({phoneNumber:phoneNumber});                    
                });
            }
        }

        else if(_userIn == "@menu"){
            msg = Utils.showImagemap();
        }

        else if(_userIn == "@coba"){
            let client = new RestClient();

            client.auth().then((access)=>{
            
                client.sendSMSNotif(access,"6285655164677",
                    "Hai Pengguna Kania!\n"+
                    "Saat ini Kania sedang menyediakan layanan Targeted Promote berbasis lokasi, bagi 100 pengguna pertama akan mendapatkan potongan 1/2 harga untuk 1 kali promote.\n"+
                    "Segera chat aku untuk mengetahui lebih lanjut!\n\n"+
                    "Kania: @kaniachatbot\nhttps://kania.gravicodev.id"
                ).then((res)=>{
                    console.log(res.success);
                });

                client.getCityLBA(access).then((res)=>{
                    console.log(res.results[0].cityId)
                });

                client.getLocationLBA(access).then((res)=>{
                    console.log(res.results[0].locationId);
                })
            });
        }
        
             
        else{msg = 'Aku masih belum diajarin ngomong itu sama developerku, kayanya sih dia masih sibuk, tapi kamu bisa coba chat "@help" buat command yang aku pahamin :D';}
        
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

        // this.findPlace(latitude,longitude);
        let mapsClient = googleMapClient.createClient({
            key: process.env.GMAPS_API_KEY
        });


        this.event.source.profile()
            .then((profile)=>{

                // Update longitude dan latitude user history
                this.db.ref("users").child(profile.userId).update({
                    last_latitude:latitude,
                    last_longitude:longitude
                });

                // Check User Setup (Jarak & Keyword)
                this.db.ref("userSetup").child(profile.userId)
                    .once("value",(snapshot)=>{
                        var placeQuery = {
                            location: [latitude, longitude],
                            radius: snapshot.child("jarak").val() || 1000,
                            language: "id",
                            keyword: snapshot.child("keyword").val() || "tempat makan",
                            type: "restaurant"
                          };
                
                        mapsClient.placesNearby(placeQuery, (err,res) =>{
                            if(err){
                                console.log("Error query tempat : ",err);                
                            }
                
                            let msg;
                            let result = res.json.results;
                            let resultLength = result.length;
                            let limit = 10;
                            let sumErrPhotoQuery = 0;                                                          
                
                            let carouselMsg = new CarouselTemplates("Makan Disini aja");
                            
                            // Featured Product
                            // carouselMsg.addColumn(
                            //     "https://image.ibb.co/eX0PXb/Featured.png",
                            //     "[\u2605\u2605\u2605] Ayam Goreng Nelongso ",
                            //     "Jl. Nginden Semolo 43, Surabaya",
                            //     [
                            //         ActionBuilder.createUriAction("Liat Map","https://www.google.com/maps/@-7.3001232,112.7660767,20z")
                            //     ]
                            // );
                
                            if(resultLength == 0){
                                msg = 'Aku ngga bisa nemuin tempat makan dengan radius 1KM dari tempat kamu nih, coba jalan aja dulu';
                                this.event.reply(msg);
                            }
                            else {
                                if(resultLength < limit){
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
                                        sumErrPhotoQuery++;
                                        continue;
                                    }
                    
                                    mapsClient.placesPhoto(photoQuery, (err,res)=>{
                                        if(err)
                                            console.log("Error query place photo : ", err);
                                        
                                        carouselMsg.addColumn(
                                            "https://" + res.req.socket._host + "" + res.req.path,
                                            trimString40(result[i].name),
                                            trimString60(result[i].vicinity),
                                            [
                                                ActionBuilder.createUriAction("Liat Map","https://maps.google.com/maps/@"+result[i].geometry.location.lat+","+result[i].geometry.location.lng+",20z"),
                                                // ActionBuilder.createUriAction("Liat Map2","https://www.google.com/maps/search/?api=1"+"&query="+(result[i].name).replace(/\s/g,'')+"&query_place_id="+result[i].place_id),                                                
                                                ActionBuilder.createUriAction("Liat Map2","https://maps.google.com/maps/search/?api=1&query=PisaKafeMenteng&query_place_id=ChIJj61I_yT0aS4Rf9KRrSAKOyo"),
                                                ActionBuilder.createUriAction("Review","https://www.google.com")
                                            ]
                                        );

                                        if(carouselMsg.column.length === limit){
                                            msg = carouselMsg.build();
                                            console.log(msg);
                                            this.event.reply(msg);     
                                        }
                                        else if(carouselMsg.column.length === resultLength-sumErrPhotoQuery){
                                            // Kondisi ketika tempat tersedia namun tidak semuanya memiliki informasi foto
                                            msg = carouselMsg.build();                            
                                            this.event.reply(msg);
                                        }
                                        else if(carouselMsg.column.length === 0 && i === (resultLength-1)){
                                            console.log("Ngga ketemu apa apa");                      
                                            msg = 'Aku ngga bisa nemuin tempat makan dengan radius 1KM dari tempat kamu nih, coba jalan aja dulu';
                                            this.event.reply(msg);
                                        }
                
                                    });
                                }    
                            }
                
                        });
                    });
                
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

    findPlace(latitude,longitude){
        
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
