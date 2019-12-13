import { assign, Machine } from 'xstate';


const loadVideo = assign({
  video: (_, { video }) => video,
  duration: (_, { video }) => video.duration,
});
const updateTime = assign({
  elapsed: ({ video }) => video.currentTime
});
const playVideo = ({ video }) => video.play();
const pauseVideo = ({ video }) => video.pause();
const restartVideo = ({ video }) => (video.currentTime = 0, video.play());

export default new Machine({
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
        LOADED: {
          target: 'ready',
          actions: loadVideo,
        },
        FAIL: 'failure'
      }
    },
    ready: {
      initial: 'paused',
      states: {
        paused: {
          on: {
            PLAY: {
              target: 'playing',
              actions: [playVideo]
            }
          }
        },
        playing: {
          on: {
            PAUSE: {
              target: 'paused',
              actions: [pauseVideo]
            },
            END: 'ended',
            TIMING: {
              target: 'playing',
              actions: updateTime
            }
          }
        },
        ended: {
          on: {
            PLAY: {
              target: 'playing',
              actions: [restartVideo]
            }
          }
        }
      }
    },
    failure: { type: 'final' }
  }
});