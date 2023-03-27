var jsPsychRaceGame = (function (jspsych) {
  'use strict';

  const info = {
      name: "race-game",
      parameters: {
          /**
           * The HTML string to be displayed.
           */
          image: {
              type: jspsych.ParameterType.HTML_STRING,
              pretty_name: "Image",
              default: undefined,
          },
          /**
           * Array containing the key(s) the subject is allowed to press to respond to the stimulus.
           */
          choices: {
              type: jspsych.ParameterType.KEYS,
              pretty_name: "Choices",
              default: "ALL_KEYS",
          },
          keys: {
              type: jspsych.ParameterType.KEYS,
              pretty_name: "Keys",
              default: "ALL_KEYS",
          },
          /**
           * Any content here will be displayed below the stimulus.
           */
          prompt: {
              type: jspsych.ParameterType.HTML_STRING,
              pretty_name: "Prompt",
              default: null,
          },
          /**
           * How long to show the stimulus.
           */
          stimulus_duration: {
              type: jspsych.ParameterType.INT,
              pretty_name: "Stimulus duration",
              default: null,
          },
          /**
           * How long to show trial before it ends.
           */
          trial_duration: {
              type: jspsych.ParameterType.INT,
              pretty_name: "Trial duration",
              default: null,
          },
          /**
           * If true, trial will end when subject makes a response.
           */
          response_ends_trial: {
              type: jspsych.ParameterType.BOOL,
              pretty_name: "Response ends trial",
              default: true,
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
          `<div style="position:absolute; top:22%; left:50%; margin-top:-2vh; margin-left:-50vh; font-size:3vh; z-index:9">
            <p style="height:4vh; width:100vh; display:block; margin-left:auto; margin-right:auto">Reach the finish line first to win a bonus!</p>
          </div>

          <div id="${trial.image}" style="position:absolute; top:40%; left:${trial.initPos}%">
            <img src="${trial.imagePath}" style="height:${trial.height}vh; width:${trial.width}vw"></img>
          </div>

          <div id="opponent" style="position:absolute; top:50%; left:${trial.initPos}%">
            <img src="img/theirCar.png" style="height:${trial.height}vh; width:${trial.width}vw"></img>
          </div>

          <div style="position:absolute; top:35%; left:${100-trial.initPos}%; height:25vh; width:5px; background:black">
          </div>

          <div style="position:absolute; top:72%; left:40%; margin-top:-3vh; margin-left:-3vh; font-size:3vh; z-index:9">
            <p id="left-button" style="height:6vh; width:6vh; background:#ffa590; display:table-cell; vertical-align:middle; margin-left:auto; margin-right:auto">E</p>
          </div>
          <div style="position:absolute; top:72%; left:60%; margin-top:-3vh; margin-left:-3vh; font-size:3vh; z-index:9">
            <p id="right-button" style="height:6vh; width:6vh; background:#a3a6a7; display:table-cell; vertical-align:middle; margin-left:auto; margin-right:auto">I</p>
          </div>`

          // add prompt
          if (trial.prompt !== null) {
              new_html += trial.prompt;
          };

          // draw
          display_element.innerHTML = new_html;

          let pressRight = 0;
          let nPresses = 0;
          let nPresses_last = nPresses;
          let nPresses_tot = 0;
          let myPos = trial.initPos;
          let theirPos = trial.initPos;
          let myCar = document.getElementById(trial.image);
          let theirCar = document.getElementById("opponent");
          let leftButton = document.getElementById("left-button");
          let rightButton = document.getElementById("right-button");
          let tic = 0;
          let time = 0;
          let rate = 0;
          let win;

          // function for moving own car
          const moveMe_func = function(event) {
            (nPresses_tot == 0) ? tic = Date.now() : time = Date.now() - tic;
            let key = event.key;
            if (key == trial.keys[0] && pressRight == 0) {
                myPos = myPos + trial.speed;
                myCar.style.left = myPos + "%";
                leftButton.style.background = "#a3a6a7";
                rightButton.style.background = "#ffa590";
                pressRight = 1;
                nPresses++;
                nPresses_tot++;
            } else if (key == trial.keys[1] && pressRight == 1) {
                myPos = myPos + trial.speed;
                myCar.style.left = myPos + "%";
                leftButton.style.background = "#ffa590";
                rightButton.style.background = "#a3a6a7";
                pressRight = 0;
                nPresses++;
                nPresses_tot++;
            }
            myCar = document.getElementById(trial.image);
            if (theirPos + trial.width > 100 - trial.initPos || myPos + trial.width > 100 - trial.initPos) {
              myPos >= theirPos ? win = 1 : win = 0;
              end_trial();
            }
            rate = (nPresses_tot / time) * 1000;
          };

          // wrapper for balloon function
          const moveMe_wrap = function(trial) {
             return moveMe_func
          };
          
          // listen for keypress
          document.addEventListener("keydown", moveMe_wrap(trial));

          // function for moving opponent's car
          const moveThem_func = function() {
            let pAccel = logit(rate, .5, 12.5, trial.intercept);
            let accel = (Math.random() > pAccel) ? 1 : 0;
            let perturb = 0;
            if (Math.random() > .8) {
              perturb = (accel - .5) * .6;
              console.log(rate, pAccel)
            };
            if (nPresses == 0) {
              theirPos = theirPos + (trial.speed * nPresses_last + perturb);
            } else {
              theirPos = theirPos + (trial.speed * nPresses + perturb);
              nPresses_last = nPresses;
            };
            theirCar.style.left = theirPos + "%";
            nPresses = 0;
          }

          const move_opp = setInterval(moveThem_func, 500);

          // store response
          var response = {
              rt: null,
              key: null,
          };
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
                  rt: response.rt,
                  playTime: time,
                  nPresses: nPresses_tot,
                  rate: rate,
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
          // start the response listener
          if (trial.choices != "NO_KEYS") {
              var keyboardListener = this.jsPsych.pluginAPI.getKeyboardResponse({
                  callback_function: after_response,
                  valid_responses: trial.choices,
                  rt_method: "performance",
                  persist: false,
                  allow_held_key: false,
              });
          }
          // hide stimulus if stimulus_duration is set
          if (trial.stimulus_duration !== null) {
              this.jsPsych.pluginAPI.setTimeout(() => {
                  display_element.querySelector("#jspsych-html-keyboard-response-stimulus").style.visibility = "hidden";
              }, trial.stimulus_duration);
          }
          // end trial if trial_duration is set
          if (trial.trial_duration !== null) {
              this.jsPsych.pluginAPI.setTimeout(end_trial, trial.trial_duration);
          }
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
