import Quiz from "./components/Quiz/Quiz";
import { jsQuizz } from "./constants";

function WaveMark() {
  return (
    <svg className="wave-mark" viewBox="0 0 64 24" aria-hidden="true">
      <path d="M2 12 Q 9 -4 16 12 T 30 12 T 44 12 T 58 12" />
    </svg>
  );
}

function App() {
  return (
    <div className="page">
      <header className="masthead">
        <WaveMark />
        <span className="wordmark">16 Waves</span>
      </header>

      <Quiz questions={jsQuizz.questions} />

      <footer className="credits">
        Made by Alice Wang and{" "}
        <a href="https://github.com/williamyzhang" target="_blank" rel="noreferrer">@williamyzhang</a>
        {" "}·{" "}
        <a href="https://github.com/alicewang453/16waves" target="_blank" rel="noreferrer">
          Source on GitHub
        </a>
      </footer>
    </div>
  );
}

export default App;
