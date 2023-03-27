

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

    const stim = [
        {x0: 0},
        {x0: 80},
    ];

    let maxScore = 55;

    const balloon = {
        type: jsPsychBalloonGame,
        image: "balloon",
        imagePath: "img/balloon.png",
        initHeight: 13.5,
        initWidth: 10,
        choices: "NO_KEYS",
        keys: ["e", "i"],
        trial_duration: 5000,
    };

    const feedback = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: function() {
            let score = jsPsych.data.getLastTrialData().values()[0].score;
            let height = jsPsych.data.getLastTrialData().values()[0].height;
            let width = jsPsych.data.getLastTrialData().values()[0].width;
            let pPop = logit(score, .1, maxScore, jsPsych.timelineVariable('intercept'));
            let pop = pPop >= Math.random();
            console.log(score, maxScore, pPop);
            if (pop) {
                let text = `
                <div style="position:absolute; top:28%; left:50%; margin-top:-60px; margin-left:-200px; font-size:6vh; z-index:9">
                    <p style="height:120px; width:400px; display:block; margin-left:auto; margin-right:auto">Success!</p>
                </div>
                <div style="position:absolute; top:50%; left:50%; margin-top:-15vh; margin-left:-20vh">
                    <img src="img/explode.png" style="height:30vh; width:40vh; display:block; margin-left:auto; margin-right:auto"></img>
                </div>`;
                return text;
            } else {
                let text = `
                 <div style="position:absolute; top:28%; left:50%; margin-top:-60px; margin-left:-200px; font-size:6vh; z-index:9">
                    <p style="height:120px; width:400px; display:block; margin-left:auto; margin-right:auto">Failure!</p>
                </div>
                <div style="position:absolute; top:50%; left:50%; margin-top:-${height/2}vh; margin-left:-${width/2}vh">
                    <img src="img/balloon.png" style="height:${height}vh; width:${width}vh; display:block; margin-left:auto; margin-right:auto"></img>
                </div>`;
                return text;
            }
        },
        choices: "NO_KEYS",
        trial_duration: 2000,
    };     

    const trial = {
        timeline: [balloon, feedback],
        repetitions: 10,
        on_finish: function (data) {
            maxScore = Math.max(maxScore, jsPsych.data.get().select('score').max()); 
        }
    };

    p.task.block = {
        timeline: [trial],
        repetitions: 10,
        timeline_variables: [{intercept: 0}, {intercept: .5}],
    };

   /*
    *
    *   QUESTIONS
    *
    */

    p.Qs = {};


    return p;

}());
