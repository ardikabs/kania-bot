import * as admin from "firebase-admin";
import config from "./main";
import * as dotenv from "dotenv";

dotenv.config();
admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_CREDENTIALS)),
    databaseURL: "https://kania-1510829092782.firebaseio.com"
  });

export default admin;