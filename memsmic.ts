/**
 * Kitronik MEMS microphone blocks
 * MEMS Microphone SPU0410HR5H
 **/
namespace kitronik_microphone {

    //Global variables and setting default values
    export let sound_handler: Action
    export let initialised = false
    export let micListening = false
    export let microphonePin = AnalogPin.P0
    export let samplesArray = [0, 0, 0, 0, 0]
    export let period = 1000
    export let threshold = 0
    export let baseVoltageLevel = 580
    export let numberOfClaps = 0
	
	let noiseSample = 0
	let clapListening = false
	let recordedClaps = 0
	let	startClap = false
	let startClapTime = 0
	let finishClap = false
	let finishClapTime = 0
    
    let distance = 500

    //Function to initialise the LCD and SPI
    export function init() {
        microphonePin = AnalogPin.P0
        threshold = baseVoltageLevel + 60
        initialised = true
    }

	//Function to start listening for claps/spikes in the background
    export function startClapListening(): void {
        if (clapListening) return
        control.inBackground(() => {
            while (true) {
                poll()
                basic.pause(100)
            }
        })
        clapListening = true
    }

	//Function to start listening for average sound level of 5 samples in the background
    export function micStartListening() {
		if (micListening) return
        control.inBackground(() => {
            while (true) {
                samplesArray[noiseSample] = Math.abs(readSoundLevel())
                noiseSample += 1
                noiseSample %= 5
                basic.pause(100)
            }
        })
        micListening = true
    }

	//Function runs when a clap is detected
    function poll(): void {
		if (waitForSingleClap(threshold, 100))		//If only looking for a single clap, run the handler code
				if (numberOfClaps == 1){
					sound_handler()
				}
				else{								//record number of claps
					recordedClaps += 1
					if (startClap == false){		//if its the first clap, record the time the clap occoured
						startClapTime = input.runningTime()
						startClap = true
					}
					else if (recordedClaps == numberOfClaps){	//if its the last clap required, record the time the clap occoured
						finishClapTime = input.runningTime()
						recordedClaps = 0
						finishClap = true
						
					}
				}
		if ((startClap) && (finishClap)){			//if we have both start and finish claps, calculate the time between
			if ((finishClapTime - startClapTime) <= (period + (period/10))){	//giving a 10 percent additional time for small differences over
				sound_handler()						//if time difference between is within the allocated time slot, run handler code
			}
			startClap = false						//reset all the start and finish clap flags and variables
			startClapTime = 0
			finishClap = false
			finishClapTime = 0
		}
    }

	//waits for any increase in sound level over a dectection level in a certain time period
    function waitForSingleClap(detectionLevel: number, waitPeriod: number): boolean {
        let startTimeOfWaiting = input.runningTime()
        while (input.runningTime() < (startTimeOfWaiting + waitPeriod)) {
            if (readSoundLevel() > detectionLevel) {
                while (readSoundLevel() > detectionLevel) {
                    control.waitMicros(10)
                }
                return true
            }
            control.waitMicros(100)
        }
        return false
    }

} 
