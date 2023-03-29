var jsPsychRaceGame = (function (jspsych) {
  'use strict';

  const info = {
      name: "race-game",
      parameters: {
          /**
           * Array containing the key(s) the subject must press to accelerate the car.
           */
          keys: {
              type: jspsych.ParameterType.KEYS,
              pretty_name: "Keys",
              default: "ALL_KEYS",
          },
          /**
           * Speed of car.
           */
          speed: {
              type: jspsych.ParameterType.INT,
              pretty_name: "Speed",
              default: null,
          },
          /**
           * Maximum speed of car.
           */
          maxSpeed: {
              type: jspsych.ParameterType.INT,
              pretty_name: "Max Speed",
              default: null,
          },
          /**
           * Array containing the key(s) the subject must press to accelerate the car.
           */
          carSize: {
              type: jspsych.ParameterType.INT,
              pretty_name: "Car Size",
              default: null,
          },
          /**
           * Starting position of car (distance from left edge of track) in pixels.
           */
          initPos: {
              type: jspsych.ParameterType.INT,
              pretty_name: "Initial Position",
              default: null,
          },
          /**
           * Width of track in pixels.
           */
          trackWidth: {
              type: jspsych.ParameterType.INT,
              pretty_name: "Track Width",
              default: null,
          },
          /**
           * This value is subtracted from the output of the logistic function to compute the probability of the opponent accelerating.
           */
          shift: {
              type: jspsych.ParameterType.INT,
              pretty_name: "Shift",
              default: null,
          },
          /**
           * This value is used to rescale the player's rate of button pressing as an input to the logistic function.
           */
          scale: {
              type: jspsych.ParameterType.INT,
              pretty_name: "Scale",
              default: null,
          },
          /**
           * Any content here will be displayed above the stimulus.
           */
          prompt: {
              type: jspsych.ParameterType.HTML_STRING,
              pretty_name: "Prompt",
              default: null,
          },
      },
  };
  /**
   * **html-keyboard-response**
   *
   * jsPsych plugin for displaying a stimulus and getting a keyboard response
   *
   * @author Josh de Leeuw
   * @see {@link https://www.jspsych.org/plugins/jspsych-html-keyboard-response/ html-keyboard-response plugin documentation on jspsych.org}
   */
  class RaceGamePlugin {
      constructor(jsPsych) {
          this.jsPsych = jsPsych;
      }
      trial(display_element, trial) {

          var new_html = 
          `<div style="position:relative; left: 0; right: 0; width: ${trial.trackWidth}px; height: 100px; margin:auto">
              <p style="font-size:25px">${trial.prompt}</p>
          </div>

          <div style="position:relative; left: 0; right: 0; width: ${trial.trackWidth}px; height: 250px; margin:auto">
            <div id="myCar" style="position:absolute; top:50px; left:${trial.initPos}px">
              <img src="img/myCar.png" style="height:${trial.carSize[0]}px; width:${trial.carSize[1]}px"></img>
            </div>
            <div id="opponent" style="position:absolute; top:${250-trial.carSize[0]-50}px; left:${trial.initPos}px">
              <img src="img/theirCar.png" style="height:${trial.carSize[0]}px; width:${trial.carSize[1]}px"></img>
            </div>
            <div style="position:absolute; left:${trial.trackWidth-trial.initPos}px; height: 100%; width:5px; background:black">
            </div>
          </div>

          <div style="position:relative; left: 0; right: 0; width: 600px; height: 100px; margin-top: 25px">
            <div style="position:absolute; left:${(trial.trackWidth/2) - 100}px; margin-left:-25px; font-size:25px">
              <p id="left-button" style="height:50px; width:50px; background:#ffa590; display:table-cell; vertical-align:middle; margin-left:auto; margin-right:auto">${trial.keys[0].toUpperCase()}</p>
            </div>
            <div style="position:absolute; left:${(trial.trackWidth/2) + 100}px; margin-left:-25px; font-size:25px">
              <p id="right-button" style="height:50px; width:50px; background:#a3a6a7; display:table-cell; vertical-align:middle; margin-left:auto; margin-right:auto">${trial.keys[1].toUpperCase()}</p>
            </div>
          </div>`

          // draw
          display_element.innerHTML = new_html;

          // get perturbation points
          const distance = trial.trackWidth - trial.carSize[1] - (2*trial.initPos) - 100;
          const pInterval = distance / 7;
          let pressRight = 0;
          let nPresses = 0;
          let myPos = trial.initPos;
          let myLastPos = trial.initPos;
          let theirPos = trial.initPos;
          let pPos = myPos + pInterval;
          let gauge = document.getElementById("gauge");
          let myCar = document.getElementById("myCar");
          let theirCar = document.getElementById("opponent");
          let leftButton = document.getElementById("left-button");
          let rightButton = document.getElementById("right-button");
          let loadTime = performance.now();
          let startTime = 0;
          let win;
          let tArray = [];
          let ipr = 0;
          let nPerturb = 0;
          let theirSpeed = 0;

          // function for moving own car
          const moveMe_func = function(event) {

            // get time of the start of the race
            if (nPresses == 0) { startTime = performance.now() };

            tArray.push(performance.now());

            if (tArray.length > 10) { tArray.shift() };

            if (tArray.length > 1) {
              ipr = (tArray.length - 1) * 1000 / (tArray[tArray.length - 1] - tArray[0]);
            };

            let iprAdjusted = ipr * trial.boost;

            // move car on screen
            let key = event.key;
            if (key == trial.keys[0] && pressRight == 0) {
                myPos = myPos + trial.speed * trial.boost * Math.min(1, trial.maxSpeed/iprAdjusted);
                myCar.style.left = myPos + "px";
                leftButton.style.background = "#a3a6a7";
                rightButton.style.background = "#ffa590";
                pressRight = 1;
                nPresses++;
            } else if (key == trial.keys[1] && pressRight == 1) {
                myPos = myPos + trial.speed * trial.boost * Math.min(1, trial.maxSpeed/iprAdjusted);
                myCar.style.left = myPos + "px";
                leftButton.style.background = "#ffa590";
                rightButton.style.background = "#a3a6a7";
                pressRight = 0;
                nPresses++;
            };

            myCar = document.getElementById("myCar");

            // end trial if car explodes or race is finished
            if (theirPos + trial.carSize[1] > trial.trackWidth - trial.initPos || myPos + trial.carSize[1] > trial.trackWidth - trial.initPos) {
              myPos >= theirPos ? win = 1 : win = 0;
              end_trial();
            }
          };

          // wrapper for balloon function
          const moveMe_wrap = function(trial) {
             return moveMe_func
          };
          
          // listen for keypress
          document.addEventListener("keydown", moveMe_wrap(trial));

          // function for moving opponent's car
          const moveThem_func = function() {
            let x0 = (trial.maxSpeed/(trial.maxBoost * trial.scale)) - 0.1428571;
            if (parseInt(myCar.style.left) != myLastPos) { theirSpeed = parseInt(myCar.style.left) - myLastPos };
            let pAccel = logit(Math.min(trial.maxSpeed/trial.boost, ipr), trial.scale, .7, trial.shift, x0);
            let accel = (Math.random() > pAccel) ? 1 : 0;
            let perturb = 0;
            if (myPos >= pPos && nPerturb < 7) {
              perturb = (accel - .5) * trial.speed * 4;
              if (nPerturb == 4) { perturb = perturb + (theirSpeed/2) };
              pPos = myPos + pInterval;
              nPerturb++;
              console.log(pAccel, perturb);
            };
            theirPos = theirPos + perturb + theirSpeed;
            theirCar.style.left = theirPos + "px";
            myLastPos = parseInt(myCar.style.left);
            if (theirPos + trial.carSize[1] > trial.trackWidth - trial.initPos || myPos + trial.carSize[1] > trial.trackWidth - trial.initPos) {
              myPos >= theirPos ? win = 1 : win = 0;
              end_trial();
            }
          };

          const move_opp = setInterval(moveThem_func, 300);


          // function to end trial when it is time
          const end_trial = () => {
              // kill any remaining setTimeout handlers
              document.removeEventListener("keydown", moveMe_wrap(trial));
              clearInterval(move_opp);
              this.jsPsych.pluginAPI.clearAllTimeouts();
              // kill keyboard listeners
              if (typeof keyboardListener !== "undefined") {
                  this.jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
              }
              // gather the data to store for the trial
              var trial_data = {
                  rt: performance.now() - loadTime,
                  playTime: performance.now() - startTime,
                  nPresses: nPresses,
                  myPos: myPos,
                  theirPos: theirPos,
                  outcome: win,
              };
              // clear the display
              display_element.innerHTML = "";
              // move on to the next trial
              this.jsPsych.finishTrial(trial_data);
          };
          // function to handle responses by the subject
          var after_response = (info) => {
              // after a valid response, the stimulus will have the CSS class 'responded'
              // which can be used to provide visual feedback that a response was recorded
              display_element.querySelector("#jspsych-html-keyboard-response-stimulus").className +=
                  " responded";
              // only record the first response
              if (response.key == null) {
                  response = info;
              }
              if (trial.response_ends_trial) {
                  end_trial();
              }
          };
      }
      simulate(trial, simulation_mode, simulation_options, load_callback) {
          if (simulation_mode == "data-only") {
              load_callback();
              this.simulate_data_only(trial, simulation_options);
          }
          if (simulation_mode == "visual") {
              this.simulate_visual(trial, simulation_options, load_callback);
          }
      }
      create_simulation_data(trial, simulation_options) {
          const default_data = {
              stimulus: trial.stimulus,
              rt: this.jsPsych.randomization.sampleExGaussian(500, 50, 1 / 150, true),
              response: this.jsPsych.pluginAPI.getValidKey(trial.choices),
          };
          const data = this.jsPsych.pluginAPI.mergeSimulationData(default_data, simulation_options);
          this.jsPsych.pluginAPI.ensureSimulationDataConsistency(trial, data);
          return data;
      }
      simulate_data_only(trial, simulation_options) {
          const data = this.create_simulation_data(trial, simulation_options);
          this.jsPsych.finishTrial(data);
      }
      simulate_visual(trial, simulation_options, load_callback) {
          const data = this.create_simulation_data(trial, simulation_options);
          const display_element = this.jsPsych.getDisplayElement();
          this.trial(display_element, trial);
          load_callback();
          if (data.rt !== null) {
              this.jsPsych.pluginAPI.pressKey(data.response, data.rt);
          }
      }
  }
  RaceGamePlugin.info = info;

  return RaceGamePlugin;

})(jsPsychModule);
