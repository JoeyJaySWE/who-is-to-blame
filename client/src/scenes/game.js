import Card from '../helpers/card';
import Zone from '../helpers/zone';

export default class Game extends Phaser.Scene {
    constructor(){
        super({
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
        this.playerHand = {
            evdenceCards: [],
            blameCards: [],

        };
 


        this.evidenceZone = new Zone(this, 300, 200, 240, 360, "evidence");
        this.evidenceDropZone = this.evidenceZone.renderZone();
        this.outline = this.evidenceZone.renderOutline(this.evidenceDropZone);

        this.blameZone = new Zone(this, 600, 200, 240, 360, "blame");
        this.blameDropZone = this.blameZone.renderZone();
        this.outline = this.blameZone.renderOutline(this.blameDropZone);

        this.dealCard = () => {
            for( let i = 0; i < 3; i++){
                if(this.playerHand.evdenceCards[i] != null){
                    continue;
                }
                let playerCard = new Card(this, 0.05, 'evidence');
                
                this.playerHand.evdenceCards[i] = 
                playerCard.render(300 + (i * 100), 670, 'backside');
                gameScene.playerHand.evdenceCards[i].on('pointerover', function (){
                    console.log(this);
                    this.scale = 0.075;
                    gameScene.children.bringToTop(this);
                });

                gameScene.playerHand.evdenceCards[i].on('pointerout', function (){
                  
                        console.log(this);
                        this.scale = 0.05;
                    
                    
                });

            }

            console.log(this.playerHand.evdenceCards);

            

            for(let i = 0; i < 3; i++){
                if(this.playerHand.blameCards[i] != null){
                    continue;
                }
                let playerCard = new Card(this, 0.1, 'blame');
                
                let spacing = this.playerHand.evdenceCards.length * 100;
                this.playerHand.blameCards[i] = playerCard.render(300 + (i * 100 + spacing), 670, 'blame');

                gameScene.playerHand.blameCards[i].on('pointerover', function (){
                    console.log(this);
                    this.scale = 0.145;
                    gameScene.children.bringToTop(this);
                });

                gameScene.playerHand.blameCards[i].on('pointerout', function (){
                  
                        console.log(this);
                        this.scale = 0.1;
                        
                    
                    
                });
             

            }
        
        }



        this.dealText = this.add.text(75, 350, ['Draw Card']).setFont("Tithilum Web","Sans-serif").setFontSize(18).setColor('#4a0').setInteractive();

        this.dealText.on('pointerdown', function(){
            gameScene.dealCard();
        })

        this.dealText.on('pointerover', function () {
            gameScene.dealText.setColor('#470');
        })

        this.dealText.on('pointerout', function () {
            gameScene.dealText.setColor('#4a0');
        })

        this.input.on('dragstart', function (pointer, gameObject) {
                gameObject.setTint(0xff69ba);
                if(gameObject.data.list.cardType === 'blame'){
                    gameObject.scale = 0.19;
           
                }
                else{
                    gameObject.scale = 0.1;
                }
                gameScene.children.bringToTop(gameObject);

        })

        this.input.on('dragend', function (pointer, gameObject, dropped) {
            gameObject.setTint();
            if(!dropped){
                if(gameObject.data.list.cardType === 'blame'){
                    gameObject.scale = 0.1;
                }
                else{
                    gameObject.scale = 0.05;
                }
                gameObject.x = gameObject.input.dragStartX;
                gameObject.y = gameObject.input.dragStartY;
            }

    })

        this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
            gameObject.x = dragX;
            gameObject.y = dragY;
        })

        if(this.playerHand.evdenceCards[1]){
            console.log("If works");
         
            
        }
        this.input.on('drop', function (pointer, gameObject, evidenceDropZone) {

            if(gameObject.x > 300 && gameObject.x < 540){
                if(gameObject.data.list.cardType !== 'evidence'){
                    gameObject.scale = 0.1;
                    gameObject.x = gameObject.input.dragStartX;
                    gameObject.y = gameObject.input.dragStartY;
                    return;
                }
                let missingCard = gameScene.playerHand.evdenceCards.lastIndexOf(gameObject)
                gameScene.playerHand.evdenceCards[missingCard] = null;
                
                console.log( gameScene.playerHand.evdenceCards);
            }
            else{
                if(gameObject.data.list.cardType !== 'blame'){
                    gameObject.scale = 0.05;
                    gameObject.x = gameObject.input.dragStartX;
                    gameObject.y = gameObject.input.dragStartY;
                    return;
                }
                let missingCard = gameScene.playerHand.blameCards.lastIndexOf(gameObject)
                gameScene.playerHand.blameCards[missingCard] = null;



               
            }


            


            
            if(gameObject.data.list.cardType === 'blame'){
               
                gameObject.scale = 0.19;
                console.log( gameScene.blameDropZone.data.list);
                gameScene.blameDropZone.data.values.cardData.push(gameObject);
                let pileTopCard = gameScene.blameDropZone.data.values.cardData.length -1;
                console.log(pileTopCard);
                gameScene.blameDropZone.data.values.cardData[pileTopCard].on('pointerout', function() {
                this.scale = 0.19;
            })

            }
            else{

                gameObject.scale = 0.1;
                evidenceDropZone.data.values.cards++;
                evidenceDropZone.data.values.cardData.push(gameObject);
                console.log( evidenceDropZone.data.list);
                let pileTopCard = evidenceDropZone.data.values.cardData.length -1;
        
                evidenceDropZone.data.values.cardData[pileTopCard].on('pointerout', function() {
                    this.scale = 0.1;
                })
            }
            gameObject.x = (evidenceDropZone.x+120);
            gameObject.y = evidenceDropZone.y+180;
            gameObject.disableInteractive();
        })
    }

    update(){

    }
}