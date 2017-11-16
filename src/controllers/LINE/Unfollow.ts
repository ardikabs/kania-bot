
class Unfollow{
    
        constructor(public event:any){
            this.goodbyeMsg();
        }
    
        public goodbyeMsg(){
            this.event.source.profile()
                .then((profile)=>{
                    console.log("UnfollowEvent:User id:"+profile.userId);
                    console.log("UnfollowEvent:Display Name:"+profile.displaName);
                    
                })
                .catch((err)=>{
                    console.log("Error Unfollow Event:"+err);
                });
            
        }
    }
    
    export default Unfollow;
    
    