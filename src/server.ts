import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as compression from "compression";
import * as logger from 'morgan';
import * as helmet from 'helmet';
import * as cors from 'cors';
import * as path from 'path';
import config from './config/main';
import * as linebot from 'linebot';
import * as http from "http";

import Messages from './controllers/LINE/Messages';
import Follow from './controllers/LINE/Follow';
import Unfollow from './controllers/LINE/Unfollow';
import JoinGroup from './controllers/LINE/JoinGroup';

import Advertisement from './controllers/App/Advertisement';

import ReviewRouter from './routes/ReviewRouter';

class Server {

    app:express.Application;
    bot:linebot;

    constructor(bot?:linebot){
        this.bot = bot; 
        this.app = express();

        this.linehandler();
      
        // Config for REST API
        this.config();
        this.routes();

        this.advertisement();
    }

    config(){

        // express middleware
        this.app.use(bodyParser.urlencoded({extended:true}));
        this.app.use(bodyParser.json());
        this.app.use(cookieParser());
        this.app.use(compression());
        this.app.use(logger('dev'));
        this.app.use(helmet());
        this.app.use(cors());
    
        this.app.use((req,res,next)=>{
            res.header('Access-Control-Allow-Origin', config.HOST_URL);
            res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials');
            res.header('Access-Control-Allow-Credentials', 'true');
            next();
        })
    }

    routes():void{
        
        let router:express.Router;
        router = express.Router();

        router.get("/",(req,res,next)=>{
            res.send('{Kania Chatbot - IWIC 2017}');
        });

        this.app.use('/',router);
        this.app.use('/reviews',ReviewRouter);
    }

    linehandler(){
        let linebotparser = this.bot.parser();
        
        this.app.use('/linewebhook',linebotparser);
        const bot = this.bot;
        
        bot.on("message",(event)=>{
            new Messages(event,bot);
        });
        
        bot.on('follow', (event)=>{
            new Follow(event);
        });
        
        bot.on('unfollow', (event)=>{ 
            new Unfollow(event);
        });
        
        bot.on('join', (event)=>{ 
            new JoinGroup(event);
        });
        
        bot.on('leave', (event)=>{ 
        
        });
        
        bot.on('postback', (event)=>{ 
            let uri = event.postback.data;
            console.log(uri);
            http.get("https://mykania.herokuapp.com"+uri);
        });
    }

    advertisement(){
        new Advertisement(this.bot);
    }

    public start(PORT?:number|string|boolean):void{
        if (process.env.NODE_ENV !== config.TEST_ENV) {
            this.app.listen(PORT || config.PORT);
            console.log(`Server listening on port ${config.PORT}`);
          } else {
            this.app.listen(PORT || config.PORT);
            console.log(`TESTING Server listening on port ${config.TEST_PORT}`);
          }
    }
}

// Export
export default Server;