export const jsQuizz = {
    questions: [
        {
            id: 1, 
            question:
              "Which noise do you prefer? (Click each to hear)",
            choices: [
              "White Noise",
              "Pink Noise",
              "Brown Noise",
              "Blue Noise",
            ],
            type: "noise",
            answerVals: {
              "White Noise": {IE: 0, SN: 0, TF: 0, JP: 0, AT: 5},
              "Pink Noise": {IE: 0, SN: 0, TF: 0, JP: 0, AT: 2},
              "Brown Noise": {IE: 0, SN: 0, TF: 0, JP: 0, AT: -5},
              "Blue Noise": {IE: 0, SN: 0, TF: 0, JP: 0, AT: -2},
            },
          },
        {
            id: 2,
            question:
              "What sound effect do you like best?",
            choices: [
              "Babbling Brook",
              "Ticking Clock",
            ],
            type: "sound",
            answerVals: {
              "Babbling Brook": {IE: 0, SN: 0, TF: 5, JP: 3, AT: 0},
              "Ticking Clock": {IE: 0, SN: 0, TF: -5, JP: -3, AT: 0},
            },
          },
        {
            id: 3,
            question:
              "Choose your favorite waveform!",
            choices: [
              "Sine",
              "Sawtooth",
              "Square",
              "Triangle",
            ],
            type: "osc",
            answerVals: {
              "Sine": {IE: 0, SN: -3.5, TF: 0, JP: 0, AT: -3},
              "Sawtooth": {IE: 0, SN: 1.5, TF: 0, JP: 0, AT: 1},
              "Square": {IE: 0, SN: 3.5, TF: 0, JP: 0, AT: 3},
              "Triangle": {IE: 0, SN: -1.5, TF: 0, JP: 0, AT: -1},
            },
          },
          { // rephrase q
            id: 4,
            question:
              "Slide for the number of waves you like most!",
            type: "slider",
            sliderRange: { min: 1, max: 10},
            defaultValue: 5, 
            answerVals: { // change values later 
              1: { IE: -5, SN: 0, TF: 0, JP: 0, AT: 0 },  // For slider value 1
              2: { IE: -4, SN: 0, TF: 0, JP: 0, AT: 0 },
              3: { IE: -3, SN: 0, TF: 0, JP: 0, AT: 0 },
              4: { IE: -2, SN: 0, TF: 0, JP: 0, AT: 0 },
              5: { IE: -1, SN: 0, TF: 0, JP: 0, AT: 0 },  // For slider value 0
              6: { IE: 1, SN: 0, TF: 0, JP: 0, AT: 0 },  // For slider value 1
              7: { IE: 2, SN: 0, TF: 0, JP: 0, AT: 0 },
              8: { IE: 3, SN: 0, TF: 0, JP: 0, AT: 0 },
              9: { IE: 4, SN: 0, TF: 0, JP: 0, AT: 0 },
              10: { IE: 5, SN: 0, TF: 0, JP: 0, AT: 0 }
            }
          }, 
          { // insert normal 
            id: 5,
            question:
              "Choose what kind of filter effect you like best!",
            choices: [
              "Low Pass Filter",
              "High Pass Filter",
            ],
            type: "sound",
            answerVals: {
              "Low Pass Filter": {IE: -2.5, SN: 0, TF: 0, JP: 0, AT: 0},
              "High Pass Filter": {IE: 2.5, SN: 0, TF: 0, JP: 0, AT: 0},
            },
          },
          { // i think we just choose a frequency and let them change the gain 
            id: 6,
            question:
              "How much do you like vibrato? Slide to find out!",
            sliderRange: { min: 0, max: 9},
            type: "slider",
            defaultValue: 5, 
            answerVals: { // change values later 
              0: { IE: 0, SN: -5, TF: 0, JP: 0, AT: 0 },
              1: { IE: 0, SN: -4, TF: 0, JP: 0, AT: 0 },  // For slider value 1
              2: { IE: 0, SN: -3, TF: 0, JP: 0, AT: 0 },
              3: { IE: 0, SN: -2, TF: 0, JP: 0, AT: 0 },
              4: { IE: 0, SN: -1, TF: 0, JP: 0, AT: 0 },
              5: { IE: 0, SN: 1, TF: 0, JP: 0, AT: 0 },  // For slider value 0
              6: { IE: 0, SN: 2, TF: 0, JP: 0, AT: 0 },  // For slider value 1
              7: { IE: 0, SN: 3, TF: 0, JP: 0, AT: 0 },
              8: { IE: 0, SN: 4, TF: 0, JP: 0, AT: 0 },
              9: { IE: 0, SN: 5, TF: 0, JP: 0, AT: 0 },
            }
          },
          { 
            id: 7,
            question:
              "Hey do you still listen to the radio? Choose what kind of modulation sounds best to you!",
            choices: [
              "AM (Amplitude Modulation)",
              "FM (Frequency Modulation)",
            ],
            type: "osc",
            answerVals: {
              "AM (Amplitude Modulation)": {IE: 0, SN: 0, TF: -3, JP: 5, AT: 0},
              "FM (Frequency Modulation)": {IE: 0, SN: 0, TF: 3, JP: -5, AT: 0},
            },
          }
    ],
  };

  export const resultInitialState = {
    //MBTI: negative = trait on left, positive = trait on right
    IE: 0, //introversion - extraversion
    SN: 0, //observant - intuitive
    TF: 0, //thinking - feeling
    JP: 0, //judging - prospecting
    AT: 0, //assertive - turbulent
  }

  export const personalityNames = {
    'INTJ': 'Architect',
    'INTP': 'Logician',
    'ENTJ': 'Commander',
    'ENTP': 'Debater',
    'INFJ': 'Advocate',
    'INFP': 'Mediator',
    'ENFJ': 'Protagonist',
    'ENFP': 'Campaigner',
    'ISTJ': 'Logistician',
    'ISFJ': 'Defender',
    'ESTJ': 'Executive',
    'ESFJ': 'Consul',
    'ISTP': 'Virtuoso',
    'ISFP': 'Adventurer',
    'ESTP': 'Entrepreneur',
    'ESFP': 'Entertainer'
  }