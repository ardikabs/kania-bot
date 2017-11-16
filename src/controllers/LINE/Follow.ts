
class Follow{

    constructor(public event:any){
        this.greetingMsg();
    }

    public greetingMsg(){
        this.event.source.profile()
            .then( (profile)=>{
                let greetingMsg = [
                    `Terima kasih ${profile.displayName} telah menambahkan aku menjadi temanmu !`,
                    "Eksi BOT akan membantumu mengetahui informasi RESI pengiriman barang kamu loh",
                    "Untuk memulainya, gunakan perintah berikut ini,\nContoh : @{nama-layanan} {no-resi} \n@jne CGK7K02103326517 \n@sicepat 00005366108 \n@wahana ADG66845",
                    "Gunakan perintah @help untuk mengetahui aku lebih lanjut yah."
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

