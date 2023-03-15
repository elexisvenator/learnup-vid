import {makeProject} from '@motion-canvas/core';

import intro from './scenes/intro?scene';
import githubActionsIntro from './scenes/githubActionsIntro?scene';
import githubActionsCode from './scenes/githubActionsCode?scene';
import githubActionsCode2 from './scenes/githubActionsCode2?scene';
import motionCanvasIntro from './scenes/motionCanvasIntro?scene';

export default makeProject({
  scenes: [intro, githubActionsIntro, githubActionsCode, githubActionsCode2, motionCanvasIntro]
});
