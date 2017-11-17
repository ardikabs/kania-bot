import ImagemapMessage from "../Templates/ImagemapMessage";
import ActionBuilder from "../Templates/ActionBuilder";

class Utils{

    public static showImagemap():Object{
        let imagemapMessage = new ImagemapMessage(
            "Menunya Kania !!!",
            "https://sibpens.gravicodev.id/kania/menu",
            [
                ActionBuilder.createMessageActionForIM("@subscribe",0,0,346,260),
                ActionBuilder.createMessageActionForIM("@promo",346,0,348,260),
                ActionBuilder.createMessageActionForIM("@voucher",695,0,346,260),
                ActionBuilder.createMessageActionForIM("@premium",0,260,346,260),
                ActionBuilder.createMessageActionForIM("@help",346,260,348,260),
                ActionBuilder.createMessageActionForIM("@about",695,260,346,260)                    
            ]
        );
        return imagemapMessage.build();
    }
}

export default Utils;