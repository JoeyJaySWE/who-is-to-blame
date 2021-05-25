import Card from "../helpers/card";
import Zone from "../helpers/zone";
import io from "socket.io-client";
// import socket from '../../../socket';

export default class Game extends Phaser.Scene {
	constructor() {
		super({
			key: "Game",
		});
	}

	preload() {
		this.load.image("backside", "src/assets/backside.png");
		this.load.image("blame", "src/assets/blame.png");
		this.load.image("evidence", "src/assets/evidence.png");
		this.load.image("life1", "src/assets/life1.png");
		this.load.image("life2", "src/assets/life2.png");
		this.load.image("life3", "src/assets/life3.png");
		this.load.image("evidence1", "src/assets/evidence1.png");
		this.load.image("evidence2", "src/assets/evidence2.png");
		this.load.image("evidence3", "src/assets/evidence3.png");
		this.load.image("evidence4", "src/assets/evidence4.png");
		this.load.image("evidence5", "src/assets/evidence5.png");
		this.load.image("evidence6", "src/assets/evidence6.png");
		this.load.image("evidence7", "src/assets/evidence7.png");
		this.load.image("evidence8", "src/assets/evidence8.png");
		this.load.image("blame_point", "src/assets/blame_point.png");
		this.load.image("blame_stop", "src/assets/blame_stop.png");
	}

	create() {
		// ----- [ Init Variabels ] --------

		//fix for scoping access
		let gameScene = this;

		// the current player who's view we're watching
		this.player = "Default";

		// all players lives
		this.lives = {
			player2: 3,
			player3: 3,
		};

		this.objection = false;

		this.gameOver = false;
		this.players = {
			user1: {
				name: "user1",
				lives: null,
				dealtCards: false,
			},
			user2: {
				name: "user2",
				lives: 3,
				dealtCards: false,
			},
			user3: {
				name: "user3",
				lives: 3,
				dealtCards: false,
			},
		};
		// which players turn is it
		this.onStand;

		// which card does the player have on hand
		this.playerHand = {
			evidenceCards: [],
			blameCards: [],
		};

		// who's the Judge
		this.hostName;

		// ----------------------------------

		if (this.gameOver === true) {
			return;
		}

		// --------- [ place we drop our evidnece cards ] ---------------------

		this.evidenceZone = new Zone(this, 300, 200, 240, 360, "evidence");
		this.evidenceDropZone = this.evidenceZone.renderZone();
		this.outline = this.evidenceZone.renderOutline(this.evidenceDropZone);
		// console.log(this.evidenceDropZone);

		// ---------------------------------------------------------------------

		// --------- [ place we drop our evidnece cards ] ---------------------

		this.blameZone = new Zone(this, 600, 200, 240, 360, "blame");
		this.blameDropZone = this.blameZone.renderZone();
		this.outline = this.blameZone.renderOutline(this.blameDropZone);

		// --------------------------------------------------------------------

		//socket set up
		this.socket = io.connect("https://who-is-to-blame.herokuapp.com/", {
			transport: ["websocket"],
		});

		// let gameSetup = new GameSetUp(this, this.socket);

		// IF PLAYER JOIN
		// 1. check if player ain't  host
		// 2. show name input field
		// 3. add players input name to players Array
		// 4. send Players array to back end for storage
		// 5. update all views with the new array values.
		// 6. emit to front end.
		// 7. if player 3 name is true, allow start game

		//new turn
		this.socket.on("NewStand", (accused) => {
			gameScene.onStand = accused;
			let player = gameScene.player;
			let playerData = gameScene.players[player];
			console.log("evidence card: ", gameScene.playerHand.evidenceCards);
			if (player === accused) {
				if (
					hasNull(gameScene.playerHand.evidenceCards) ||
					hasNull(gameScene.playerHand.blameCards)
				) {
					playerData.dealtCards = false;
					console.log("no card dealt");
				} else {
					console.log("player already got card", playerData.dealtCards);
				}
			}

			// displayes the players name in lower left corner
			gameScene.playerLabel.text = playerData.name;
			console.log("new round", playerData.name);
			console.log(`Recived ${accused}'s turn.`);
			gameScene.turnIndicator.text = `${gameScene.onStand} got the stand`;

			switch (gameScene.player) {
				case "user1":
					judgeGame(gameScene.players);
					break;

				case "user2":
					console.log("player lives:", gameScene.lives.player2);
					gameScene.Life.text = null;
					playGame(playerData.name, gameScene.onStand, playerData.lives);
					break;

				case "user3":
					gameScene.Life.text = null;
					playGame(playerData.name, gameScene.onStand, playerData.lives);
					break;
			}

			// gameScene.turnIndicator.text(400, 50, [
			//   `${gameScene.onStand} got the stand`,
			// ]);
		});

		//update all views with dropped evidence
		this.socket.on("EvidenceDropped", (arg) => {
			console.log({ arg });

			let evidence = arg.evidence.playedCard;
			evidence = JSON.parse(evidence);
			console.log({ evidence });
			let presenter = arg.evidence.player;
			console.log({ presenter });

			// evidence = evidenceParsed[0];

			let sprite = evidence.textureKey;
			console.log({ sprite });

			let card = new Card(gameScene, 1, "evidence");
			card
				.render(
					gameScene.evidenceDropZone.x + 120,
					gameScene.evidenceDropZone.y + 180,
					sprite
				)
				.disableInteractive();
			console.log({ card });
			console.log(this.evidenceDropZone);
			console.log({ sprite });

			if (gameScene.objection === true) {
				console.log("setting objection to false");
				gameScene.objection = false;
			}
		});

		this.socket.on("BlameDropped", (arg) => {
			console.log({ arg });
			let blame = arg.blame.playedCard;
			blame = JSON.parse(blame);
			let presenter = arg.blame.player;
			console.log({ presenter });

			// blame = blameParsed[0];

			console.log("Not the one who dropped");
			let sprite = blame.textureKey;

			let card = new Card(gameScene, 1, "blame");
			card
				.render(
					gameScene.blameDropZone.x + 120,
					gameScene.blameDropZone.y + 180,
					sprite
				)
				.disableInteractive();
			console.log({ sprite });

			if (
				gameScene.player === presenter &&
				gameScene.onStand !== gameScene.player &&
				gameScene.objection === false
			) {
				gameScene.objection = true;
			}
		});

		this.rulesText = gameScene.add
			.text(70, 50, [`Rules`])
			.setFont("Tithilum Web", "Sans-serif")
			.setFontSize(24)
			.setAlign("center")
			.setColor("#aa00cc")
			.setInteractive();

		this.rulesText.on("pointerover", () => {
			gameScene.rulesText.setColor("#ff00ff");
		});

		this.rulesText.on("pointerout", () => {
			gameScene.rulesText.setColor("#aa00cc");
		});

		this.rulesText.on("pointerdown", () => {
			let url = "https://github.com/JoeyJaySWE/who-is-to-blame";
			window.open(`${url}#rules`, "_blank");
		});

		this.evidencePileLabel = this.add
			.text(370, 350, [`Evidence\n Pile`])
			.setFont("Tithilum Web", "Sans-serif")
			.setFontSize(24)
			.setAlign("center")
			.setColor("#7799bb");

		this.blamePileLabel = this.add
			.text(685, 350, [`Blame \nPile`])
			.setFont("Tithilum Web", "Sans-serif")
			.setAlign("center")
			.setFontSize(24)
			.setColor("#7799bb");

		// first setup
		this.socket.on("playerId", (arg) => {
			console.log(`this is playerId ${arg}`);
			if (parseInt(arg.slice(-1)) > 3) {
				console.log("too big");
				gameScene.roomFull = gameScene.add
					.text(300, 100, ["Room is full, check back later"])
					.setFont("Tithilum Web", "Sans-serif")
					.setFontSize(42)
					.setColor("#0de");
				document.title = "No room!";
				return;
			}
			gameScene.player = arg;
			let playerData = gameScene.players[gameScene.player];
			// displayes the players name in lower left corner
			gameScene.playerLabel = gameScene.add
				.text(75, 700, gameScene.players[gameScene.player].name)
				.setFont("Tithilum Web", "Sans-serif")
				.setFontSize(24)
				.setColor("#0de");
			console.log("modifed: ", playerData.lives);

			gameScene.onStand = "No one";
			document.title = arg;
			console.log(`title is: ${document.title}`);

			// Disaplays whos turn it is in the center top of screen
			gameScene.turnIndicator = gameScene.add
				.text(400, 50, [`${gameScene.onStand} got the stand`])
				.setFont("Tithilum Web", "Sans-serif")
				.setFontSize(42)
				.setColor("#f50");

			//if current user ain't judge, show player view
			switch (arg) {
				case "user1":
					judgeGame(gameScene.players);
					console.log("init judge test");
					break;

				case "user2":
					playGame(playerData.name, gameScene.onStand, playerData.lives);
					break;

				case "user3":
					playGame(playerData.name, gameScene.onStand, playerData.lives);
					break;
			}
		});

		this.dealCard = () => {
			for (let i = 0; i < 3; i++) {
				if (gameScene.playerHand.evidenceCards[i] != null) {
					continue;
				}

				let cardImage = "evidence" + (Math.floor(Math.random() * 8) + 1);
				console.log(cardImage);
				let playerCard = new Card(this, 0.5, "evidence");

				this.playerHand.evidenceCards[i] = playerCard.render(
					300 + i * 100,
					670,
					cardImage
				);

				gameScene.playerHand.evidenceCards[i].on("pointerover", function () {
					this.scale = 0.75;
					gameScene.children.bringToTop(this);
				});

				gameScene.playerHand.evidenceCards[i].on("pointerout", function () {
					if (
						this.x !== gameScene.evidenceDropZone.x + 120 &&
						this.y !== gameScene.evidenceDropZone.y + 180
					) {
						this.scale = 0.5;
					}
				});
			}

			console.log("dealt hand:", gameScene.playerHand.evidenceCards);
			console.log("secrete card", gameScene.playerHand.evidenceCards[-1]);

			for (let i = 0; i < 3; i++) {
				if (gameScene.playerHand.blameCards[i] != null) {
					console.log(gameScene.playerHand.blameCards[i]);
					continue;
				}
				let playerCard = new Card(this, 0.5, "blame");
				let blameCardName;
				let blameInt = Math.floor(Math.random() * 20) + 10;
				console.log(`blameInt number is: ${blameInt}`);
				if (blameInt % 2 === 0) {
					blameCardName = "blame_stop";
				} else {
					blameCardName = "blame_point";
				}

				let spacing = this.playerHand.evidenceCards.length * 100;
				this.playerHand.blameCards[i] = playerCard.render(
					300 + (i * 100 + spacing),
					670,
					blameCardName
				);

				gameScene.playerHand.blameCards[i].on("pointerover", function () {
					this.scale = 0.75;
					gameScene.children.bringToTop(this);
				});

				gameScene.playerHand.blameCards[i].on("pointerout", function () {
					if (
						this.x !== gameScene.blameDropZone.x + 120 &&
						this.y !== gameScene.blameDropZone.y + 180
					) {
						this.scale = 0.5;
					}
				});
			}
			gameScene.players[gameScene.player].dealtCards = true;
			console.log(
				"set dealt cards to true:",
				gameScene.players[gameScene.player].dealtCards
			);
		};

		this.socket.on("Strike", (guilty) => {
			let guiltyData = gameScene.players[guilty];
			guiltyData.lives--;

			console.log("resumed");
			let playerData = gameScene.players[gameScene.player];
			gameScene.playerLabel.text = playerData.name;
			if (guiltyData.lives === 0) {
				gameOver(guiltyData);
				gameScene.gameOver = true;
				return;
			} else {
				switch (gameScene.player) {
					case "user1":
						judgeGame(gameScene.players);
						console.log("tested");
						break;

					case "user2":
						gameScene.Life.text = null;
						playGame(playerData.name, gameScene.onStand, playerData.lives);
						break;

					case "user3":
						gameScene.Life.text = null;
						playGame(playerData.name, gameScene.onStand, playerData.lives);
						break;
				}
			}
		});
		console.log("last thing");

		function judgeGame(players) {
			if (gameScene.gameOver === true) {
				console.log("judge know games over");
				return;
			}
			console.log("this should return twice");
			//adds a text to inidicate the option to choose player to take stand
			gameScene.indicatorLabel = gameScene.add
				.text(400, 100, [`Who shall take the stand?`])
				.setFont("Tithilum Web", "Sans-serif")
				.setFontSize(28)
				.setColor("#fff000");

			// ads text/button for making it player2's turn
			gameScene.switchToPlayer2 = gameScene.add
				.text(400, 140, [players.user2.name])
				.setFont("Tithilum Web", "Sans-serif")
				.setFontSize(28)
				.setColor("#009900")
				.setInteractive();

			// ads text/button for making it player3's turn
			gameScene.switchToPlayer3 = gameScene.add
				.text(650, 140, [players.user3.name])
				.setFont("Tithilum Web", "Sans-serif")
				.setFontSize(28)
				.setColor("#660066")
				.setInteractive();

			// sets hover state player 2
			gameScene.switchToPlayer2.on("pointerover", () => {
				gameScene.switchToPlayer2.setColor("#00DD00");
			});

			// reset text color post-hover state player 2
			gameScene.switchToPlayer2.on("pointerout", () => {
				gameScene.switchToPlayer2.setColor("#009900");
			});

			// makes it player 2's turn
			gameScene.switchToPlayer2.on("pointerdown", () => {
				gameScene.switchToPlayer2.setColor("#009900");
				gameScene.switchToPlayer3.setColor("#660066");
				clearTexts(gameScene.player);
				gameScene.socket.emit("SwitchTurn", "user2");
			});

			// sets hover state player 3
			gameScene.switchToPlayer3.on("pointerover", () => {
				gameScene.switchToPlayer3.setColor("#DD00DD");
			});

			// reset text color post-hover state player 3
			gameScene.switchToPlayer3.on("pointerdown", () => {
				gameScene.switchToPlayer2.setColor("#006600");
				gameScene.switchToPlayer3.setColor("#990099");
				console.log("click player 3");
				clearTexts(gameScene.player);
				gameScene.socket.emit("SwitchTurn", "user3");
			});

			// makes it player 3's turn
			gameScene.switchToPlayer3.on("pointerout", () => {
				gameScene.switchToPlayer3.setColor("#660066");
			});

			gameScene.lifeLabel = gameScene.add
				.text(500, 600, [`Who's guilty?`])
				.setFont("Tithilum Web", "Sans-serif")
				.setFontSize(28)
				.setColor("#dd0000");

			gameScene.Player3Guilty = gameScene.add
				.text(650, 675, [players.user3.name])
				.setFont("Tithilum Web", "Sans-serif")
				.setFontSize(28)
				.setColor("#660066")
				.setInteractive();

			gameScene.Player3Strikes = gameScene.add
				.text(650, 720, [`Strikes left: ${players.user3.lives}`])
				.setFont("Tithilum Web", "Sans-serif")
				.setFontSize(28)
				.setColor("#660066");

			gameScene.Player2Guilty = gameScene.add
				.text(400, 675, [players.user2.name])
				.setFont("Tithilum Web", "Sans-serif")
				.setFontSize(28)
				.setColor("#006600")
				.setInteractive();

			gameScene.Player2Strikes = gameScene.add
				.text(400, 720, [`Strikes left: ${players.user2.lives}`])
				.setFont("Tithilum Web", "Sans-serif")
				.setFontSize(28)
				.setColor("#006600");

			gameScene.Player2Guilty.on("pointerover", () => {
				gameScene.Player2Guilty.setFontSize(34);
				gameScene.Player2Guilty.setColor("#00DD00");
				gameScene.Player2Strikes.setColor("#00DD00");
			});

			gameScene.Player2Guilty.on("pointerout", () => {
				gameScene.Player2Guilty.setFontSize(28);
				gameScene.Player2Guilty.setColor("#006600");
				gameScene.Player2Strikes.setColor("#006600");
			});

			gameScene.Player3Guilty.on("pointerover", () => {
				gameScene.Player3Guilty.setFontSize(34);
				gameScene.Player3Guilty.setColor("#DD00DD");
				gameScene.Player3Strikes.setColor("#DD00DD");
			});

			gameScene.Player3Guilty.on("pointerout", () => {
				gameScene.Player3Guilty.setFontSize(28);
				gameScene.Player3Guilty.setColor("#660066");
				gameScene.Player3Strikes.setColor("#660066");
			});

			gameScene.Player2Guilty.on("pointerdown", () => {
				console.log("Clicked on user2");
				clearTexts(gameScene.player);
				gameScene.socket.emit("Strike", "user2");
			});

			gameScene.Player3Guilty.on("pointerdown", () => {
				console.log("Clicked on user3");
				clearTexts(gameScene.player);
				gameScene.socket.emit("Strike", "user3");
			});
		}

		// Player views
		function playGame(playerId, onStand, lives) {
			console.log({ lives });
			gameScene.Life = gameScene.add
				.text(75, 730, [`Lives left: ${lives}`])
				.setFont("Tithilum Web", "Sans-serif")
				.setFontSize(18)
				.setColor("#0de");
			if (lives === 0) {
				gameOver(gameScene.players[gameScene.player]);
				console.log("done");
				return;
			}

			// Adds a text/button for drawing card
			gameScene.dealText = gameScene.add
				.text(75, 350, ["Draw Card"])
				.setFont("Tithilum Web", "Sans-serif")
				.setFontSize(18)
				.setColor("#4a0")
				.setInteractive();

			// a player can only draw cards if it's that players turn
			gameScene.dealText.on("pointerdown", function () {
				console.log();
				if (gameScene.players[gameScene.player].dealtCards === false) {
					console.log("on stand: ", onStand);
					gameScene.dealCard();
				} else {
					console.log(
						"deqalt card was true: ",
						gameScene.players[gameScene.player].dealtCards
					);
				}
				console.log("unkown", gameScene.players[gameScene.player].dealtCards);
			});

			// ------------[ Hover functions of the "draw card" text ]-------------------

			gameScene.dealText.on("pointerover", function () {
				gameScene.dealText.setColor("#470");
			});

			gameScene.dealText.on("pointerout", function () {
				gameScene.dealText.setColor("#4a0");
			});

			// --------------------------------------------------------------------------

			// ------------[ move functions for our cards ]-------------------

			//while we move
			gameScene.input.on("dragstart", function (pointer, gameObject) {
				gameObject.setTint(0xff69ba);

				//scales card based on type (had old cards that had different sizes)
				gameObject.scale = 1;
				gameScene.children.bringToTop(gameObject);
			});

			// when we let go of the card
			gameScene.input.on("dragend", function (pointer, gameObject, dropped) {
				gameObject.setTint();

				//if card wasn't dropped in a zone, send it back to the hand
				if (
					!dropped ||
					(gameScene.onStand === "No one" &&
						gameObject.texture.key !== "blame_stop")
				) {
					gameObject.scale = 0.5;
					gameObject.x = gameObject.input.dragStartX;
					gameObject.y = gameObject.input.dragStartY;
				}
			});

			// gets our cards current position
			gameScene.input.on("drag", function (pointer, gameObject, dragX, dragY) {
				if (gameObject.x === 420 && gameObject.y === 380) {
					console.log("moving from evidence pile");
					gameObject.x = 420;
					gameObject.y = 380;
					gameObject.disableInteractive();
				}
				if (gameObject.x === 720 && gameObject.y === 380) {
					console.log("moving from blame pile");
					gameObject.disableInteractive();
				}
				gameObject.x = dragX;
				gameObject.y = dragY;
			});

			// -------------------------------------------------------------------------------

			// When we dropp the card in a pile
			gameScene.input.on("drop", function (pointer, gameObject) {
				if (
					gameScene.onStand === "No one" ||
					(gameScene.onStand !== gameScene.player &&
						gameObject.texture.key !== "blame_stop" &&
						gameScene.objection === false)
				) {
					console.log("not allowed to drop");
					console.log(gameObject.texture.key);
					gameObject.scale = 0.5;
					gameObject.x = gameObject.input.dragStartX;
					gameObject.y = gameObject.input.dragStartY;
					return;
				}
				console.log("card dropepd");
				// console.log(gameScene.evidenceDropZone);
				console.log(gameScene.players[gameScene.player].dealtCards);
				//if we dropped in the Evidence pile
				if (
					gameObject.x > 299 &&
					gameObject.x < 541 &&
					gameObject.y > 199 &&
					gameObject.y < 561
				) {
					console.log("card dropped in evidence pile");
					// if we dropped a Blame card in the evidence pile, send it back to hand
					if (gameObject.data.list.cardType !== "evidence") {
						console.log(`card wasn't evidence`);
						gameObject.scale = 0.5;
						gameObject.x = gameObject.input.dragStartX;
						gameObject.y = gameObject.input.dragStartY;
						return;
					}
					console.log("added to evidence pile");
					gameObject.scale = 1;
					console.log(gameScene.evidenceDropZone);
					gameScene.evidenceDropZone.data.values.cards++;
					gameScene.evidenceDropZone.data.values.cardData.push(gameObject);
					let pileTopCard =
						gameScene.evidenceDropZone.data.values.cardData.length - 1;

					// gameScene.evidenceDropZone.data.values.cardData[pileTopCard].on(
					//   'pointerout',
					//   function () {
					//     gameScene.scale = 0.1;
					//   }
					// );
					gameObject.x = gameScene.evidenceDropZone.x + 120;
					gameObject.y = gameScene.evidenceDropZone.y + 180;
					console.log(
						"setting evidence position: ",
						gameObject.x,
						"x",
						gameObject.y
					);
					gameObject.disableInteractive();

					// if it was dropped in the right zone, remove the card from the hand.
					let missingCard =
						gameScene.playerHand.evidenceCards.lastIndexOf(gameObject);
					gameScene.playerHand.evidenceCards[missingCard] = null;
					console.log("Player hand:", gameScene.playerHand.evidenceCards);
					console.log("secrete card:", gameScene.playerHand.evidenceCards[-1]);
					let playedCard = JSON.stringify(gameObject);
					let player = gameScene.player;
					clearTexts(gameScene.player);
					gameScene.socket.emit("EvidenceDropped", { playedCard, player });

					console.log(
						"dropped, still dealt?",
						gameScene.players[gameScene.player].dealtCards
					);
					gameScene.players[gameScene.player].dealtCards = true;
				}

				// if droped in the Blame pile
				if (
					gameObject.x > 599 &&
					gameObject.x < 841 &&
					gameObject.y > 199 &&
					gameObject.y < 561
				) {
					console.log("card dropped in blame");
					// if evidence card was dropped, send it back to the hand
					if (gameObject.data.list.cardType !== "blame") {
						console.log(
							"Crong card dropp: ",
							gameObject.x,
							" x ",
							gameObject.y
						);
						gameObject.scale = 1;
						console.log(
							"card start x:",
							gameObject.input.dragStartX,
							"card start y:",
							gameObject.input.dragStartY
						);
						gameObject.x = gameObject.input.dragStartX;
						gameObject.y = gameObject.input.dragStartY;
						return;
					}
					gameObject.scale = 1;
					gameScene.blameDropZone.data.values.cards++;
					gameScene.blameDropZone.data.values.cardData.push(gameObject);
					let pileTopCard =
						gameScene.blameDropZone.data.values.cardData.length - 1;

					// gameScene.blameDropZone.data.values.cardData[pileTopCard].on(
					//   'pointerout',
					//   function () {
					//     gameScene.scale = 0.1;
					//   }
					// );
					gameObject.x = gameScene.blameDropZone.x + 120;
					gameObject.y = gameScene.blameDropZone.y + 180;
					console.log(
						"setting evidence position: ",
						gameObject.x,
						"x",
						gameObject.y
					);
					gameObject.disableInteractive();

					// else remove the card from the hand
					console.log("Bad card dropp: ", gameObject.x, " x ", gameObject.y);
					let missingCard =
						gameScene.playerHand.blameCards.lastIndexOf(gameObject);
					console.log("missing card inex", missingCard);
					gameScene.playerHand.blameCards[missingCard] = null;
					console.log("blame card hand: ", gameScene.playerHand.blameCards);
					let playedCard = JSON.stringify(gameObject);
					let player = gameScene.player;
					clearTexts(gameScene.player);
					gameScene.socket.emit("BlameDropped", { playedCard, player });
				}

				if (gameObject.data.list.cardType === "blame") {
					gameObject.scale = 1;
					gameScene.blameDropZone.data.values.cardData.push(gameObject);
					let pileTopCard =
						gameScene.blameDropZone.data.values.cardData.length - 1;
					// gameScene.blameDropZone.data.values.cardData[pileTopCard].on(
					//   'pointerout',
					//   function () {
					//     gameScene.scale = 0.19;
					//   }
					// );
				}
			});
		}

		function clearTexts(player) {
			if (player === "user1") {
				gameScene.Player2Guilty.text = null;
				gameScene.Player3Guilty.text = null;
				gameScene.Player2Strikes.text = null;
				gameScene.Player3Strikes.text = null;
				gameScene.lifeLabel.text = null;
				gameScene.switchToPlayer2.text = null;
				gameScene.switchToPlayer3.text = null;
				gameScene.indicatorLabel.text = null;
			} else {
				gameScene.Life.text = null;
				gameScene.dealText.text = null;
			}
			gameScene.playerLabel.text = null;
			gameScene.evidenceZone.fillColor = null;
		}

		function gameOver(loser) {
			gameScene.turnIndicator.text = `${gameScene.players.user1.name} declaires ${loser.name} \n GUILTY, after 3 strikes.`;
			gameScene.turnIndicator.setAlign("center");
			clearTexts(gameScene.player);
			gameScene.evidencePileLabel.text = null;
			gameScene.blamePileLabel.text = null;
			gameScene.playerLabel.text = gameScene.players[gameScene.player].name;
			console.log("cleared text?");
			gameScene.gameHeader = gameScene.add
				.text(380, 350, [`GAME`])
				.setFont("Tithilum Web", "Sans-serif")
				.setFontSize(24)
				.setAlign("center")
				.setColor("#7799bb");
			gameScene.OverHeader = gameScene.add
				.text(690, 350, [`OVER`])
				.setFont("Tithilum Web", "Sans-serif")
				.setFontSize(24)
				.setAlign("center")
				.setColor("#7799bb");
			console.log("printed game over?");
		}

		function hasNull(list) {
			if (list.length === 0) {
				return true;
			}
			let hasNull = false;
			list.forEach((item) => {
				console.log({ item });
				if (item === null) {
					hasNull = true;
				}
			});
			return hasNull;
		}
	}

	update() {}
}
