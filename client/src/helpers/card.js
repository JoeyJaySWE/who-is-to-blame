export default class Card {
    constructor(scene, scale=null){
        this.render = (x, y, sprite) => {
            let card = scene.add.image(x, y, sprite).setScale(scale,scale).setInteractive();
            scene.input.setDraggable(card);
            return card;
        }
    }
}