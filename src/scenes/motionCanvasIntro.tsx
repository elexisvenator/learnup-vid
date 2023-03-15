import { makeScene2D } from '@motion-canvas/2d';
import { Icon, Img, Rect, Txt } from '@motion-canvas/2d/lib/components';
import { waitUntil } from '@motion-canvas/core/lib/flow';
import { Direction } from '@motion-canvas/core/lib/types';
import { createRef, useScene } from '@motion-canvas/core/lib/utils';
import { slideTransition } from "@motion-canvas/core/lib/transitions";
import logoSvg from '../../images/logo_dark.svg';

export default makeScene2D(function* (view) {
  // Create your animations here
  var layoutRef = createRef<Txt>()
  view.add(
    <Rect layout ref={layoutRef}>
      <Img 
      src={logoSvg} 
      size={192}
      marginTop={-48}
      marginRight={20}/>
      <Txt
      fontSize={120}
      lineHeight={120}
      fontFamily={'JetBrains Mono'}
      fill={'rgba(255, 255, 255, 0.6)'}>Motion Canvas</Txt>
    </Rect>
  )

  yield* slideTransition(Direction.Left, 1.5);
  yield* waitUntil('next');
  useScene().enterCanTransitionOut();
  yield* layoutRef().position.x(-300, 1.5);
});
