

var dotsTask = (function() {


    var p = {};


   /*
    *
    *   INSTRUCTIONS
    *
    */


    p.intro = {}

    
   /*
    *
    *   TASK
    *
    */

    p.task = {}


     const race = {
        type: jsPsychRaceGame,
        image: "myCar",
        imagePath: "img/myCar.png",
        height: 5,
        width: 7,
        initPos: 35,
        speed: .1,
        intercept: 0,
        choices: "NO_KEYS",
        keys: ["e", "i"],
        trial_duration: 50000,
    };

    const prize = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: function() {
            let outcome = jsPsych.data.getLastTrialData().values()[0].outcome;
            console.log(outcome);
            if (outcome) {
                let text = `
                <div style="position:absolute; top:22%; left:50%; margin-top:-2vh; margin-left:-50vh; font-size:3vh; z-index:9">
                    <p style="height:4vh; width:100vh; display:block; margin-left:auto; margin-right:auto">You got the prize!</p>
                </div>
                <div style="position:absolute; top:50%; left:50%; margin-top:-12vh; margin-left:-14vh">
                    <img src="img/prize.png" style="height:24vh; width:28vh; display:block; margin-left:auto; margin-right:auto"></img>
                </div>`;
                return text;
            } else {
                let text = `
                <div style="position:absolute; top:22%; left:50%; margin-top:-2vh; margin-left:-50vh; font-size:3vh; z-index:9">
                    <p style="height:4vh; width:100vh; display:block; margin-left:auto; margin-right:auto">You missed the prize!</p>
                </div>`
                return text;
            }
        },
        choices: "NO_KEYS",
        trial_duration: 2000,
    };     

    const trial = {
        timeline: [race, prize],
        repetitions: 25,
    };

    p.task.block = {
        timeline: [trial],
        repetitions: 10,
    };

   /*
    *
    *   QUESTIONS
    *
    */

    p.Qs = {};


    return p;

}());
