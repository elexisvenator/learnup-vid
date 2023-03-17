import {makeProject} from '@motion-canvas/core';

import intro from './scenes/intro?scene';
import githubActionsIntro from './scenes/githubActionsIntro?scene';
import githubActionsCode from './scenes/githubActionsCode?scene';
import githubActionsCode2 from './scenes/githubActionsCode2?scene';
import motionCanvasIntro from './scenes/motionCanvasIntro?scene';
import audio from '../audio/learnup1.mp3';

export default makeProject({
  scenes: [intro, githubActionsIntro, githubActionsCode, githubActionsCode2],
  audio: audio
});
