# 16 Waves

A personality quiz that gives you a Myers-Briggs type based on which **sounds** you like. Every sound is generated live in the browser with the Web Audio API, so the quiz doubles as a hands-on introduction to digital audio.

**[Try it live →](https://alicewang453.github.io/16waves/)**

## What it does

Most personality tests ask about your habits. 16 Waves asks you to listen instead. Over seven questions you compare colors of noise, sound effects, waveforms, filters, vibrato and radio-style modulation, and each answer nudges your scores along the four MBTI axes. At the end you get your type and a description.

While a sound plays, a live oscilloscope draws its waveform, so you can see what you're hearing.

## How the sounds are made

Nothing is a recording. Each sound is built from Web Audio nodes when you press play:

| Question | Technique |
| --- | --- |
| Noise colors | White noise written sample-by-sample into an `AudioBuffer`, then shaped into pink, brown or blue noise by weighting the high and low frequencies |
| Sound effects | Physical modeling. The babbling brook is two brown-noise sources through low-pass filters into a resonant high-pass filter whose cutoff drifts randomly. The ticking stopwatch is white-noise bursts through three band-pass filters with randomized decay envelopes |
| Waveforms | Sine, square, sawtooth and triangle oscillators, with gain lowered on the harsher waves |
| Number of waves | Additive synthesis: layering more oscillators as you move the slider |
| Filters | The same source through low-pass or high-pass `BiquadFilterNode`s |
| Vibrato | A low-frequency oscillator modulating the pitch, with depth set by the slider |
| Modulation | AM and FM synthesis using modulator oscillators and gain nodes |

The visualizer is an `AnalyserNode` drawn to a `<canvas>` on every animation frame.

## Tech stack

- React 18 and Vite
- Web Audio API and Canvas
- Sass
- GitHub Actions deploying to GitHub Pages

## Project structure

```
src/
  main.jsx                  app entry
  App.jsx
  constants.js              questions, answer choices, scoring weights and result descriptions
  components/Quiz/Quiz.jsx  quiz flow, sound generation and the visualizer
  styles/
```

## Run it locally

```bash
npm install
npm run dev
```

Then open the local URL Vite prints. `npm run build` creates the production site in `dist/`, and `npm run deploy` builds it and publishes it to GitHub Pages.

## Team

Built by Alice Wang and [@williamyzhang](https://github.com/williamyzhang) as a final project for a computational sound course at Columbia. We worked on every part together, from the quiz logic and scoring to the sound design and interface.

## Ideas for later

- Explain each sound in more depth, and order the questions so the concepts build on each other
- Add more advanced techniques, such as granular synthesis or a short live-coding question that feeds into the result
