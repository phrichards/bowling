var frames = Array.from(document.getElementsByClassName('frame'));
let score = 0;
let frameScore = 0;
let totalFrameScore = 0;
let strike = false;
let spare = false;
let scores = [];
function validateScore(val, id, frame) {
    var intVal = parseInt(val);
    if (id.indexOf('b1') > -1) {
        frameScore = 0;
        totalFrameScore = 0;
        var reg = new RegExp(/^[xX0-9]$/g);
        if (reg.test(val)) {
            if (val.toLowerCase() == 'x') {
                scores.push('x');
                strike = true;
            } else {
                frameScore += intVal;
                scores.push(intVal);
            }
        }
    } else if (id.indexOf('b2') > -1 || id.indexOf('b3') > -1) {
        if (frame == 10) {
            var reg = new RegExp(/^[/xX0-9]$/g);
        } else {
            var reg = new RegExp(/^[/0-9]$/g);
        }
        if (reg.test(val)) {
            if (frameScore + intVal > 10) {
                alert("Please enter a valid score");
                return;
            } else {
                if (val == '/') {
                    scores.push('/');
                    spare = true;
                } else {
                    frameScore += intVal;
                    totalFrameScore = frameScore;
                    scores.push(intVal);
                }
            }
        }
    }

    let res = reg.test(val);
    if (!reg.test(val)) {
        alert("Please enter a valid score");
    } else {
        let thisFrame = document.getElementById(id);
        if (strike && frame !== 10) {
            var next = frames[frames.indexOf(thisFrame) + 2];
        } else {
            var next = frames[frames.indexOf(thisFrame) + 1];
        }
        if (typeof(next) !== 'undefined') {
            next.disabled = false;
            next.focus();
        }
        calculateScore(totalFrameScore, frame, id);
        strike = false;
        spare = false;
    }
}

function calculateScore(totalFrameScore, frame, id) {
    var currentBall = scores[scores.length - 1];
    var lastBall = scores[scores.length - 2];
    var twoBallsAgo = scores[scores.length - 3];

    if (twoBallsAgo == 'x' && frame !== 10) {
        // Two balls ago was strike, last ball was strike, this ball is strike
        if (lastBall == 'x' && twoBallsAgo == 'x' && currentBall == 'x') {
            scores[scores.length - 3] = 30;
            // Two balls ago was strike, last ball was strike, this ball is not strike
        } else if (lastBall == 'x' && twoBallsAgo == 'x' && currentBall !== 'x') {
            scores[scores.length - 3] = 20 + scores[scores.length - 1];
            // Two balls ago was strike, last ball was not strike, this ball is strike
        } else if (twoBallsAgo == 'x' && lastBall !== 'x' && currentBall == 'x') {
            scores[scores.length - 3] = 10 + scores[scores.length - 2] + 10;
            // Two balls ago was strike, last ball was not strike, this ball is not strike
        } else if (twoBallsAgo == 'x' && lastBall !== 'x' && currentBall !== 'x') {
            if (scores[scores.length - 1] == '/') {
                scores[scores.length - 3] = 20;
            } else {
                scores[scores.length - 3] = 10 + scores[scores.length - 2] + scores[scores.length - 1];
            }
        }
    }

    if (lastBall == '/') {
        if (twoBallsAgo !== 'x') {
            scores[scores.length - 2] = 10 - scores[scores.length - 3];
            if (currentBall !== 'x') {
                scores[scores.length - 2] += scores[scores.length - 1];
            } else {
                scores[scores.length - 2] += 10;
            }
        }
    }

    if (frame == 10) {
        if (id == 'f10b1' && currentBall == 'x') {
            scores[scores.length - 1] = 10;
        }
    }

    const reducer = (accumulator, currentValue) => accumulator + currentValue;
    if (scores.indexOf('x') < 0 && scores.indexOf('/') < 0) {
        score = scores.reduce(reducer);
    }

    document.getElementById('finalScore').innerHTML = score;
}