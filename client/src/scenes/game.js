export default class Game extends Phaser.Scene {
    constructor(){
        supper({
            key: 'Game'
        });

    }

    preload(){
        this.load.image('backside', 'src/assets/backside.png');
        this.load.image('blame', 'src/assets/blame.png');
        this.load.image('evidence', 'src/assets/evidence.png');
        this.load.image('life1', 'src/assets/life1.png');
        this.load.image('life2', 'src/assets/life2.png');
        this.load.image('life3', 'src/assets/life3.png');
        
    }

    create(){
        let gameScene = this;

        this.card = this.add.image(300, 300, 'evidence').setScale(0.3, 0.3).setInteractive();

        this.input.setDraggable(this.card);

        this.dealText = this.add.text(75, 350, ['Draw Card']).setFont("Tithilum Web","Sans-serif").setColor('#4a0').setInteractive();
    }

    update(){

    }
}