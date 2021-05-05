export default class Card {
    constructor(scene, scale=null, cardType){
        this.render = (x, y, sprite) => {
            let card = scene.add.image(x, y, sprite).setScale(scale,scale).setInteractive();
            card.setData({cardType: cardType})
            scene.input.setDraggable(card);
            return card;
        }
    }
}