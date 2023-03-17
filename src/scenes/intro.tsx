import { makeScene2D } from '@motion-canvas/2d';
import { Txt } from '@motion-canvas/2d/lib/components';
import { waitUntil } from '@motion-canvas/core/lib/flow';
import { createRef, useScene } from '@motion-canvas/core/lib/utils';

export default makeScene2D(function* (view) {
  // Create your animations here
  var titleLabel = createRef<Txt>()
  view.add(
    <Txt
      ref={titleLabel}
      fontSize={120}
      lineHeight={120}
      fontFamily={'JetBrains Mono'}
      fill={'rgba(255, 255, 255, 0.6)'}></Txt>
  )

  yield* titleLabel().text('🎓 ');
  yield* waitUntil('initial pause');
  yield* titleLabel().text('🎓 LearnUp', 2);
  yield* waitUntil('next');
  useScene().enterCanTransitionOut();
  yield* titleLabel().position.x(-300, 1.5);
});
