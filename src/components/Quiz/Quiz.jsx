import { useState, useEffect, useRef } from "react";
import { personalityNames, resultInitialState } from "../../constants";
import "./Quiz.scss";

const Quiz = ({ questions }) => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answerIdx, setAnswerIdx] = useState(null);
    const [answerChoice, setAnswerChoice] = useState(null);
    const [answerPersonality, setAnswerPersonality] = useState(null);
    const [result, setResult] = useState(resultInitialState);
    const [showResult, setShowResult] = useState(false);
    const [questionID, setQuestionID] = useState(0);
    const [sliderValue, setSliderValue] = useState(
        questions[currentQuestion]?.defaultValue || 5
      );

    const [playButtonClicked, setPlayButtonClicked] = useState(null);


    const [audioContext, setAudioContext] = useState(null);
    // const [whiteNoiseBuffer, setWhiteNoiseBuffer] = useState(null);
    const [source_arr, setSource] = useState(null);
    const [playing, setPlaying] = useState(false);
    const [currSound, setCurrSound] = useState(null);
    const [intervalID, setIntervalID] = useState(null)

    const [globalGain, setGlobalGain] = useState(null);

    const canvasRef = useRef(null);
    const [analyser, setAnalyser] = useState(null);
    const [animationId, setAnimationId] = useState(null);

    // Initialize AudioContext & GlobalGain
    useEffect(() => {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        setAudioContext(audioCtx);
        const gg = audioCtx.createGain();
        gg.gain.setValueAtTime(0.8, audioCtx.currentTime);
        gg.connect(audioCtx.destination);
        setGlobalGain(gg);
        // console.log('creating audio context & global gain')
        const globalAnalyser = audioCtx.createAnalyser();
        gg.connect(globalAnalyser);
        // globalAnalyser.connect(audioCtx.destination)
        setAnalyser(globalAnalyser);
        // console.log('created analyser');
        // draw();
        return () => {
            if (audioContext) {
                audioContext.close();
            }
        };
    }, []);

    useEffect(() => {
        return () => {
            cancelAnimationFrame(animationId);
        };
    }, [animationId]);

    useEffect(() => {
        // console.log("onPlayButtonClick function", playButtonClicked);
        if (playButtonClicked) {
            setAnswerIdx()
            if (questionID===4) {
                handlePlay("add", "osc");
            } else { //lfo 
                handlePlay("lfo", "osc");
            }
          
        }
      }, [playButtonClicked]);

    // vizualizer
    const draw = () => {
        if (!analyser) return;

        analyser.fftSize = 2048;
        var bufferLength = analyser.frequencyBinCount;
        var dataArray = new Uint8Array(bufferLength);
        analyser.getByteTimeDomainData(dataArray);
        // console.log(dataArray);
    
        var canvas = canvasRef.current;
        var canvasCtx = canvas.getContext("2d");

        var WIDTH = canvas.width;
        var HEIGHT = canvas.height;
        canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

        analyser.getByteTimeDomainData(dataArray);
        // console.log(dataArray);

        canvasCtx.fillStyle = "white";
        canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

        canvasCtx.lineWidth = 2;
        // canvasCtx.strokeStyle = "rgb(31,117,254)";
        canvasCtx.strokeStyle = "#d08642" // css accent color

        canvasCtx.beginPath();

        var sliceWidth = canvas.width * 1.0 / bufferLength;
        var x = 0;
        // console.log('buffer len: ', bufferLength);
        for (var i = 0; i < bufferLength; i++) {
            var v = dataArray[i] / 128.0;
            // console.log(v);
            var y = v * canvas.height / 2;
            if (i === 0) {
                canvasCtx.moveTo(x, y);
            } else {
                canvasCtx.lineTo(x, y);
            }
            x += sliceWidth;
        }

        canvasCtx.lineTo(canvas.width, canvas.height / 2);
        canvasCtx.stroke();

        const newAnimationId = requestAnimationFrame(draw);
        setAnimationId(newAnimationId);
    };

    // Functions for generating different types of noise
    const generateNoise = (noiseType, play) => {
        const bufferSize = 10 * audioContext.sampleRate;
        // console.log('buffer size: ', bufferSize);
        const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
        const output = noiseBuffer.getChannelData(0);

        // Fill buffer with noise data based on noiseType
        switch (noiseType) {
            case 'White Noise':
                for (let i = 0; i < bufferSize; i++) {
                    output[i] = Math.random() * 2 - 1;
                }
                break;
            case 'Pink Noise':
                // Pink noise algorithm
                let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
                for (let i = 0; i < bufferSize; i++) {
                    let white = Math.random() * 2 - 1;
                    b0 = 0.99886 * b0 + white * 0.0555179;
                    b1 = 0.99332 * b1 + white * 0.0750759;
                    b2 = 0.96900 * b2 + white * 0.1538520;
                    b3 = 0.86650 * b3 + white * 0.3104856;
                    b4 = 0.55000 * b4 + white * 0.5329522;
                    b5 = -0.7616 * b5 - white * 0.0168980;
                    output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
                    output[i] *= 0.11; // Compensate for gain
                    b6 = white * 0.115926;
                }
                break;
            case 'Brown Noise':
                // Brown noise algorithm
                let lastOut = 0.0;
                for (let i = 0; i < bufferSize; i++) {
                    let white = Math.random() * 2 - 1;
                    output[i] = (lastOut + (0.02 * white)) / 1.02;
                    lastOut = output[i];
                    output[i] *= 3.5; // Compensate for gain
                }
                break;
            case 'Blue Noise':
                // Simplified blue noise algorithm
                for (let i = 0; i < bufferSize; i++) {
                    // Generate white noise
                    let whiteNoise = Math.random() * 2 - 1;
    
                    // Apply a simple high-frequency emphasis
                    let scaleFactor = i / bufferSize;
                    output[i] = whiteNoise * scaleFactor;
                }
                break;
            default:
                break;
        }
        if (play) {
            playNoise(noiseBuffer, noiseType);
        }
        else {
            return noiseBuffer
        }
    };

    // Generic function to play a given noise type
    const playNoise = (noiseBuffer, noiseType, filter=null) => {
        if (source_arr) {
            source_arr.forEach(source => {
                source.stop();
              });
            setSource(null);
        }
        const noiseGain = audioContext.createGain();
        noiseGain.gain.setValueAtTime(0.3, audioContext.currentTime);
        noiseGain.connect(globalGain);

        // console.log(noiseBuffer);
        let noiseSource = audioContext.createBufferSource();
        noiseSource.buffer = noiseBuffer;
        noiseSource.loop = false;
        
        if (filter) {
            noiseSource.connect(filter)
            filter.connect(noiseGain)
        } else {
            noiseSource.connect(noiseGain);
        }

        noiseGain.connect(analyser);

        noiseSource.start();
        setSource([noiseSource]);
        setPlaying(true);
        setCurrSound(noiseType);

        // draw();
        requestAnimationFrame(draw);
    };

    function createEnvelope(decayTime) {
        decayTime = decayTime/1000
        const now = audioContext.currentTime;
        const envelope = audioContext.createGain();
        envelope.gain.setValueAtTime(0, now);
        envelope.gain.linearRampToValueAtTime(1, now + 0.001); //attack
        envelope.gain.setTargetAtTime(0.01, now + 0.001, decayTime); //decay
    
        return envelope;
    }

    function triggerTick() {
        var whiteNoise = audioContext.createBufferSource();
        whiteNoise.buffer = generateNoise("White Noise", false);
    
        const filterFreqs = [Math.random() * 800 + 4000, 7000- Math.random() * 600, Math.random() * 800 + 6000];
        const decays = [Math.random() * 8 + 3, Math.random() * 25 + 15, 28 - Math.random() * 7]
    
        for (var i = 0; i<filterFreqs.length; i++) {
            const filter = audioContext.createBiquadFilter();
            filter.type = 'bandpass'
            filter.frequency.value = filterFreqs[i];
            filter.Q.value = 30; 
    
            const envelope = createEnvelope(decays[i]);
            whiteNoise.connect(filter).connect(envelope).connect(audioContext.destination);
            filter.connect(analyser)
        }
    

        whiteNoise.start();
        requestAnimationFrame(draw);
        whiteNoise.stop(audioContext.currentTime + 0.04);

    }

    const playSound = (soundType) => {
        switch (soundType) {
            case 'Babbling Brook':
                const noiseBuffer1 = generateNoise("Brown Noise", false)
                const noiseBuffer2 = generateNoise("Brown Noise", false)
                
                var lpf1 = audioContext.createBiquadFilter();
                lpf1.type = "lowpass";
                lpf1.frequency.value = 400;

                var lpf2 = audioContext.createBiquadFilter();
                lpf2.type = "lowpass";
                lpf2.frequency.value = 14;

                var rhpf = audioContext.createBiquadFilter();
                rhpf.type = "highpass";
                rhpf.Q.value = 33.33;
                rhpf.frequency.value = 500;

                var gain1 = audioContext.createGain();
                gain1.gain.value = 1500;

                // if (source_arr) {
                //     source_arr.forEach(source => {
                //         source.stop();
                //       });
                //     setSource(null);
                // }

                const noiseGain = audioContext.createGain();
                noiseGain.gain.setValueAtTime(0.3, audioContext.currentTime);
                noiseGain.connect(globalGain);
        
                // console.log(noiseBuffer);
                let noiseSource1 = audioContext.createBufferSource();
                noiseSource1.buffer = noiseBuffer1;
                noiseSource1.loop = false;
                noiseSource1.connect(noiseGain);

                let noiseSource2 = audioContext.createBufferSource();
                noiseSource2.buffer = noiseBuffer2;
                noiseSource2.loop = false;
                noiseSource2.connect(noiseGain);
        
                noiseGain.connect(analyser);
        
                noiseSource1.start();
                noiseSource2.start()

                noiseSource1.connect(lpf2).connect(gain1).connect(rhpf.frequency);
                noiseSource2.connect(lpf1).connect(rhpf).connect(globalGain);

                setSource([noiseSource1,noiseSource2]);
                setPlaying(true);
                setCurrSound(soundType);
        
                // draw();
                requestAnimationFrame(draw);
                break;
            case 'Ticking Clock':
                const intervalID = setInterval(triggerTick, 250);
                setIntervalID(intervalID);
                setPlaying(true);
                setCurrSound(soundType);
                requestAnimationFrame(draw);
                break; 
            case 'Low Pass Filter':
                var noiseBuffer = generateNoise("White Noise", false);
                var filter = audioContext.createBiquadFilter();
                filter.type = 'lowpass'
                filter.frequency.value = 1000;
                playNoise(noiseBuffer, soundType, filter)
                break;
            case 'High Pass Filter':
                var noiseBuffer = generateNoise("White Noise", false);
                var filter = audioContext.createBiquadFilter();
                filter.type = 'highpass'
                filter.frequency.value = 1000;
                playNoise(noiseBuffer, soundType, filter)
                break;
            default: 
                break;
        }
    };

    const generateOscs = (oscType, synthType=null) => {
        const gainNode = audioContext.createGain();
        var gain = 0.8;
        // gainNode.gain.setValueAtTime(0.8, audioContext.currentTime);
        
        const freq = 261.625565300598634;

        var npartials; 
        // console.log("playButton CLicked", playButtonClicked)
        if (playButtonClicked && synthType==="add") {
            npartials = sliderValue;
        }
        else {
            npartials = 1;
        }
        // console.log("npartials", npartials)
        
        // create oscs and store them in a list
        var oscs = []
        for (var i=0; i<npartials; i++) {
            oscs[i] = audioContext.createOscillator();
        }

        var waveform = oscType.toLowerCase();

        // calc gain
        gain /= npartials;
        if (waveform === "square" || waveform === "sawtooth") {
            gain /= 3 ; //saws & squares are loud 
          }
        
        var modulated;
        var depth;
        var modulatedFreq;
        var fmModulatorFreq;
        var fmModulationIndex;
        var AMModulatorFrequency = 180;
        var FMModulatorFrequency = 180;
        var FMModulatorIndex = 100;
        if (synthType === "am") {
            modulatedFreq = audioContext.createOscillator();
            modulatedFreq.frequency.value = AMModulatorFrequency;
            modulated = audioContext.createGain();
            depth = audioContext.createGain();
            depth.gain.value = 0; //start at 0 so no onset click
            modulated.gain.value = 0;
            //console.log(depth)
            modulatedFreq.connect(depth).connect(modulated.gain);
            // modulatedFreq.connect(gainNode.gain).connect(globalGain).connect(depth);
            // gainNodes[1] = modulated;
            // gainNodes[2] = depth;
    
            // console.log("am done");
        } else if (synthType === "fm") {
            fmModulatorFreq = audioContext.createOscillator();
            fmModulationIndex = audioContext.createGain();
            fmModulationIndex.gain.value = FMModulatorIndex;
            fmModulatorFreq.frequency.value = FMModulatorFrequency;
    
            fmModulatorFreq.connect(fmModulationIndex);
            // gainNodes.push(fmModulationIndex); 
            // console.log('fm done');
        }
        // console.log('oscs: ', oscs.length);
        // assign frequencies and start oscs
        for (var i = 0; i < oscs.length; i++) {
            // frequency
            if (i === 0) {
                oscs[i].frequency.setValueAtTime(
                    freq,
                    audioContext.currentTime
            
                )
            } else if (i % 2 === 0) {
                oscs[i].frequency.setValueAtTime(
                    (i + 1) * freq + Math.random() * 5,
                    audioContext.currentTime
                )
            } else {
                oscs[i].frequency.setValueAtTime(
                    (i + 1) * freq - Math.random() * 5,
                    audioContext.currentTime
                )
            }   
            gainNode.gain.setValueAtTime(gain, audioContext.currentTime); 
            // waveform
            oscs[i].type = waveform;
            if (synthType === 'am') {
                oscs[i].connect(modulated).connect(gainNode).connect(globalGain);
                // console.log('am connected')
            } else if (synthType === "fm") {
                fmModulationIndex.connect(oscs[i].frequency);
                oscs[i].connect(gainNode).connect(globalGain);
                // console.log('fm connected')
            } else {

                oscs[i].connect(gainNode).connect(globalGain);
            }
            oscs[i].start();
        }
        if (synthType === "am") {
            modulated.connect(audioContext.destination);
            modulatedFreq.start();
            oscs.push(modulatedFreq);
            modulated.gain.setTargetAtTime(0.2, audioContext.currentTime, 0.01);
            depth.gain.setTargetAtTime(0.2, audioContext.currentTime, 0.01);
            // modulators.push(modulatedFreq);
        } else if (synthType === 'fm') {
            fmModulatorFreq.start();
            oscs.push(fmModulatorFreq)
            // modulators.push(fmModulatorFreq);
        }

        if (synthType === "lfo" && oscs.length === 1) {
            const lfo = audioContext.createOscillator();
            lfo.frequency.value = sliderValue
            const lfoGain = audioContext.createGain();
            lfoGain.gain.value = 7
            lfo.connect(lfoGain).connect(oscs[0].frequency)
            lfo.start()
            oscs.push(lfo)
        }

        return oscs;
    }
    
    const handlePlay = (noiseType, questionType) => { // should refactor noiseType as "choice"
        if (questionType === 'sound') {
            if (playing) {
                if (currSound === 'Ticking Clock') {
                    clearInterval(intervalID)
                    // setPlaying(false);
                    // setCurrSound(null);
                    setSource(null);
                } else { // babbling brook
                    source_arr.forEach(source => {
                        source.stop();
                        });
                    setSource(null);
                    // setPlaying(false);
                    // setCurrSound(null);
                }
                if (currSound === noiseType) {
                    setPlaying(false);
                    setCurrSound(null);
                } else {
                    playSound(noiseType, true);
                }
            } else {
                playSound(noiseType, true);
            }
        } else if (questionType === 'noise') {
            if (playing) {
                source_arr.forEach(source => {
                    source.stop();
                    });
                setSource(null);
                if (currSound === noiseType) {
                    setPlaying(false);
                    setCurrSound(null);
                } else {
                    generateNoise(noiseType, true);
                }
            } else {
                generateNoise(noiseType, true);
            }
        } else if (questionType === 'osc') {
            if (playing) {
                source_arr.forEach((osc) => {
                    osc.stop();
                });
                if (currSound === noiseType) {
                    setPlaying(false);
                    setCurrSound(null);
                } else {
                    var oscs;
                    if (noiseType === "AM (Amplitude Modulation)") { // am & fm are multiple choice and not sliders
                        oscs = generateOscs("sine", "am");
                    } else if (noiseType === "FM (Frequency Modulation)") {
                        oscs = generateOscs("sine", "fm");
                    } else {
                        oscs = generateOscs(noiseType);
                    }
                    setSource(oscs);
                    setCurrSound(noiseType);
                }
            } else {
                var oscs;
                if (noiseType==="add") {
                    oscs = generateOscs("sine", "add")
                } else if (noiseType === "lfo") {
                    oscs = generateOscs("sine", "lfo")
                } else if (noiseType === "AM (Amplitude Modulation)") {
                    oscs = generateOscs("sine", "am")
                } else if (noiseType === "FM (Frequency Modulation)") {
                    oscs = generateOscs("sine", "fm")
                } else {
                    oscs = generateOscs(noiseType)
                }
                setSource(oscs);
                setPlaying(true);
                setCurrSound(noiseType);
            }
        } else {
            console.log('do nothing');
        }
    };

    const onPlayButtonClick = (questionID) => {
        // Add logic here to play the sound associated with the slider value
        // For example, you can use the existing playSound function
        // playSound("YourSoundTypeHere");
        setPlayButtonClicked(true)
        setQuestionID(questionID)
      };

    const { question, choices, answerVals, type} = questions[currentQuestion]; 
    
    const onAnswerClick = (answer, index, answerVals) => {
        // console.log(answer);
        // console.log(index);
        setAnswerIdx(index);
        setAnswerChoice(answer);
        // console.log(answerChoice);
        setAnswerPersonality(answerVals[answer]);
        // console.log('answer personality: ', answerPersonality);
        // console.log('curr result: ', result);
        // if (answer === correctAnswer) {
        //     setAnswer(true);
        // } else {
        //     setAnswer(false);
        // }
    }

    const onSliderChange = (event) => {
        // if (playing){
        //     source_arr.forEach((osc) => {
        //         osc.stop();
        //     });
        //     setPlaying(false);
        //     setCurrSound(null);
        // } 
        if (playing) {
            handlePlay(currSound, "osc")
        }
        const value = parseFloat(event.target.value, 10);
        setSliderValue(value);
        // console.log("slider value",value)
        const currentAnswerVals = questions[currentQuestion].answerVals;
        onAnswerClick(value, value, currentAnswerVals);
        setPlaying(false);
        setPlayButtonClicked(false);
    };


    const onClickNext = () => {
        if (playing) {
            if (type === "slider") {
                handlePlay(currSound, "osc");
            } else {
                handlePlay(currSound, type);
            }
            
        } 
        setAnswerIdx(null);
        console.log('Selected: ', answerChoice)
        // console.log('prev result: ', result);

        var newResult = {
            IE: result.IE + answerPersonality.IE,
            SN: result.SN + answerPersonality.SN,
            TF: result.TF + answerPersonality.TF,
            JP: result.JP + answerPersonality.JP,
            AT: result.AT + answerPersonality.AT,
          };
          setResult(newResult);

        // if (type === "slider") {
        //     var newResult = {
        //         IE: result.IE + answerPersonality.IE,
        //         SN: result.SN + answerPersonality.SN,
        //         TF: result.TF + answerPersonality.TF,
        //         JP: result.JP + answerPersonality.JP,
        //         AT: result.AT + answerPersonality.AT, 
        //     };
        //     setResult(newResult);
        //     console.log('new result: ', newResult);
        // } else {
        //     // Handle other types of answers
        //     var newResult = {
        //       IE: result.IE + answerPersonality.IE,
        //       SN: result.SN + answerPersonality.SN,
        //       TF: result.TF + answerPersonality.TF,
        //       JP: result.JP + answerPersonality.JP,
        //       AT: result.AT + answerPersonality.AT,
        //     };
        //     setResult(newResult);
        // }

        
        //     prev.IE += answerPersonality.IE;
        //     prev.SN += answerPersonality.SN;
        //     prev.TF += answerPersonality.TF;
        //     prev.JP += answerPersonality.JP;
        //     prev.AT += answerPersonality.AT;
        // }
        // );

        if (currentQuestion !== questions.length - 1) {
            setCurrentQuestion((prev) => prev + 1);
            setSliderValue(questions[currentQuestion + 1]?.defaultValue || 5);
        } else {
            setCurrentQuestion(0);
            setShowResult(true);
        }
        setPlayButtonClicked(false);
    }

    const onTryAgain = () => {
        setResult(resultInitialState);
        setShowResult(false);
    };

    // const handleInputChange = () => {
    //     setInputAnswer
    // }

    const getAnswerUI = () => {
        if (type === "noise" || type === "osc" || type == "sound") {
            return (
                <ul>
                    {
                        choices.map((choice, index) => (
                            <li
                                onClick={function(event){
                                    onAnswerClick(choice, index, answerVals);
                                    handlePlay(choice, type);
                                    }
                                }
                                key={choice}
                                className={answerIdx === index ? 'selected-answer' : null}
                            >
                                {choice}
                            </li>
                        ))
                    }
                </ul>)
        } 
        if (type === "slider") {
            return (
              <div className="slider-container">
                <input
                  type="range"
                  min={questions[currentQuestion]?.sliderRange.min}
                  max={questions[currentQuestion]?.sliderRange.max}
                  step={1}
                  value={sliderValue}
                  onChange={onSliderChange}
                />
                <span>{sliderValue}</span>
                <button onClick={() => onPlayButtonClick(questions[currentQuestion].id)} disabled={playButtonClicked}>
                    Play
                </button>
              </div>
            );
          }

        return ( // default
        <ul>
            {
                choices.map((choice, index) => (
                    <li
                        onClick={function(event){
                            onAnswerClick(choice, index, answerVals);
                            // togglePlay();
                            }
                        }
                        key={choice}
                        className={answerIdx === index ? 'selected-answer' : null}
                    >
                        {choice}
                    </li>
                ))
            }
        </ul>)
    }

    const getResult = () => {
        const ie = result.IE > 0 ? "E" : "I";
        const sn = result.SN > 0 ? "N" : "S";
        const tf = result.TF > 0 ? "F" : "T";
        const jp = result.JP > 0 ? "P" : "J";
        const at = result.AT > 0 ? "T" : "A";

        const ptype4 = ie.concat(sn, tf, jp); 
        const ptype = ie.concat(sn, tf, jp, '-', at);
        const pytpeMessage = "Your personality type is ";

        const hyperlink = "https://www.16personalities.com/".concat(ptype4.toLowerCase(), "-personality");

        // const percentages = 
        
        return ( <>

            <span className="ptype-message">{pytpeMessage}</span>
            <span className='ptype'>{ptype}</span>
            <br></br>
            <a href={hyperlink} target="_blank" class="pname">{personalityNames[ptype4]}</a>
            <br></br>
        </>
        )
    }

    return (
        <div className="quiz-container">
            {!showResult ? (<>
            <span className="active-question-num">{currentQuestion + 1}</span>
            <span className="total-question">/{questions.length}</span>
            <h2>{question}</h2>
            {getAnswerUI()}
            <div className="footer">
                <button onClick={onClickNext} disabled={answerIdx === null}>
                    {currentQuestion === questions.length - 1 ? "Finish" : "Next"}
                </button>
            </div>
            <div class="visualizer">
                <canvas ref={canvasRef} width="300" height="170">
                wave form visualizer
                </canvas>
            </div>
        </>) : <div className="result">
            {getResult()}
            {/* <h3>Result</h3>
            <p>
                Introversion/Extraversion: <span>{result.IE}</span>
            </p>
            <p>
                Observant/Intuitive: <span>{result.SN}</span>
            </p>
            <p>
                Thinking/Feeling: <span>{result.TF}</span>
            </p>
            <p>
                Judging/Prospecting: <span>{result.JP}</span>
            </p>
            <p>
                Assertive/Turbulent: <span>{result.AT}</span>
            </p> */}
            <button onClick={onTryAgain}>Play again</button>  {/* change to share results */}
            </div>}
        
        </div>
    );
};

export default Quiz;