
export default class ImagemapMessage{
    
    constructor(private altText:String,private baseUrl:String, private actions:Array<Object>){

    }

    build():{}{
        let message = {
            type: "imagemap",
            baseUrl: this.baseUrl,
            altText: this.altText,
            baseSize: {
                "height": 520,
                "width": 1040
            },
            actions:this.actions
        }
        
        return message;
    }
}