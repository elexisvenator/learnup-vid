import {makeProject} from '@motion-canvas/core';

import intro from './scenes/intro?scene';
import githubActionsIntro from './scenes/githubActionsIntro?scene';
import githubActionsCode from './scenes/githubActionsCode?scene';

export default makeProject({
  scenes: [intro, githubActionsIntro, githubActionsCode]
});
