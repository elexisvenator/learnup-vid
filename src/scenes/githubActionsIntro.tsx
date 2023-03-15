import { makeScene2D } from '@motion-canvas/2d';
import { Icon, Rect, Txt } from '@motion-canvas/2d/lib/components';
import { waitUntil } from '@motion-canvas/core/lib/flow';
import { Direction } from '@motion-canvas/core/lib/types';
import { createRef, useScene } from '@motion-canvas/core/lib/utils';
import { slideTransition } from "@motion-canvas/core/lib/transitions";

export default makeScene2D(function* (view) {
  // Create your animations here
  var titleLabel = createRef<Txt>()
  view.add(
    <Rect layout >
      <Icon icon={'la:github'} 
      fontSize={120}
      lineHeight={120} 
      height={180}
      marginTop={-40}
      marginRight={20}
      />
      <Txt
      ref={titleLabel}
      fontSize={120}
      lineHeight={120}
      fontFamily={'JetBrains Mono'}
      fill={'rgba(255, 255, 255, 0.6)'}>GitHub Actions</Txt>
    </Rect>
  )

  yield* slideTransition(Direction.Left, 1.5);
  yield* waitUntil('next');
  useScene().enterCanTransitionOut();
  yield* titleLabel().position.x(-300, 1.5);
});
