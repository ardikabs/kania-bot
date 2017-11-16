
export default class ImageCarouselTemplates{
    
    column:Array<Object> = new Array();
    constructor(public altText:String){
        
    }

    build():Object{
        let message = {
            type: "template",
            altText: this.altText,
            template: {
                type: "image_carousel",
                columns: this.column
            }
        }
        
        return message;
    }

    addColumn(imgUrl:String,action:Object){
        this.column.push({
            'imageUrl':imgUrl,
            'action':action
        });

    }

}