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
        const bot = linebot({
            channelId: process.env.CHANNEL_ID,
            channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
            channelSecret: process.env.CHANNEL_SECRET,
            verify: true
        });
        
        console.log(placeId);
        
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