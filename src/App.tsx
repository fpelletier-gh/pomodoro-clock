import { useState, useEffect, useRef } from "react";
import "./App.scss";

function App() {
  const [breakLength, setBreakLength] = useState<number>(5);
  const [sessionLength, setSessionLength] = useState<number>(25);
  const [sessionLengthInSec, setSessionLengthInSec] = useState<number>(
    sessionLength * 60
  );
  const [breakLengthInSec, setBreakLengthInSec] = useState<number>(
    breakLength * 60
  );
  const [timerDisplay, setTimerDisplay] = useState<string>("25:00");
  const [isBreak, setIsBreak] = useState<boolean>(false);
  const [start, setStart] = useState<boolean>(false);
  const [timeoutId, setTimeoutId] = useState<number>(-1);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (start && !isBreak && sessionLengthInSec === 0) {
      setIsBreak(true);
      setSessionLengthInSec(() => sessionLength * 60);
      updateTimerDisplay(breakLengthInSec);
      audioRef.current && audioRef.current.play();
    }

    if (start && !isBreak && sessionLengthInSec > 0) {
      const timeout: number = setTimeout(
        () =>
          setSessionLengthInSec((sessionLengthInSec) => {
            updateTimerDisplay(sessionLengthInSec - 1);
            return sessionLengthInSec - 1;
          }),
        1000
      );
      setTimeoutId(timeout);
    }

    if (start && isBreak && breakLengthInSec === 0) {
      setIsBreak(false);
      setBreakLengthInSec(() => breakLength * 60);
      updateTimerDisplay(sessionLengthInSec);
      audioRef.current && audioRef.current.play();
    }

    if (start && isBreak && breakLengthInSec > 0) {
      const timeout: number = setTimeout(
        () =>
          setBreakLengthInSec((breakLengthInSec) => {
            updateTimerDisplay(breakLengthInSec - 1);
            return breakLengthInSec - 1;
          }),
        1000
      );
      setTimeoutId(timeout);
    }
  }, [start, isBreak, sessionLengthInSec, breakLengthInSec]);

  function updateTimerDisplay(timeInSec: number): void {
    const newTime: string = new Date(timeInSec * 1000)
      .toISOString()
      .substring(14, 19);
    if (timeInSec / 60 === 60) {
      setTimerDisplay(() => newTime.replace(/^.{2}/g, "60"));
    } else {
      setTimerDisplay(() => newTime);
    }
  }

  function handleStartTimerClick() {
    if (start) {
      setStart(false);
      clearTimeout(timeoutId);
    } else {
      setStart(true);
    }
  }

  function handleBreakDecrementClick() {
    if (breakLength > 1 && !start) {
      setBreakLength((breakLength) => {
        setBreakLengthInSec(() => (breakLength - 1) * 60);
        return breakLength - 1;
      });
    }
  }

  function handleBreakIncrementClick() {
    if (breakLength < 60 && !start) {
      setBreakLength((breakLength) => {
        setBreakLengthInSec(() => (breakLength + 1) * 60);
        return breakLength + 1;
      });
    }
  }

  function handleSessionDecrementClick() {
    if (sessionLength > 1 && !start) {
      setSessionLength((sessionLength) => {
        setSessionLengthInSec(() => (sessionLength - 1) * 60);
        updateTimerDisplay((sessionLength - 1) * 60);
        return sessionLength - 1;
      });
    }
  }

  function handleSessionIncrementClick() {
    if (sessionLength < 60 && !start) {
      setSessionLength((sessionLength) => {
        setSessionLengthInSec(() => (sessionLength + 1) * 60);
        updateTimerDisplay((sessionLength + 1) * 60);
        return sessionLength + 1;
      });
    }
  }

  function handleResetClick() {
    clearTimeout(timeoutId);
    setStart(false);
    setIsBreak(false);
    setBreakLength(5);
    setSessionLength(25);
    setBreakLengthInSec(300), 1000;
    setSessionLengthInSec(1500), 1000;
    setTimerDisplay("25:00");
    audioRef.current && audioRef.current.pause();
    audioRef.current ? (audioRef.current.currentTime = 0) : null;
  }

  return (
    <div className="App">
      <h1 className="main-heading">Pomodoro Clock</h1>
      <section className="break-wrapper">
        <div id="break-label">Break Length</div>
        <Button
          id="break-decrement"
          onClick={handleBreakDecrementClick}
          isDisabled={start}
        >
          -
        </Button>
        <div id="break-length">{breakLength}</div>
        <Button
          id="break-increment"
          onClick={handleBreakIncrementClick}
          isDisabled={start}
        >
          +
        </Button>
      </section>
      <section className="session-wrapper">
        <div id="session-label">Session Length</div>
        <Button
          id="session-decrement"
          onClick={handleSessionDecrementClick}
          isDisabled={start}
        >
          -
        </Button>
        <div id="session-length">{sessionLength}</div>
        <Button
          id="session-increment"
          onClick={handleSessionIncrementClick}
          isDisabled={start}
        >
          +
        </Button>
      </section>
      <section className="timer-wrapper">
        <div id="timer-label">{isBreak ? "Break" : "Session"}</div>
        <div id="time-left">{timerDisplay}</div>
        <audio id="beep" src="src/assets/beep.mp3" ref={audioRef} />
      </section>
      <section className="timer-controls-wrapper">
        <Button id="start_stop" onClick={handleStartTimerClick}>
          {!start ? "Start" : "Pause"}
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
  isDisabled?: boolean;
  children: React.ReactNode;
}

export function Button({
  id,
  onClick,
  isDisabled = false,
  children,
}: Button): JSX.Element {
  return (
    <button id={id} onClick={onClick} disabled={isDisabled}>
      {children}
    </button>
  );
}

export default App;
