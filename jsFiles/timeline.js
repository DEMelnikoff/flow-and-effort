function MakeTimeline(game) {
    this.timeline = [
        game.intro.r1,
        game.task.block1,
        game.intro.r2,
        game.task.block2,
    ]
};

var exp = new MakeTimeline(raceTask);


// initiate timeline
jsPsych.run(exp.timeline);
