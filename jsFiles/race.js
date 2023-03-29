

var raceTask = (function() {


    var p = {};

    const settings = {
        effortOrder: Math.floor(Math.random()*2),
        difficulty: ["easy", "hard"][Math.floor(Math.random()*2)],
        carSize: [40, 90],
        initPos: 50,
        trackWidth: 600,
        maxBoost: 3,
    };

    // condition-dependent text variables
    const text = {
        game1_class: settings.effortOrder == 0 ? 'green-game' : 'blue-game',
        game2_class: settings.effortOrder == 0 ? 'blue-game' : 'green-game',
        game1_name: settings.effortOrder == 0 ? 'Full Speed Ahead' : 'Slow & Steady Wins the Race',
        game2_name: settings.effortOrder == 0 ? 'Slow & Steady Wins the Race' : 'Full Speed Ahead',
    };


    jsPsych.data.addProperties({
        effortOrder: ["effort_first", "effort_second"][settings.effortOrder],
        difficulty: settings.difficulty,
    });

   /*
    *
    *   INSTRUCTIONS
    *
    */

    console.log(settings.difficulty, settings.effortOrder);
    p.intro = {}

    // html chunks
    const trackImg = 
        `<div style="position:relative; left: 0; right: 0; width: 500px; height: 350px; margin:auto">
        <div style="position:absolute; top:10%; left:10%">
            <img src="img/myCar.png" style="height:${settings.carSize[0]}px; width:${settings.carSize[1]}px"></img>
        </div>

        <div style="position:absolute; top:40%; left:10%">
            <img src="img/theirCar.png" style="height:${settings.carSize[0]}px; width:${settings.carSize[1]}px"></img>
        </div>

        <div style="position:absolute; top:5%; left:90%; height:50%; width:5px; background:black">
        </div></div>`;

    const trackImg_pressLeft = 
        `<div style="position:relative; left: 0; right: 0; width: 500px; height: 350px; margin:auto">
        <div style="position:absolute; top:10%; left:10%">
            <img src="img/myCar.png" style="height:${settings.carSize[0]}px; width:${settings.carSize[1]}px"></img>
        </div>

        <div style="position:absolute; top:40%; left:10%">
            <img src="img/theirCar.png" style="height:${settings.carSize[0]}px; width:${settings.carSize[1]}px"></img>
        </div>

        <div style="position:absolute; top:5%; left:90%; height:50%; width:5px; background:black">
        </div>

        <div style="position:absolute; top:90%; left:30%; margin-top:-25px; margin-left:-25px; font-size:25px">
            <p style="height:50px; width:50px; background:#ffa590; display:table-cell; vertical-align:middle; margin-left:auto; margin-right:auto">E</p>
        </div>

        <div style="position:absolute; top:90%; left:70%; margin-top:-25px; margin-left:-25px; font-size:25px">
            <p style="height:50px; width:50px; background:#a3a6a7; display:table-cell; vertical-align:middle; margin-left:auto; margin-right:auto">I</p>
        </div></div>`;

    const trackImg_pressRight = 
        `<div style="position:relative; left: 0; right: 0; width: 500px; height: 350px; margin:auto">
        <div style="position:absolute; top:10%; left:10%">
            <img src="img/myCar.png" style="height:${settings.carSize[0]}px; width:${settings.carSize[1]}px"></img>
        </div>

        <div style="position:absolute; top:40%; left:10%">
            <img src="img/theirCar.png" style="height:${settings.carSize[0]}px; width:${settings.carSize[1]}px"></img>
        </div>

        <div style="position:absolute; top:5%; left:90%; height:50%; width:5px; background:black">
        </div>

        <div style="position:absolute; top:90%; left:30%; margin-top:-25px; margin-left:-25px; font-size:25px">
            <p style="height:50px; width:50px; background:#a3a6a7; display:table-cell; vertical-align:middle; margin-left:auto; margin-right:auto">E</p>
        </div>

        <div style="position:absolute; top:90%; left:70%; margin-top:-25px; margin-left:-25px; font-size:25px">
            <p style="height:50px; width:50px; background:#ffa590; display:table-cell; vertical-align:middle; margin-left:auto; margin-right:auto">I</p>
        </div></div>`;

    const bonusMessage = 
        `<div style="font-size: 50px">
            <p>You won!</p>
        </div>
        <div style="font-size: 70px; color:green">
            <p>+5 Cents</p>
        </div>`;

    const failureMessage = 
        `<div style="font-size: 50px">
            <p>You lost!</p>
        </div>
        <div style="font-size: 70px">
            <p>+0 Cents</p>
        </div>`;

    const game1_highEffortMsg = `<div class='parent'>
            <p>In <span class='${text.game1_class}'>${text.game1_name}</span>, the car you'll be driving is <strong>difficult</strong> to accelerate:<br>
            To reach top speed, you'll need to press your keys <strong>as fast as possible</strong>.</p>
            ${trackImg_pressRight}
            </div>`;

    const game1_lowEffortMsg = `<div class='parent'>
            <p>In <span class='${text.game1_class}'>${text.game1_name}</span>, the car you'll be driving is <strong>easy</strong> to accelerate:<br>
            To reach top speed, you'll only need to press your keys <strong>at a leisurely pace</strong>.</p>
            ${trackImg_pressRight}
            </div>`;

    const game2_highEffortMsg = `<div class='parent'>
            <p>In <span class='${text.game2_class}'>${text.game2_name}</span>, your car will be <strong>difficult</strong> to accelerate:<br>
            To reach top speed, you'll need to press your keys <strong>as fast as possible</strong>.</p>
            </div>`;

    const game2_lowEffortMsg = `<div class='parent'>
        <p>In <span class='${text.game2_class}'>${text.game2_name}</span>, your car will be <strong>easy</strong> to accelerate:<br>
        To reach top speed, you'll only need to press your keys <strong>at a leisurely pace</strong>.</p>
        </div>`;

    // add condition-depend html chunks to settings
    settings.effortOrder == 0 ? text.game1_effortText = game1_highEffortMsg : text.game1_effortText = game1_lowEffortMsg;
    settings.effortOrder == 0 ? text.game2_effortText = game2_lowEffortMsg : text.game2_effortText = game2_highEffortMsg;

    // html for instructions
    const pages = {
        r1: {
            part1: [`<div class='parent' style='text-align: left'>
            <p>Thank you.</p>
            <p>Next, we will introduce you to the survey.</p>
            <p>When you are ready, please continue.</p></div>`,

            `<div class='parent' style='text-align: left'>
            <p>We are designing games that scientists can use to study motor coordination. 
            Our goal is to make the games as immersive and engaging as possible.
            To achieve this, we are getting feedback from people like you.</p>
            <p>You will play two different games. After each game, you will report how immersed and engaged you felt.</p>
            <p>Continue to learn about and play the first of the two games.</p>
            </div>`,

            `<div class='parent'>
            <p>The goal of the first game is to win as much money as possible.</p>
            <p>All of the money you win during the game will be added to
            a "bonus fund,"<br>which you'll receive at the end of the study.</p>
            <p>Your total payment will be $1.50 for your participation, plus all of the money in your bonus fund.</p>
            </div>`],

            part2: [`<div class='parent'>
            <p>The first game is called <span class='${text.game1_class}'>${text.game1_name}</span>. It is played in multiple rounds.</p>
            </div>`,

            `<div class='parent'>
            <p>In each round, you'll race your car against an opponent.<br>
            You'll be driving the red car. Your opponent will be driving the blue car.</p>
            ${trackImg}
            </div>`,

            `<div class='parent'>
            <p>You'll earn a 5 cent bonus for each race you win.<br>
            Specifically, 5 cents will be added to your bonus fund each time you cross the finish line before your opponent.</p>
            ${trackImg}
            </div>`,

            `<div class='parent'>
            <p>Each time you win a race, you'll receive the following message:</p>
            ${bonusMessage}
            </div>`,

            `<div class='parent'>
            <p>Each time you lose a race, you'll receive the following message:</p>
            ${failureMessage}
            </div>`,

            `<div class='parent'>
            <p>To beat your opponent, you'll need to accelerate your car.<br>
            &nbsp</p>
            ${trackImg}
            </div>`,

            `<div class='parent'>
            <p>To accelerate your car, you must press your E-key, then your I-key, one after the other.<br>
            The faster your press the appropriate keys, the faster your car will go.</p>
            ${trackImg}              
            </div>`,

            `<div class='parent'>
            <p>On the bottom of your screen,<br>
            you'll see a reminder of which key you must press to accelerate.</p>
            ${trackImg}              
            </div>`,

            `<div class='parent'>
            <p>When you need to press your E-key,<br>
            the cue will look like this:</p>
            ${trackImg_pressLeft}
            </div>`,

            `<div class='parent'>
            <p>When you need to press your I-key,<br>
            the cue will look like this:</p>
            ${trackImg_pressRight}
            </div>`,

            text.game1_effortText],

            part3: [`<div class='parent'>
            <p>You are now ready to play <span class='${text.game1_class}'>${text.game1_name}</span>.</p>
            <p>Once you proceed, <span class='${text.game1_class}'>${text.game1_name}</span> will start immediately, 
            so get ready to drive!</p>
            <p>Continue to the next screen to begin.</p>
            </div>`]
        },
        r2: {
            part1: [`<div class='parent'>
            <p>Thank you for playing <span class='${text.game1_class}'>${text.game1_name}</span>!</p>
            When you're ready, continue to learn about and play <span class='${text.game2_class}'>${text.game2_name}</span>.</p>
            </div>`,

            `<div class='parent'>
            <p><span class='${text.game2_class}'>${text.game2_name}</span> is identical to 
            <span class='${text.game1_class}'>${text.game1_name}</span> with one exception.</p>
            </div>`],

            part2: [text.game2_effortText],

            part3: [`<div class='parent'>
            <p>You are now ready to play <span class='${text.game2_class}'>${text.game2_name}</span>.</p>
            <p>Once you proceed, <span class='${text.game2_class}'>${text.game2_name}</span> will start immediately, 
            so get ready to drive!</p>
            <p>Continue to the next screen to begin.</p>
            </div>`]
        }
    };

    // create instruction variables
    const r1part1 = {
        type: jsPsychInstructions,
        pages: pages.r1.part1,
        show_clickable_nav: true,
        post_trial_gap: 500,
    };

    const r1part2 = {
        type: jsPsychInstructions,
        pages: pages.r1.part2,
        show_clickable_nav: true,
        post_trial_gap: 500,
    };

    const r1part3 = {
        type: jsPsychInstructions,
        pages: pages.r1.part3,
        show_clickable_nav: true,
        post_trial_gap: 500,
    };

    const r2part1 = {
        type: jsPsychInstructions,
        pages: pages.r2.part1,
        show_clickable_nav: true,
        post_trial_gap: 500,
    };

    const r2part2 = {
        type: jsPsychInstructions,
        pages: pages.r2.part2,
        show_clickable_nav: true,
        post_trial_gap: 500,
    };

    const r2part3 = {
        type: jsPsychInstructions,
        pages: pages.r2.part3,
        show_clickable_nav: true,
        post_trial_gap: 500,
    };

    // create attention checks
    const errorMessage = {
        type: jsPsychInstructions,
        pages: [`<div class='parent'><p>You provided the wrong answer.<br>To make sure you understand the game, please continue to re-read the instructions.</p></div>`],
        show_clickable_nav: true,
    };

    const compChk1 = {
        type: jsPsychSurveyMultiChoice,
        preamble: `<div style="font-size:16px"><p>To make sure you understand <span class='${text.game1_class}'>${text.game1_name}</span>, please indicate whether the following statement is true or false:</p></div>`,
        questions: [
            {
                prompt: `In order to reach top speed in <span class='${text.game1_class}'>${text.game1_name}</span>, I'll have to press my keys as fast as possible.`, 
                name: "attnChk_part1", 
                options: ["True", "False"],
            }],
        scale_width: 500,
    };

    const compChk2 = {
        type: jsPsychSurveyMultiChoice,
        preamble: `<div style="font-size:16px"><p>To make sure you understand <span class='${text.game2_class}'>${text.game2_name}</span>, please indicate whether the following statement is true or false:</p></div>`,
        questions: [
            {
                prompt: `In order to reach top speed in <span class='${text.game2_class}'>${text.game2_name}</span>, I'll have to press my keys as fast as possible.`, 
                name: "attnChk_part2", 
                options: ["True", "False"],
            }],
        scale_width: 500,
    };

    const conditionalNode_part1 = {
        timeline: [errorMessage],
        conditional_function: function(){
            let correctAnswer = 'False';
            let responseArray = jsPsych.data.get().select('response').values
            if (settings.effortOrder == 0) { correctAnswer = 'True' }
            return responseArray[responseArray.length-1].attnChk_part1 != correctAnswer;
        },
    };

    const attnChkLoop_part1 = {
        timeline: [r1part2, compChk1, conditionalNode_part1],
        loop_function: function(){
            let correctAnswer = 'False';
            let responseArray = jsPsych.data.get().select('response').values
            if (settings.effortOrder == 0) { correctAnswer = 'True' }
            return responseArray[responseArray.length-1].attnChk_part1 != correctAnswer;
        },
    };

    const conditionalNode_part2 = {
        timeline: [errorMessage],
        conditional_function: function(){
            let correctAnswer = 'True';
            let responseArray = jsPsych.data.get().select('response').values
            if (settings.effortOrder == 0) { correctAnswer = 'False' }
            return responseArray[responseArray.length-1].attnChk_part2 != correctAnswer;
        },
    };

    const attnChkLoop_part2 = {
        timeline: [r2part2, compChk2, conditionalNode_part2],
        loop_function: function(){
            let correctAnswer = 'True';
            let responseArray = jsPsych.data.get().select('response').values
            if (settings.effortOrder == 0) { correctAnswer = 'False' }
            return responseArray[responseArray.length-1].attnChk_part2 != correctAnswer;
        },
    };

    // create instruction blocks
    p.intro.r1 = {
        timeline: [r1part1, attnChkLoop_part1, r1part3],
    };

    p.intro.r2 = {
        timeline: [r2part1, attnChkLoop_part2, r2part3],
    };
    
   /*
    *
    *   TASK
    *
    */

    p.task = {}

    const race = {
        type: jsPsychRaceGame,
        prompt: "Reach the finish line first to win a bonus!",
        carSize: settings.carSize,
        trackWidth: 600,
        initPos: settings.initPos,
        speed: 6,
        shift: settings.difficulty == "hard" ? .4: 0,
        scale: 2.8,
        maxSpeed: 14,
        maxBoost: settings.maxBoost,
        boost: jsPsych.timelineVariable('boost'),
        keys: ["e", "i"],
    };

    const prize = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: function() {
            let outcome = jsPsych.data.getLastTrialData().values()[0].outcome;
            if (outcome) {
                return bonusMessage;
            } else {
                return failureMessage;
            }
        },
        choices: "NO_KEYS",
        trial_duration: 2000,
    };

    p.task.block1 = {
        timeline: [race, prize],
        repetitions: 5,
        timeline_variables: [ { boost: [1, settings.maxBoost][settings.effortOrder] } ]
    };

    p.task.block2 = {
        timeline: [race, prize],
        repetitions: 5,
        timeline_variables: [ { boost: [1, settings.maxBoost][1 - settings.effortOrder] } ]
    };

   /*
    *
    *   QUESTIONS
    *
    */

    p.Qs = {};


    return p;

}());
