/*
    globals
*/
var max_score = 100;
var max_score_input;

var current_scores = [0, 0];
var last_scores = [-1, -1, -1, -1]; // p0 last of dice 0, p1 last of dice 0 and so on.
var total_scores = [0, 0];

var images = [];
var dice_images = [];
var turn = 0; // 0: p0, 1: p1

var is_pause = false;

var get = (id) => {
    return document.getElementById(id);
}

// implementation
document.addEventListener('DOMContentLoaded', function () {
    loadImages();
    setupDiceImages();
    setupRefreshButton();
    setupMaxScoreInput();
    setupRollButton();
    setupHoldButton();
    refresh();
}, false);

function loadImages() {
    for (var i = 1; i <= 6; i++) {
        images[i] = `resources/images/dices/dice-${i}.png`;
    }
}

function setupDiceImages() {
    for (var i = 0; i < 2; i++) {
        dice_images[i] = get(`dice-${i}`);
    }
}

function setupRefreshButton() {
    get("play-button").onclick = (() => {
        location.reload();
    });
}

function setupMaxScoreInput() {
    max_score_input = get("score-input");
    max_score_input.addEventListener("change", () => {
        updateMaxScore();
    });
}

function setupRollButton() {
    var rollButton = get("roll-button");
    rollButton.onclick = (() => {
        rollAndEval();
    });
}

function setupHoldButton() {
    if (is_pause) return;

    var holdButton = get("hold-button");
    holdButton.onclick = (() => {
        holdScore();
    });
}

function updateMaxScore() {
    if (is_pause) return;

    var new_max_score = parseInt(max_score_input.value);
    if (new_max_score != NaN) {
        max_score = new_max_score;
    }
}

function rollAndEval() {
    if (is_pause) return;

    if (counter_handle != -1) return;

    showRollAnimation();

    var temp_score = [0, 0];
    temp_score[0] = getRandomDice();
    temp_score[1] = getRandomDice();

    if (checkLoseTotalCondition(temp_score[0], temp_score[1])) {
        last_scores[turn] = last_scores[turn + 2] = -1;
        updateCurrentScore(0);
        updateTotalScore(0);
        changeTurn();

    } else if (checkLoseCurrentCondition(temp_score[0], temp_score[1])) {
        last_scores[turn] = last_scores[turn + 2] = -1;
        updateCurrentScore(0);
        changeTurn();

    } else {
        last_scores[turn] = temp_score[0];
        last_scores[turn + 2] = temp_score[1];
        updateCurrentScore(current_scores[turn] + temp_score[0] + temp_score[1]);
    }
}

function checkLoseCurrentCondition(s0, s1) {
    return s0 == 1 || s1 == 1;
}

function checkLoseTotalCondition(s0, s1) {
    return (s0 == 6 || s1 == 6) && (last_scores[turn] == 6 || last_scores[turn + 2] == 6)
}

function getRandomDice() {
    return Math.floor(Math.random() * 6 + 1);
}

function holdScore() {
    updateTotalScore(total_scores[turn] + current_scores[turn]);
    updateCurrentScore(0);
    changeTurn();
}

function updateCurrentScore(score) {
    current_scores[turn] = score;
    refresh();

    if (current_scores[turn] >= max_score) {
        showWinner();
    }
}

function updateTotalScore(score) {
    total_scores[turn] = score;

    if (total_scores[turn] >= max_score) {
        showWinner();
    }
    refresh();
}

function changeTurn() {
    turn = 1 - turn;
    refresh();
}

var counter = 1;
var counter_handle = -1;

function showRollAnimation() {

    if (counter == 1) {
        showDice();
        counter_handle = setInterval(showRollAnimation, 100);

    } else if (counter > 6) {
        counter = 1;
        clearInterval(counter_handle);
        counter_handle = -1;
        return;

    } else {
        dice_images[0].src = images[getRandomDice()];
        dice_images[1].src = images[getRandomDice()];
    }
    counter++;
}

function showDice(show = true) {
    for (var i = 0; i < 2; i++) {
        get(`dice-${i}`).setAttribute("style", `display: ${show ? "inherit" : "none"};`);
    }
}

function showWinner() {
    is_pause = true;
    alert(`P${turn} has won!`);
    location.reload();
}

function refresh() {
    for (var i = 0; i < 2; i++) {
        get(`score-${i}`).innerText = current_scores[i];
        get(`total-score-${i}`).innerText = total_scores[i];
        get(`turn-${i}`).setAttribute("style", `display: ${turn == i ? "initial" : "none"};`);
    }
}