import admin from '../../config/admin';

class Follow{

    private db: any;
    constructor(public event:any){
        this.greetingMsg();
        this.db = admin.database().ref("users");
    }

    public greetingMsg(){
        this.event.source.profile()
            .then( (profile)=>{

                this.db.child(profile.userId).once("value",(snapshot)=>{
                    if(!snapshot.exists()){
                        let val = {
                            displayName: profile.displayName,
                            timestamp: this.db.ServerValue.TIMESTAMP,
                            status: "follow",
                            status_premium: false,
                            phoneNumber:"-"
                        };
                        this.db.child(profile.userId).set(val,(err)=>{
                            if(err) {console.log("Error saving new user");}
                        });
                    }
                });

                let greetingMsg = [
                    `Terima kasih ${profile.displayName} telah menambahkan aku menjadi temanmu !`,
                    "Hai! Aku Kania, aku bisa membantu kamu untuk cari tempat kuliner yang disekitar mu!",
                    "Untuk cari makan, langsung aja kirim lokasi kamu sekarang.",
                    "Kalau kamu bingung, kamu bisa gunakan perintah @help untuk mengetahui aku lebih dekat."
                ] 
                this.event.reply(greetingMsg)
                    .then((data)=>{
                        console.log("FollowEvent:Success Greeting Message:",data);
                    });
            })
            .catch( (err)=>{
                console.log("Error Follow Event:"+err);
            });
    }
}

export default Follow;

