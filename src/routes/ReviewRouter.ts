import { Router, Request, Response, NextFunction } from 'express';
import * as linebot from 'linebot';

class ReviewRouter{
    
    router:Router;
    
    
    constructor(){
        this.router = Router();
        this.routes();
    }

    public getReviewPlace(req:Request,res:Response,next:NextFunction){
        let placeId = req.params.placeId;
        let userId = req.query.userId;
        const bot = linebot({
            channelId: process.env.CHANNEL_ID,
            channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
            channelSecret: process.env.CHANNEL_SECRET,
            verify: true
        });
        
        console.log(placeId);
        console.log(userId);
        let msg = "Review - "+placeId+"\n"+
                  "Tempat makan ini cukup menarik, harga makanan tidak terlalu mahal, hanya saja tempat parkir yang kurang cukup luas. Secara overall sudah cukup baik, baik juga untuk dijadikan tempat tongkrongan";
        bot.push(userId,msg);
    }

    public getNothing(req:Request,res:Response,next:NextFunction){
        res.json({"status":"success"});
    }

    // Assign Route list to the router
    routes(){
        this.router.get('/',this.getNothing);        
        this.router.get('/:placeId',this.getReviewPlace);
        
    }   
    
}

const router = new ReviewRouter().router;
export default router;