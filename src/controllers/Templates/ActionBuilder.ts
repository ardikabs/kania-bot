
export default class ActionBuilder{


    constructor(){

    }

    public static createPostbackAction(label:String,data:String,text?:String){
        let act = {
            'type':'postback',
            'label':label,
            'data':data
        };

        if(text != null){
            return act
        }
        else{
            act['text'] = text;
            return act
        }
    }

    public static createUriAction(label:String,uri:String){
        return {
            'type':"uri",
            'label':label,
            'uri':uri
        }
    }
    
    public static createMessageAction(label:String,text:String){
        return {
            'type':"message",
            'label':label,
            'text':text
        }
    }
}