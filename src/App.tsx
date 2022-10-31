import { useState } from "react";
import "./App.scss";

function App() {
  const [breakLength, setBreakLength] = useState<number>(5);
  const [sessionLength, setSessionLength] = useState<number>(25);
  const [timer, setTimer] = useState<string>("25:00");

  return (
    <div className="App">
      <h1 className="main-heading">Pomodoro Clock</h1>
      <section className="break-wrapper">
        <div id="break-label">Break Length</div>
        <button id="break-decrement">-</button>
        <div id="break-length">{breakLength}</div>
        <button id="break-increment">+</button>
      </section>
      <section className="session-wrapper">
        <div id="session-label">Session Length</div>
        <button id="session-decrement">-</button>
        <div id="session-length">{sessionLength}</div>
        <button id="session-increment">+</button>
      </section>
      <section className="timer-wrapper">
        <div id="timer-label">Session</div>
        <div id="time-left">{timer}</div>
      </section>
      <section className="timer-controls-wrapper">
        <button id="start_stop">Start</button>
        <button id="reset">Reset</button>
      </section>
    </div>
  );
}

export default App;
