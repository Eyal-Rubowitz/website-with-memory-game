// Those are global variables, they stay alive and reflect the state of the game
var elPreviousCard = null;
var flippedCouplesCount = 0;

// This is a constant that we dont change during the game (we mark those with CAPITAL letters)
var TOTAL_COUPLES_COUNT = 3;

// A condition to represent if payer began to play the game
var gameIsOn = false;

// game state
var isWining = false;

var isPleyAgain = false;

let bestTime = new Date(1856);

// Load an audio files
var audioRight = new Audio('sound/right.mp3');
var audioWin = new Audio('sound/win.mp3');
var audioWrong = new Audio('sound/wrong.mp3');

// This function is called whenever the user click a card
function cardClicked(elCard) {
    // if it's the first click of game move, start timer counting
    if (gameIsOn === false) {
        gameIsOn = true;
        onGameFirstClick();
    }

    // If the user clicked an already flipped card - do nothing and return from the function
    if (elCard.classList.contains('flipped')) {
        return;
    }

    // Flip it
    elCard.classList.add('flipped');

    // This is a first card, only keep it in the global variable
    if (elPreviousCard === null) {
        elPreviousCard = elCard;
    } else {
        // get the data-card attribute's value from both cards
        var card1 = elPreviousCard.getAttribute('data-card');
        var card2 = elCard.getAttribute('data-card');

        // No match, schedule to flip them back in 1 second
        if (card1 !== card2) {
            setTimeout(function () {
                elCard.classList.remove('flipped');
                elPreviousCard.classList.remove('flipped');
                audioWrong.play();
                elPreviousCard = null;
            }, 1000)

        } else {
            // Yes! a match!
            flippedCouplesCount++;
            elPreviousCard = null;

            // is All cards flipped?!
            if (TOTAL_COUPLES_COUNT === flippedCouplesCount) {
                audioWin.play();
                onWiningTheGame();
                // setTimeout(callConfirm, 1500);
                setTimeout(callPlayAgainConfirm, 0);
            } else {
                // answere is right - while the game is still beeing played
                audioRight.play();
            }

        }

    }


}

function callPlayAgainConfirm() {
    var userWantToPlay = window.confirm("Yay & Wooohoo... Congratulations you win the game !!! \n Do you like to play again ?");
    if (userWantToPlay === true) {
        restartGame();
        isPleyAgain = true;
    }
}

function restartGame() {
    // set game attributes to it's initiate state
    elPreviousCard = null;
    flippedCouplesCount = 0;
    isWining = false;
    startingTime = null;
    var elArray = document.getElementsByClassName('card');
    for (var i = 0; i < elArray.length; i++) {
        elArray[i].classList.remove('flipped')
    }
}

function onPageLoaded() {
    var name = prompt("Enter your name here:")
    localStorage.setItem('userName', name);
}

window.onload = onPageLoaded;

// function timeRefresh() {
//     return new Date().toLocaleDateString();
// }

function onGameFirstClick() {
    upTime(new Date());
}

function onWiningTheGame() {
    isWining = true;
    gameIsOn = false;
}

function upTime(countTo) {

    startingTime = new Date();

    // when user isen't start play the game, 
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
    if (!isWining) {
        countTo;
        difference = (startingTime - countTo);
    } else {
        // if player wins the game chack if this game has the best time score
        // it it is the best time score save it in localStorage
        timeScore(timeRecord);
    }

    // when user agree to play again, a new timer is initiate
    if (isPleyAgain === true) {
        isPleyAgain = false;
        upTime(new Date());
    }

    difference;

    days = Math.floor(difference / (60 * 60 * 1000 * 24) * 1);
    hours = Math.floor((difference % (60 * 60 * 1000 * 24)) / (60 * 60 * 1000) * 1);
    mins = Math.floor(((difference % (60 * 60 * 1000 * 24)) % (60 * 60 * 1000)) / (60 * 1000) * 1);
    secs = Math.floor((((difference % (60 * 60 * 1000 * 24)) % (60 * 60 * 1000)) % (60 * 1000)) / 1000 * 1);


    document.getElementById('days').firstChild.nodeValue = days;
    document.getElementById('hours').firstChild.nodeValue = hours;
    document.getElementById('minutes').firstChild.nodeValue = mins;
    document.getElementById('seconds').firstChild.nodeValue = secs;

    clearTimeout(upTime.to);
    upTime.to = setTimeout(function () { upTime(countTo); }, 1000);
}

function timeScore(time) {
    if (bestTime > time) {
        bestTime = time;
        localStorage.setItem('Best time record', bestTime);
    }
}