import { useState, useEffect } from "react";
import "./App.scss";

function App() {
  const [breakLength, setBreakLength] = useState<number>(5);
  const [sessionLength, setSessionLength] = useState<number>(25);
  const [timer, setTimer] = useState<string>("25:00");
  const [intervalId, setIntervalId] = useState<number>(-1);

  useEffect(() => {
    if (timer === "00:00") {
      clearInterval(intervalId);
      updateTimer(sessionLength);
      setIntervalId(-1);
    }
    if (intervalId === -1) {
      updateTimer(sessionLength);
    }
  });

  function updateTimer(timeInMin: number): void {
    const newTime: string = new Date(timeInMin * 60 * 1000)
      .toISOString()
      .substring(14, 19);
    setTimer(newTime);
  }

  function handleStartTimerClick() {
    let seconds: number = sessionLength * 60;

    function handleInterval() {
      const time: Date = new Date(seconds * 1000);
      setTimer(time.toISOString().substring(14, 19));
      time.setSeconds(seconds, 0);
      seconds -= 1;
    }

    const intervalId: number = setInterval(handleInterval, 1000);
    setIntervalId(intervalId);
  }

  function handleBreakDecrementClick() {
    if (breakLength > 1 && intervalId === -1) {
      setBreakLength((breakLength) => breakLength - 1);
    }
  }

  function handleBreakIncrementClick() {
    if (breakLength < 60 && intervalId === -1) {
      setBreakLength((breakLength) => breakLength + 1);
    }
  }

  function handleSessionDecrementClick() {
    if (sessionLength > 1 && intervalId === -1) {
      setSessionLength((sessionLength) => sessionLength - 1);
    }
  }

  function handleSessionIncrementClick() {
    if (intervalId === -1) {
      setSessionLength((sessionLength) => sessionLength + 1);
    }
  }

  function handleResetClick() {
    setBreakLength(5);
    setSessionLength(25);
    setTimer("25:00");
    clearInterval(intervalId);
    setIntervalId(-1);
  }

  return (
    <div className="App">
      <h1 className="main-heading">Pomodoro Clock</h1>
      <section className="break-wrapper">
        <div id="break-label">Break Length</div>
        <Button
          id="break-decrement"
          onClick={handleBreakDecrementClick}
          intervalId={intervalId}
        >
          -
        </Button>
        <div id="break-length">{breakLength}</div>
        <Button
          id="break-increment"
          onClick={handleBreakIncrementClick}
          intervalId={intervalId}
        >
          +
        </Button>
      </section>
      <section className="session-wrapper">
        <div id="session-label">Session Length</div>
        <Button
          id="session-decrement"
          onClick={handleSessionDecrementClick}
          intervalId={intervalId}
        >
          -
        </Button>
        <div id="session-length">{sessionLength}</div>
        <Button
          id="session-increment"
          onClick={handleSessionIncrementClick}
          intervalId={intervalId}
        >
          +
        </Button>
      </section>
      <section className="timer-wrapper">
        <div id="timer-label">Session</div>
        <div id="time-left">{timer}</div>
      </section>
      <section className="timer-controls-wrapper">
        <Button id="start_stop" onClick={handleStartTimerClick}>
          Start
        </Button>
        <Button id="reset" onClick={handleResetClick}>
          Reset
        </Button>
      </section>
    </div>
  );
}

interface Button {
  id: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  intervalId?: number;
  children: React.ReactNode;
}

export function Button({
  id,
  onClick,
  intervalId = -1,
  children,
}: Button): JSX.Element {
  const isDisabled = intervalId === -1 ? false : true;
  return (
    <button id={id} onClick={onClick} disabled={isDisabled}>
      {children}
    </button>
  );
}

export default App;
