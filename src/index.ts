import * as dotenv from "dotenv";
import Server from "./server";
import * as linebot from 'linebot';
import config from './config/main';

dotenv.config();

const port = process.env.PORT || config.PORT;
const bot = linebot({
    channelId: process.env.CHANNEL_ID,
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.CHANNEL_SECRET,
    verify: true
});
const server = new Server(bot);
server.start(port);