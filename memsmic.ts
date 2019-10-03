/**
 * Kitronik MEMS microphone blocks
 * MEMS Microphone SPU0410HR5H
 **/
//% weight=100 color=#00A654 icon="\uf130" block="Microphone"
namespace Kitronik_Microphone {


    //Enum commented out, code for future version
    //export enum SelectAnalogPin {
    //    //% block="P0"
    //    P0,
    //	//% block="P1"
    //    P1,
    //	//% block="P2"
    //    P2,
    //	//% block="P3"
    //    P3,
    //	//% block="P4"
    //    P4,
    //	//% block="P10"
    //    P10
    //}

    //Global variables and setting default values
    let soundSpike_handler: Action
    export let sound_handler: Action
    export let initialised = false
    export let micListening = false
    export let microphonePin = AnalogPin.P0
    let noiseSample = 0
    export let samplesArray = [0, 0, 0, 0, 0]
    let maxSamplesArray = [0, 0, 0, 0, 0]
    let clapListening = false
    let clap_time = input.runningTime()
    export let threshold = 0
    export let baseVoltageLevel = 580
    export let numberOfClaps = 1
    let claps = 1
    export let period = 1000
    let distance = 500

    //Function to initialise the LCD and SPI
    export function init() {
        microphonePin = AnalogPin.P0
        threshold = baseVoltageLevel + 60
        initialised = true
    }

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

    export function micStartListening() {
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

    function poll(): void {
        if (waitForClaps(threshold, distance, period)) {
            sound_handler()
            clap_time = input.runningTime()
        }
    }

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

    function waitForClaps(threshold: number, distance: number, timerperiod: number): boolean {
        let startTimeOfWaiting = input.runningTime()
        let recordedClaps = 0
        while (input.runningTime() < (startTimeOfWaiting + timerperiod)) {
            if (waitForSingleClap(threshold, 50)) {
                control.waitMicros(10000)
                if (waitForSingleClap(threshold, distance)) {
                    recordedClaps += 1
                }
                if (recordedClaps == numberOfClaps) {
                    return true
                }
            }
        }
        return false
    }

    //function commented out, code for future version
    ///**
    //* Set microphone pin.
    //* @param selection of which pin the microphone is connected to eg: "P0"
    //*/
    ////% blockId=kitronik_microphone_pin_selection
    ////% block="set microphone to %selectedPin"
    ////% weight=95 blockGap=8
    //export function pinSelection(selectedPin: SelectAnalogPin) {
    //    if (initialised == false) {
    //        init()
    //    }
    //	if (selectedPin = SelectAnalogPin.P0){
    //		microphonePin = AnalogPin.P0
    //	}
    //	else if (selectedPin = SelectAnalogPin.P1){
    //		microphonePin = AnalogPin.P1
    //	}
    //	else if (selectedPin = SelectAnalogPin.P2){
    //		microphonePin = AnalogPin.P2
    //	}
    //	else if (selectedPin = SelectAnalogPin.P3){
    //		microphonePin = AnalogPin.P3
    //	}
    //	else if (selectedPin = SelectAnalogPin.P4){
    //		microphonePin = AnalogPin.P4
    //	}
    //	else if (selectedPin = SelectAnalogPin.P10){
    //		microphonePin = AnalogPin.P10
    //	}
    //}

    /*FUNCTIONS COMMENTED OUT AS THEY DO NOT NEED TO APPEAR IN THIS EXTENSION, THEY WILL BE IN THE MAIN EXTENSION*/
    ///**
    //* Read Sound Level blocks returns back a number of the current sound level at that point
    //*/
    ////% blockId=kitronik_microphone_read_sound_level
    ////% block="read sound level"
    ////% weight=100 blockGap=8
    //export function readSoundLevel() {
    //    if (initialised == false) {
    //        init()
    //    }
    //    let read = pins.analogReadPin(microphonePin)
    //    return read
    //}


	///**
    //* Read Sound Level blocks returns back a number of the current sound level averaged over 5 samples
    //*/
    ////% blockId=kitronik_microphone_read_average_sound_level
    ////% block="read average sound level"
    ////% weight=100 blockGap=8
    //export function readAverageSoundLevel() {
    //    let x = 0
    //    let soundlevel = 0
    //    let sample = 0

    //    if (initialised == false) {
    //        init()
    //    }

    //    if (micListening == false) {
    //        micStartListening()
    //    }

    //    for (x = 0; x < 5; x++) {
    //        sample = samplesArray[x]
    //        if (sample > soundlevel) {
    //            soundlevel = sample
    //        }
    //    }

    //    return soundlevel
    //}

    ///**
	//* Performs an action when a spike in sound
	//* @param claps is the number of claps to listen out for before running the function e.g. "1"
	//* @param timerperiod is period of time in which to listen for the claps or spikes e.g. "1000"
	//* @param soundSpike_handler is function that is run once detection in sound 
    //*/
    ////% blockId=kitronik_microphone_wait_for_clap
    ////% block="wait for %claps claps within %timerperiod|ms"
    ////% claps.min=1 claps.max=10
    ////% timerperiod.min=500 timerperiod.max=2500
    ////% weight=95 blockGap=8
    //export function waitForClap(claps: number, timerperiod: number, soundSpike_handler: Action): void {
    //    if (initialised == false) {
    //        init()
    //    }
    //    numberOfClaps = claps
    //    period = timerperiod
    //    sound_handler = soundSpike_handler
    //    startClapListening()
    //}

	///**
    // * Set how sensitive the microphone is when detecting claps
    // * @param value - sensitivity (0-100)
    // */
    ////% blockId=kitronik_microphone_set_mic_sensitivity
    ////% block="Set mic sensitivity to %value"
    ////% value.min=0 value.max=100 value.defl=80
    //export function setClapSensitivity(value: number): void {
    //    value = Math.clamp(0, 100, value)
    //    threshold = baseVoltageLevel + (105 - value)
    //}

} 