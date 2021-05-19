import Card from '../helpers/card';
import Zone from '../helpers/zone';
import GameSetUp from '../helpers/hostSetup';
import io from 'socket.io-client';

export default class Game extends Phaser.Scene {
  constructor() {
    super({
      key: 'Game',
    });
  }

  preload() {
    this.load.image('backside', 'src/assets/backside.png');
    this.load.image('blame', 'src/assets/blame.png');
    this.load.image('evidence', 'src/assets/evidence.png');
    this.load.image('life1', 'src/assets/life1.png');
    this.load.image('life2', 'src/assets/life2.png');
    this.load.image('life3', 'src/assets/life3.png');
  }

  create() {
    // let hostUs÷er;
    let gameScene = this;
    this.player = 'Default';
    let players;
    this.playerHand = {
      evdenceCards: [],
      blameCards: [],
    };
    this.hostName;

    this.evidenceZone = new Zone(this, 300, 200, 240, 360, 'evidence');
    this.evidenceDropZone = this.evidenceZone.renderZone();
    this.outline = this.evidenceZone.renderOutline(this.evidenceDropZone);

    this.blameZone = new Zone(this, 600, 200, 240, 360, 'blame');
    this.blameDropZone = this.blameZone.renderZone();
    this.outline = this.blameZone.renderOutline(this.blameDropZone);
    this.socket = io.connect('http://localhost:3000');
    // let gameSetup = new GameSetUp(this, this.socket);
    this.socket.on('userJoined', (arg) => {
      console.log(`User Joined: ${arg}`);
    });
    // const socket = socketIOClient.connect(SERVER_URL);

    // IF PLAYER JOIN
    // 1. check if player ain't  host
    // 2. show name input field
    // 3. add players input name to players Array
    // 4. send Players array to back end for storage
    // 5. update all views with the new array values.
    // 6. emit to front end.
    // 7. if player 3 name is true, allow start game

    // Assign player
    this.socket.on('HostJoin', (arg) => {
      console.log(`assigning player ${arg}`);
      gameScene.player = arg;
    });

    // Assign players array
    this.socket.on('assignPlayers', (arg) => {
      players = JSON.parse(arg);
      // gameScene.GameSetUp.buildLobby(players);
    });
    this.socket.on('playerId', (arg) => {
      console.log(`this is playerId ${arg}`);
      gameScene.player = arg;
      if (arg !== 'user1') {
        playGame(arg);
      }
    });
    console.log(`This is gamescen player: ${this.player}`);
    //Singel views
    this.socket.on('PlayerView', (player) => {
      switch (player) {
        case '"user1"':
          console.log(`PlayerView: ${player}`);
          break;

        case '"user2"':
          console.log(`PlayerView: ${player}`);

          break;

        case '"user3"':
          console.log(`PlayerView: ${player}`);

          break;

        default:
          console.log(`Unkown player: ${player}`);
      }
    });

    this.dealCard = () => {
      for (let i = 0; i < 3; i++) {
        if (this.playerHand.evdenceCards[i] != null) {
          continue;
        }
        let playerCard = new Card(this, 0.05, 'evidence');

        this.playerHand.evdenceCards[i] = playerCard.render(
          300 + i * 100,
          670,
          'backside'
        );
        gameScene.playerHand.evdenceCards[i].on('pointerover', function () {
          this.scale = 0.075;
          gameScene.children.bringToTop(this);
        });

        gameScene.playerHand.evdenceCards[i].on('pointerout', function () {
          this.scale = 0.05;
        });
      }

      for (let i = 0; i < 3; i++) {
        if (this.playerHand.blameCards[i] != null) {
          continue;
        }
        let playerCard = new Card(this, 0.1, 'blame');

        let spacing = this.playerHand.evdenceCards.length * 100;
        this.playerHand.blameCards[i] = playerCard.render(
          300 + (i * 100 + spacing),
          670,
          'blame'
        );

        gameScene.playerHand.blameCards[i].on('pointerover', function () {
          this.scale = 0.145;
          gameScene.children.bringToTop(this);
        });

        gameScene.playerHand.blameCards[i].on('pointerout', function () {
          this.scale = 0.1;
        });
      }
    };

    function playGame(playerId) {
      gameScene.dealText = gameScene.add
        .text(75, 350, ['Draw Card'])
        .setFont('Tithilum Web', 'Sans-serif')
        .setFontSize(18)
        .setColor('#4a0')
        .setInteractive();

      gameScene.dealText.on('pointerdown', function () {
        gameScene.dealCard();
      });

      gameScene.dealText.on('pointerover', function () {
        gameScene.dealText.setColor('#470');
      });

      gameScene.dealText.on('pointerout', function () {
        gameScene.dealText.setColor('#4a0');
      });

      gameScene.input.on('dragstart', function (pointer, gameObject) {
        gameObject.setTint(0xff69ba);
        if (gameObject.data.list.cardType === 'blame') {
          gameObject.scale = 0.19;
        } else {
          gameObject.scale = 0.1;
        }
        gameScene.children.bringToTop(gameObject);
      });

      gameScene.input.on('dragend', function (pointer, gameObject, dropped) {
        gameObject.setTint();
        if (!dropped) {
          if (gameObject.data.list.cardType === 'blame') {
            gameObject.scale = 0.1;
          } else {
            gameObject.scale = 0.05;
          }
          gameObject.x = gameObject.input.dragStartX;
          gameObject.y = gameObject.input.dragStartY;
        }
      });

      gameScene.input.on('drag', function (pointer, gameObject, dragX, dragY) {
        gameObject.x = dragX;
        gameObject.y = dragY;
      });

      if (gameScene.playerHand.evdenceCards[1]) {
      }
      gameScene.input.on(
        'drop',
        function (pointer, gameObject, evidenceDropZone) {
          if (gameObject.x > 300 && gameObject.x < 540) {
            if (gameObject.data.list.cardType !== 'evidence') {
              gameObject.scale = 0.1;
              gameObject.x = gameObject.input.dragStartX;
              gameObject.y = gameObject.input.dragStartY;
              return;
            }
            let missingCard =
              gameScene.playerHand.evdenceCards.lastIndexOf(gameObject);
            gameScene.playerHand.evdenceCards[missingCard] = null;
          } else {
            if (gameObject.data.list.cardType !== 'blame') {
              gameObject.scale = 0.05;
              gameObject.x = gameObject.input.dragStartX;
              gameObject.y = gameObject.input.dragStartY;
              return;
            }
            let missingCard =
              gameScene.playerHand.blameCards.lastIndexOf(gameObject);
            gameScene.playerHand.blameCards[missingCard] = null;
          }

          if (gameObject.data.list.cardType === 'blame') {
            gameObject.scale = 0.19;
            gameScene.blameDropZone.data.values.cardData.push(gameObject);
            let pileTopCard =
              gameScene.blameDropZone.data.values.cardData.length - 1;
            gameScene.blameDropZone.data.values.cardData[pileTopCard].on(
              'pointerout',
              function () {
                gameScene.scale = 0.19;
              }
            );
          } else {
            gameObject.scale = 0.1;
            evidenceDropZone.data.values.cards++;
            evidenceDropZone.data.values.cardData.push(gameObject);
            let pileTopCard = evidenceDropZone.data.values.cardData.length - 1;

            evidenceDropZone.data.values.cardData[pileTopCard].on(
              'pointerout',
              function () {
                gameScene.scale = 0.1;
              }
            );
          }
          gameObject.x = evidenceDropZone.x + 120;
          gameObject.y = evidenceDropZone.y + 180;
          gameObject.disableInteractive();
        }
      );
    }
  }

  update() {}
}
