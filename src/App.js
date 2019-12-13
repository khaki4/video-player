import React from 'react';
import { useMachine } from '@xstate/react';
import { percentage, minutes, seconds } from "./utils";
import videoMachine from './videoMachine';
import './App.css';



function App() {
  const ref = React.useRef(null);
  const [current, send] = useMachine(videoMachine);
  const { duration, elapsed } = current.context;

  console.log(current.value);
  return (
    <div className="App">
      <video
        ref={ref}
        onCanPlay={() => send('LOADED', { video: ref.current })}
        onError={() => send('FAIL')}
        onTimeUpdate={() => send('TIMING')}
        onEnded={() => send('END')}
      >
        <source src="/test.mp4" type="video/mp4"/>
      </video>

      <div>
        <ElapsedBar elapsed={elapsed} duration={duration}/>
        <Buttons current={current} send={send} />
        <Timer elapsed={elapsed} duration={duration}/>
      </div>
    </div>
  );
}

export default App;

const Buttons = ({ current, send }) => {
  if (current.matches('ready.playing')) {
    return <button onClick={() => send('PAUSE')}>Pause</button>
  } else {
    return <button onClick={() => send('PLAY')}>PLAY</button>
  }
};

const ElapsedBar = ({ elapsed, duration }) => (
  <div className="elapsed">
    <div
      className="elapsed-bar"
      style={{ width: `${percentage(duration, elapsed)}%` }}
    />
  </div>
);

const Timer = ({ elapsed, duration }) => (
  <span className="timer">
    {minutes(elapsed)}:{seconds(elapsed)} of {minutes(duration)}:
    {seconds(duration)}
  </span>
);