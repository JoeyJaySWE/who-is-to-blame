export default class GameSetUp {
  constructor(gameScene, socket) {
    const popUp = document.querySelector('.pop-up');
    const gameName = document.querySelector('#gameName');
    const hostNameField = document.querySelector('#hostName');
    const playerBoxes = document.querySelector('.players-setup');
    const nameBtn = document.querySelector('.name-btn');
    const nameInputs = document.querySelector('.names-input');
    const gameLnkFields = document.querySelector('.game-link-fields');
    const title = document.querySelector('h1');
    const gameLnk = document.querySelector('.game-link');

    //get qery string
    console.log(`this won't work lol`);
    nameBtn.addEventListener('click', function () {
      if (gameName.value === '') {
        alert('Please input a name for your session.');
        return;
      }
      if (hostNameField.value === '') {
        alert('Please input a name for yourself.');
        return;
      }

      gameLnkFields.style.display = 'flex';
      let gameNameSlug = gameName.value.replace(/\s+/g, '-').toLowerCase();
      let gameLnkUrl = `${window.location.href}?game=${gameNameSlug}`;
      console.log(gameLnkUrl);
      socket.emit('HostNamed', JSON.stringify(hostNameField.value));
      // window.location.replace(gameLnkUrl);

      gameLnk.textContent = gameLnkUrl;
      console.log(gameScene.socket);

      const urlParams = new URLSearchParams(window.location.search);
      let game = urlParams.get('game');

      if (game) {
        console.log(game);

        title.textContent = `${game} set up!`;
        let playerBox = document.createElement('div');
        playerBox.classList.add('player-box');
        let playerFrame = document.createElement('div');
        let playerName = document.createElement('span');
        playerFrame.textContent = 'Host';
        playerFrame.classList.add('player-frame');
        playerBox.appendChild(playerFrame);
        console.log(`this is the damn players obbject ${playersObject}`);
        playerName.textContent = gameScene.playersObject.hostName;
        playerName.classList.add('player-name');
        playerBox.appendChild(playerName);
        playerBoxes.appendChild(playerBox);
        for (let i = 2; i < 4; i++) {
          playerBox = document.createElement('div');
          playerBox.classList.add('player-box');
          playerFrame = document.createElement('div');
          playerFrame.classList.add('player-frame');
          playerName = document.createElement('span');
          playerName.classList.add('player-name');
          playerFrame.textContent = `Player ${i}`;
          playerBox.appendChild(playerFrame);
          // if()
          playerName.textContent = 'Awaiting player...';
          playerBox.appendChild(playerName);
          playerBoxes.appendChild(playerBox);
        }
        nameInputs.style.display = 'none';

        // TODO:
        // 1. Make this run in Pahser instead.
        // 2. Make a socket controller to see if someones alreayd playing on this session
        //     then add a random numreric value in the end.
      }
    });

    // this part did not work out very well

    // }
    // buildLobby(players) {
    //   const urlParams = new URLSearchParams(window.location.search);
    //   let game = urlParams.get('game');

    //   if (game) {
    //     title.textContent = `${game} set up!`;
    //     let playerBox = document.createElement('div');
    //     playerBox.classList.add('player-box');
    //     let playerFrame = document.createElement('div');
    //     let playerName = document.createElement('span');
    //     playerFrame.textContent = 'Host';
    //     playerFrame.classList.add('player-frame');
    //     playerBox.appendChild(playerFrame);
    //     console.log(`this is the damn players obbject ${playersObject}`);
    //     playerName.textContent = gameScene.playersObject.hostName;
    //     playerName.classList.add('player-name');
    //     playerBox.appendChild(playerName);
    //     playerBoxes.appendChild(playerBox);
    //     for (let i = 2; i < 4; i++) {
    //       playerBox = document.createElement('div');
    //       playerBox.classList.add('player-box');
    //       playerFrame = document.createElement('div');
    //       playerFrame.classList.add('player-frame');
    //       playerName = document.createElement('span');
    //       playerName.classList.add('player-name');
    //       playerFrame.textContent = `Player ${i}`;
    //       playerBox.appendChild(playerFrame);
    //       // if()
    //       playerName.textContent = 'Awaiting player...';
    //       playerBox.appendChild(playerName);
    //       playerBoxes.appendChild(playerBox);
    //     }
    //     nameInputs.style.display = 'none';

    //     // TODO:
    //     // 1. Make this run in Pahser instead.
    //     // 2. Make a socket controller to see if someones alreayd playing on this session
    //     //     then add a random numreric value in the end.
    //   }
  }
  getPlayers(player) {
    console.log(`player: ${player}`);
  }
}
