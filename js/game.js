// The variables type identifier was changed from "var" to "let"
// so the variables are accessable only in there scope

// A global event handler - calls "onPageLoaded" method when html DOM object is initiate
window.onload = onPageLoaded;

// Those are global variables, they stay alive and reflect the state of the game
let elPreviousCard = null;
let flippedCouplesCount = 0;

// This is a constant that we dont change during the game (we mark those with CAPITAL letters)
// The variable type identifier was changed from "var" to "const" 
// so now identifier is immutable & it can’t be reassigned.
const TOTAL_COUPLES_COUNT = 3;

// A condition to represent if payer began to play the game
let gameIsOn = false;

// game state
let isWining = false;

// A condition to allow two cards proccess at once only
let isPleyAgain = false;

// get best score data from local storage
debugger;
let bestTime = localStorage.getItem('Best time record') || (new Date() - new Date(1856));
// let bestTime = localStorage.removeItem('Best time record');

// A condition that uses the "upTime" method when user wins
// to call "timeScore" method to check the best time score.
let isCheckScore = false;

let btnPlayAgainEl = document.getElementById("playAgainContainer");

// A condition to notify when two cards was revealed
let isProcessing = false;

// Load an audio files
let audioRight = new Audio('sound/right.mp3');
let audioWin = new Audio('sound/win.mp3');
let audioWrong = new Audio('sound/wrong.mp3');

// This function is called whenever the user click a card
function cardClicked(elCard) {

    // if it's the first click of game move, start timer counting
    if (gameIsOn === false) {
        // "onGameFirstClick" - start time counting
        onGameFirstClick();
    }

    // If the user clicked an already flipped card - do nothing & return
    // If game in proccess, the user cannot flip other cards
    if (elCard.classList.contains('flipped') || isProcessing) {
        debugger;
        return;
    }

    // Egnore clicking twice on same card
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
                elCard.classList.remove('flipped');
                elPreviousCard.classList.remove('flipped');
                audioWrong.play();
                elPreviousCard = null;
                elCard = null;
                isProcessing = false;
            }, 1000)
        } else {
            // Yes! a match!
            flippedCouplesCount++;
            elPreviousCard = null;
            revealCard(elCard);

            // is All cards flipped?!
            if (TOTAL_COUPLES_COUNT === flippedCouplesCount) {
                onWiningTheGame();
            } else {
                // answere is right - while the game is still beeing played
                audioRight.play();
            }
            isProcessing = false;
        }
    }
}

function playAgain() {
    gameIsOn = false;
    restartGame();
    isPleyAgain = true;
}

function restartGame() {
    // set game attributes to it's initiate state
    elPreviousCard = null;
    flippedCouplesCount = 0;
    isWining = false;
    startingTime = null;
    debugger;
    let textScore = bestTimeToString(bestTime);
    document.getElementById('timeRecord').textContent = textScore;
    btnPlayAgainEl.style.visibility = "hidden";
    let elArray = document.getElementsByClassName('card');
    for (var i = 0; i < elArray.length; i++) {
        elArray[i].classList.remove('flipped')
    }
    // shuffle cards when new game is about to begin
    var board = document.querySelector('.board');
    for (var i = board.children.length; i >= 0; i--) {
        board.appendChild(board.children[Math.random() * i | 0]);
    }
    upTime(new Date());
}

function onPageLoaded() {
    let name = prompt("Enter your name here:")
    localStorage.setItem('userName', name);
    debugger;
    let textScore = bestTimeToString(bestTime);
    document.getElementById('timeRecord').textContent = textScore;
    btnPlayAgainEl.style.visibility = "hidden";
}

function onGameFirstClick() {
    gameIsOn = true;
    upTime(new Date());
}

function onWiningTheGame() {
    btnPlayAgainEl.style.visibility = "visible";
    audioWin.play();
    isWining = true;
    isCheckScore = true;
}

function upTime(countTo) {

    startingTime = new Date();

    // when user start a game but isen't begin to play the game 
    // UI values stay with there initiate state
    if (gameIsOn === false) {
        startingTime = new Date();
        countTo = startingTime;
        difference = (startingTime - countTo);
        days = 0;
        hours = 0;
        mins = 0;
        secs = 0;
    }

    // while user playing & there is no wining - time is counting up 
    // when user wins, game doesn't sets a new (difference) time interval
    // and the best record saved in system
    if (gameIsOn && !isWining) {
        countTo;
        difference = (startingTime - countTo);
    } else {
        if (isCheckScore === true) {
            // If player wins the game chack if this game has the best time score
            // if it is the best time score, save it in localStorage
            debugger;
            timeScore(difference);
            isCheckScore = false;
        }
    }

    // When user agree to play again, a new timer is initiate
    if (isPleyAgain === true) {
        isPleyAgain = false;
        upTime(new Date());
    }

    difference;
    let oneMin = (1000 * 60)
    let oneHour = (oneMin * 60);
    let oneDay = (oneHour * 24);
    days = Math.floor(difference / oneDay);
    hours = Math.floor((difference % oneDay) / oneHour);
    mins = Math.floor((difference % oneHour) / oneMin);
    secs = Math.floor((difference % oneMin) / 1000);


    document.getElementById('days').firstChild.nodeValue = days;
    document.getElementById('hours').firstChild.nodeValue = hours;
    document.getElementById('minutes').firstChild.nodeValue = mins;
    document.getElementById('seconds').firstChild.nodeValue = secs;

    clearTimeout(upTime.to);
    upTime.to = setTimeout(function () { upTime(countTo); }, 1000);
}

function timeScore(time) {
    debugger;
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
    debugger;
    if (bestTime < oneMin) {
        return bTime = `BEST SCORE EVER: ${bSecs} - seconds`;
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