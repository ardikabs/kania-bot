
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
        if(this.column[0] == null){
            this.column[0] = {
                'imageUrl':imgUrl,
                'action':action
            };
        }
        else{
            this.column.push({
                'imageUrl':imgUrl,
                'action':action
            });
        }
    }

}