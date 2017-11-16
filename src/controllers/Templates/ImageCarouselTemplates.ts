
export default class ImageCarouselTemplates{
    
    column:{}[];
    constructor(public altText:string){

    }

    build():{}{
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

    addColumnImageCarousel(imgUrl:String,action:Object){
        this.column.push({
            'imageUrl':imgUrl,
            'action':action
        });
    }

}