export default class Game extends Phaser.Scene {
    constructor(){
        supper({
            key: 'Game'
        });

    }

    preload(){
        // this.load.image('imgName', 'src/assets/imgName')
    }

    create(){
        this.dealText = this.add.text(75, 350, ['Draw Card']).setFont("Tithilum Web","Sans-serif").setColor('#4a0').setInteractive();
    }

    update(){

    }
}