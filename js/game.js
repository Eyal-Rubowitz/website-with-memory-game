// A global event handler - calls "onPageLoaded" method when html DOM object is initiate
window.onload = onPageLoaded;

// Those are global variables, they stay alive and reflect the state of the game
let elPreviousCard = null;

// those two variables are compared as wining condition 
let TOTAL_COUPLES_COUNT = 7;
let flippedCouplesCount = 0;

// get best score data from local storage
let bestTime = localStorage.getItem('Best time record') || (new Date() - new Date(1856));
// let bestTime = localStorage.clear();

// A condition to represent if payer began to play the game
let gameIsOn = false;

// game state
let isWining = false;

let isSaveGame = false;

// A condition that notify the "upTime" method when (user wins)
// to call "timeScore" method to check the best time score.
let isCheckScore = false;

// A condition to notify when two cards was revealed
let isProcessing = false;

let isReveal = false;

let isLoadingGame = false;

// Load an audio files
let audioRight = new Audio('sound/right.mp3');
let audioWin = new Audio('sound/win.mp3');
let audioWrong = new Audio('sound/wrong.mp3');

// This function is called whenever the user click a card
function onCardClicked(elCard) {

    // No choose amount of cards.. No game !  
    if (!document.querySelector('.popUpSelectBar').classList.contains("hideBar")) {
        return;
    }

    // if it's the first click of game move, start timer counting...
    if (gameIsOn === false) {
        onGameFirstClick();     // "onGameFirstClick" - starts the time counting
    }

    // If user clicked an already flipped card - do nothing & return
    // If game in proccess, the user cannot flip an other cards - so return
    if (elCard.classList.contains('flipped') || isProcessing) {
        return;
    }

    // Ignore clicking twice on same card
    if (elCard !== null && elPreviousCard !== null && elCard === elPreviousCard) {
        elCard = null;
        return;
    }

    // This is a first card, only keep it in the global variable
    if (elPreviousCard === null) {
        elPreviousCard = elCard;
        revealCard(elCard);
        elCard = null;
    } else {
        isProcessing = true;
        revealCard(elCard);

        // get the data-card attribute's value from both cards
        let card1 = elPreviousCard.getAttribute('data-card');
        let card2 = elCard.getAttribute('data-card');

        // No match, schedule to flip them back in 1 second
        if (card1 !== card2) {
            setTimeout(function () {
                flipCardBack(elPreviousCard, elCard);
            }, 1000)
        } else {
            // Yes! a match!
            flippedCouplesCount++;

            // const reveal class added
            elPreviousCard.classList.add('constRevealed');
            elCard.classList.add('constRevealed');

            elPreviousCard = null;

            // is All cards flipped?!
            if (TOTAL_COUPLES_COUNT === flippedCouplesCount) {
                winingTheGame();
            } else {
                // right answere sound - while the game is still beeing played
                audioRight.play();
            }
            isProcessing = false;
        }
    }
}

function onPlayAgain() {
    gameIsOn = false;
    restartGame();
    this.isPleyAgain = true;
}

function restartGame() {
    // set game attributes to it's initiate state
    showSelectBar();
    flippedCouplesCount = 0;
    isWining = false;
    currentTime = null;
    let textScore = bestTimeToString(bestTime);
    document.getElementById('timeRecord').textContent = textScore;
    // "querySelector" returns a single element
    // "querySelectorAll" returns a "NodeList" type
    // which is iterable & can be loop the sane way as "getElementsByClassName"
    document.querySelector('#playAgainContainer').classList.add('hideElement');
    // "getElementsByClassName" returns an "HTMLCollection" type
    // and it can be loop the same way as array
    let elArray = document.getElementsByClassName('card');
    Array.from(elArray).forEach((cardEl) => cardEl.classList.remove('flipped'));
    Array.from(elArray).forEach((cardEl) => cardEl.classList.remove('constRevealed'));
    onShuffleCards();
    upTime(new Date());
}

function onPageLoaded() {
    showSelectBar();
    document.querySelector('#playAgainContainer').classList.add('hideElement');
    let name = prompt("Enter your name here:")
    localStorage.setItem('userName', name);
    if(name === null) { name = '' }
    document.getElementById('playerName').textContent = `Hello ${name} !`;
    let textScore = bestTimeToString(bestTime);
    document.getElementById('timeRecord').textContent = textScore;
}

function onGameFirstClick() {
    gameIsOn = true;
    upTime(new Date());
}

function winingTheGame() {
    PlayAgainEl = document.querySelector('#playAgainContainer');
    PlayAgainEl.classList.remove('hideElement');
    audioWin.play();
    isWining = true;
    isCheckScore = true;
}

function upTime(startingTime) {

    currentTime = new Date();

    // when user start a new game but wasn't begin to play 
    // UI values set with an initiate state
    if (gameIsOn === false) {
        currentTime = new Date();
        startingTime = currentTime;
        difference = (currentTime - startingTime);
        days = 0;
        hours = 0;
        mins = 0;
        secs = 0;
    }

    if (isLoadingGame === true) {
        difference = updateLoadGameTime();
        startingTime = new Date(currentTime - difference);
    } else {
        // while user playing & there is no wining - time is counting up 
        if (gameIsOn && !isWining) {
            startingTime;
            difference = (currentTime - startingTime);
            check = (startingTime - currentTime);
        } else {
            // when user wins, game doesn't sets a new "difference" (time interval)
            // and the best record saved in system
            if (isCheckScore === true) {
                // If player wins the game chack if this game has the best time score
                // if it is the best time score, save it in localStorage
                timeScore(difference);
                isCheckScore = false;
            }
        }
    }

    difference;

    showTimeUI(difference);

    if (isSaveGame === true) {
        saveGame(difference);
        isSaveGame = false;
    }

    clearTimeout(upTime.to);
    upTime.to = setTimeout(function () { upTime(startingTime); }, 1000);
}

function timeScore(time) {
    if (bestTime > time) {
        bestTime = time;
        localStorage.setItem('Best time record', bestTime);
        let textScore = bestTimeToString(bestTime);
        document.getElementById('timeRecord').textContent = textScore;
    }
}

function bestTimeToString(bestTime) {

    let bTime = "";

    let oneMin = (1000 * 60)
    let oneHour = (oneMin * 60);
    let oneDay = (oneHour * 24);

    let bSecs = bestTime / 1000;
    let bMin = bestTime / oneMin
    let bHour = bestTime / oneHour;
    let bDay = bestTime / oneDay;

    if (bestTime < oneMin) {
        return bTime = `BEST SCORE: ${bSecs} - seconds`;
    } else if (bestTime < oneHour) {
        return bTime = `BEST SCORE EVER: ${bSecs} - seconds & ${bMin} - minuts`;
    } else if (bestTime < oneDay) {
        return nbTime = `BEST SCORE EVER: ${bSecs} - seconds & ${bMin} - minuts & ${bHour} - hours`;
    } else if (bestTime >= oneDay) {
        return bTime = `BEST SCORE EVER: ${bSecs} - seconds & ${bMin} - minuts & ${bHour} - hours & ${bDay} - days`;
    }
    return bTime;
}

function revealCard(cardEl) {
    // Flip it
    cardEl.classList.add('flipped');
}

function flipCardBack(card1, card2) {
    card1.classList.remove('flipped');
    card2.classList.remove('flipped');
    audioWrong.play();
    elPreviousCard = null;
    elCard = null;
    isProcessing = false;
}

function onUpdateUserName() {
    let name = prompt("Enter your name here:")
    localStorage.setItem('userName', name);
    if(name === null) { name = '' }
    document.getElementById('playerName').textContent = "Hello " + name + " !";
}

// A simple & short method for flip & reveal un-guessed cards
function onRevealCardsByClass() {
    let cardsDeck = document.getElementsByClassName('card');
    if (isReveal === false) {
        Array.from(cardsDeck).forEach((cardEl) => cardEl.classList.add('flipped'));
        isReveal = true;
    } else {
        Array.from(cardsDeck).forEach((cardEl) => cardEl.classList.remove('flipped'));
        isReveal = false;
    }
}

function onShuffleCards() {
    // shuffle cards when new game is about to begin
    let board = document.querySelector('.board');
    for (let i = board.children.length; i >= 0; i--) {
        board.appendChild(board.children[Math.random() * i | 0]);
    }
}

function setGameCardsAmount() {
    let cardsAmountSelect = document.getElementById("cardAmountSelect");
    if (cardsAmountSelect.options[cardsAmountSelect.selectedIndex].value === "") {
        return
    }
    let gameCardsAmount = Number(cardsAmountSelect.options[cardsAmountSelect.selectedIndex].value);
    TOTAL_COUPLES_COUNT = gameCardsAmount / 2;

    let cardsDeck = document.getElementsByClassName('card');

    // init all cards to be abled
    Array.from(cardsDeck).forEach((card) => card.classList.remove('unUsedCard'));

    // don't show cards with card.id that is greater then user input game amount of cards 
    //  CSS class "unUsedCard" added to element for not exists in DOM
    Array.from(cardsDeck).forEach((card) =>
        ((Number(card.id)) > gameCardsAmount) ? card.classList.add('unUsedCard') : card
    )

    onShuffleCards();

    let selectBar = document.getElementsByClassName('popUpSelectBar')[0];
    selectBar.classList.add('hideBar');
}

function showSelectBar() {
    let selectBar = document.getElementsByClassName('popUpSelectBar')[0];
    selectBar.classList.remove('hideBar');
}

function showTimeUI(timeInterval) {
    let oneMin = (1000 * 60)
    let oneHour = (oneMin * 60);
    let oneDay = (oneHour * 24);
    days = Math.floor(timeInterval / oneDay);
    hours = Math.floor((timeInterval % oneDay) / oneHour);
    mins = Math.floor((timeInterval % oneHour) / oneMin);
    secs = Math.floor((timeInterval % oneMin) / 1000);

    document.getElementById('days').firstChild.nodeValue = days;
    document.getElementById('hours').firstChild.nodeValue = hours;
    document.getElementById('minutes').firstChild.nodeValue = mins;
    document.getElementById('seconds').firstChild.nodeValue = secs;
}

function onSaveGame() {
    setTimeout(function () {
        isSaveGame = true;
    }, 0);

}

function saveGame(timeInterval) {
    // remove an old localStorage "saveGameStage" key&value (if exists) before seting a new one
    localStorage.removeItem('saveGameStage');
    // Grab html body element (with all the elements in it)
    let gameStage = document.getElementById('gameBody').innerHTML;
    let timeStage = timeInterval;
    let gameStageObject = { htmlBodyElements: gameStage, time: timeStage, cardsAmount: TOTAL_COUPLES_COUNT };
    localStorage.setItem('saveGameStage', JSON.stringify(gameStageObject));
}

function onLoadSavedGame() {
    if (localStorage.getItem('saveGameStage') === '' || localStorage.getItem('saveGameStage') === null) {
        return
    }

    let jsonGameStageObject = JSON.parse(localStorage.getItem('saveGameStage'));

    let htmlBody = document.getElementById('gameBody');
    htmlBody.innerHTML = jsonGameStageObject.htmlBodyElements;

    TOTAL_COUPLES_COUNT = Number(jsonGameStageObject.cardsAmount);
    flippedCouplesCount = (document.querySelectorAll('.constRevealed').length / 2);

    gameIsOn = true;
    isLoadingGame = true;

    upTime(new Date());
}

function updateLoadGameTime() {
    isLoadingGame = false;
    gameIsOn = true;
    isWining = false;
    let jsonGameStageObject = JSON.parse(localStorage.getItem('saveGameStage'));
    let timeStage = Number(jsonGameStageObject.time);
    return timeStage;
}

function onToggleBurger() {
    let burger = document.getElementsByClassName('toggleBurger')[0];
    burger.classList.toggle('open');
}