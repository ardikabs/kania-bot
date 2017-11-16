

export default class ColumnBuilder{

    constructor(){

    }


    public static addColumnImageCarousel(imgUrl:String,label:String,data:String, action:Object){
        return {
            'imageUrl':imgUrl,
            'action':action
        };
    }

    public static addColumnCarousel(thumbImg:String, title:String, text:String, actions:Object[]){
        return {
            'thumbnailImageUrl':thumbImg,
            'title':title,
            'text':text,
            'actions':actions
        };
    }
}