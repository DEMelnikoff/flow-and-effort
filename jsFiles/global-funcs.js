const jsPsych = initJsPsych();

const logit = function(rate, scale, k, shift, x0) {
    let x = rate / scale
    let denom = 1 + Math.exp(-k * (x - x0));
    let logit = 1 / denom;
    let pPop = logit - shift
    return pPop;
}