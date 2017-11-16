import { Router, Request, Response, NextFunction } from 'express';
import * as linebot from 'linebot';
import config from '../config/main';



class MainRouter{

    router:Router;

    constructor(){
        this.router = Router();
        this.routes();
    }
    
    getAllRestaurant(req:Request,res:Response,next:NextFunction){
        
    }

    routes(){
        this.router.post('/',this.getAllRestaurant);
    }   
    
}

const mainRouter = new MainRouter();
mainRouter.routes();

const router = mainRouter.router;
export default router;