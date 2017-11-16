
class JoinGroup{
    
        constructor(public event:any){
            this.greetingMsg();
        }
    
        public greetingMsg(){
            let greetingMsgGroup = [
                `Terima kasih telah menambahkan aku di grup laknat ini !`,
                "Untuk memulai percakapan denganku panggil @eksi yah !"
            ] 
            this.event.reply(greetingMsgGroup)
                .then((data)=>{
                    console.log("JoinGroupEvent:Success Join Group Event:",data);
                })
                .catch((error)=>{
                    console.log("JoinGroupEvent:Error Join Group event:",error);
                });
        }
    }
    
    export default JoinGroup;
    
    