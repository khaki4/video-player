import React from 'react';
import { useMachine } from '@xstate/react';
import { Machine, assign } from 'xstate';
import { percentage, minutes, seconds } from "./utils";

const videoMachine = new Machine({
  id: 'videoMachine',
  initial: 'loading',
  context: {
    video: null,
    duration: 0,
    elapsed: 0
  },
  states: {
    loading: {
      on: {
        LOADED: 'ready',
        FAIL: 'failure'
      }
    },
    ready: {
      initial: 'paused',
      states: {
        paused: {
          on: {
            PLAY: 'playing'
          }
        },
        playing: {
          on: {
            PAUSE: 'paused',
            END: 'ended',
            TIMING: 'playing'
          }
        },
        ended: {
          on: {
            PLAY: 'playing'
          }
        }
      }
    },
    failure: { type: 'final'}
  }
})

function App() {
  return (
    <div className="App">
      <video controls>
        <source src="/test.mp4" type="video/mp4" />
      </video>

      <div>
        <ElapsedBar elapsed={0} duration={0} />
        <Buttons />
        <Timer elapsed={0} duration={0} />
      </div>
    </div>
  );
}

export default App;

const Buttons = () => {
  return <button onClick={() => {}}>Play / Pause</button>
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