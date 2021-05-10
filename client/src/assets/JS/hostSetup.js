const popUp = document.querySelector(".pop-up");
const gameName = document.querySelector('#gameName');
const hostNameField = document.querySelector('#hostName');
const playerBoxes = document.querySelector('.players-setup');
const nameBtn = document.querySelector('.name-btn');
const nameInputs = document.querySelector('.names-input');
const gameLnkFields = document.querySelector('.game-link-fields');
const title = document.querySelector('h1');
const gameLnk = document.querySelector('.game-link');


nameBtn.addEventListener('click', function () {
    if(gameName.value === ''){
        alert("Please input a name for your session.");
        return;
    }
    if(hostNameField.value === ''){
        alert("Please input a name for yourself.");
        return;
    }

    title.textContent = `${gameName.value} set up!`
    let playerBox = document.createElement('div');
    playerBox.classList.add('player-box');
    let playerFrame = document.createElement('div');
    let playerName = document.createElement('span');
    playerFrame.textContent='Host';
    playerFrame.classList.add("player-frame");
    playerBox.appendChild(playerFrame);
    playerName.textContent=hostNameField.value;
    playerName.classList.add('player-name');
    playerBox.appendChild(playerName);
    playerBoxes.appendChild(playerBox);

    for(let i = 2; i < 4; i++){
        playerBox = document.createElement('div');
        playerBox.classList.add('player-box');
        playerFrame = document.createElement('div');
        playerFrame.classList.add("player-frame");
        playerName = document.createElement('span');
        playerName.classList.add('player-name');


        playerFrame.textContent = `Player ${i}`;
        playerBox.appendChild(playerFrame);
        playerName.textContent = "Awaiting player...";
        playerBox.appendChild(playerName);
        playerBoxes.appendChild(playerBox);
    }


    nameInputs.style.display = 'none';
    gameLnkFields.style.display = 'flex';
    let gameNameSlug = gameName.value.replace(/\s+/g, '-').toLowerCase();
    let gameLnkUrl = `${window.location.href}/?${gameNameSlug}`;
    console.log(gameLnkUrl);
    gameLnk.textContent = gameLnkUrl;
    
    // TODO:
        // 1. Make this run in Pahser instead.
        // 2. Make a socket controller to see if someones alreayd playing on this session
        //     then add a random numreric value in the end.

    
})
