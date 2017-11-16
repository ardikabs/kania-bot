
export default class ImageCarouselTemplates{
    
    column:Array<Object>;
    constructor(public altText:string){
        this.column = new Array(Object);
    }

    build():String{
        let message = {
            type: "template",
            altText: this.altText,
            template: {
                type: "image_carousel",
                columns: this.column
            }
        }
        
        return JSON.stringify(message);
    }

    addColumn(imgUrl:String,action:Object){
        this.column.push({
            'imageUrl':imgUrl,
            'action':action
        });

    }

}