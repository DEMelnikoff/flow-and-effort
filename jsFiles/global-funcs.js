const jsPsych = initJsPsych();

const logit = function(score, rate, target, intercept) {
    let denom = 1 + Math.exp(-rate * (score - target));
    let logit = 1 / denom;
    let pPop = Math.min(logit + intercept, 1);
    return pPop;
}