import { makeScene2D } from '@motion-canvas/2d';
import { Rect, Txt, Node, Icon, Line, Img } from '@motion-canvas/2d/lib/components';
import { all, any, waitFor, waitUntil, sequence, chain } from '@motion-canvas/core/lib/flow';
import { Direction, Spacing, Vector2 } from '@motion-canvas/core/lib/types';
import { createRef, makeRef, useRandom, useScene } from '@motion-canvas/core/lib/utils';
import { slideTransition } from "@motion-canvas/core/lib/transitions";
import { CodeBlock, insert, lines } from '@motion-canvas/2d/lib/components/CodeBlock';
import { linear } from '@motion-canvas/core/lib/tweening';
import { Random } from '@motion-canvas/core/lib/scenes';
import { createSignal } from '@motion-canvas/core/lib/signals';
import cachePng from '../../images/caches.png';

export default makeScene2D(function* (view) {
  const codeBlockRef = createRef<CodeBlock>();
  const layoutRef = createRef<Rect>();
  yield view.add(
    <>
      <Rect layout width={1920} height={1080} ref={layoutRef}>
        <CodeBlock
          ref={codeBlockRef}
          language="yaml"
          fontSize={64}
          lineHeight={72}
          grow={1}
          margin={40}
          code={`
        jobs:
          codegen:
            steps:
              - uses: actions/checkout@v3
              - uses: actions/setup-dotnet@v3
              
              - run: pnpm run marten-codegen`} />
      </Rect>
    </>
  );
  
  const codeBlock = codeBlockRef();

  yield* slideTransition(Direction.Left, 1.5);
  yield* waitUntil('transitionDone');

  yield* codeBlock.edit(1.2)`
  jobs:
    codegen:
      steps:
        - uses: actions/checkout@v3
        - uses: actions/setup-dotnet@v3
        
        - run: pnpm run marten-codegen
      
        ${insert(`
        - name: cache codegen
          uses: actions/cache/save@v3`)}`;
  
  yield* waitUntil('cache save action');

  yield* codeBlock.edit(1.2)`
  jobs:
    codegen:
      steps:
        - uses: actions/checkout@v3
        - uses: actions/setup-dotnet@v3
        
        - run: pnpm run marten-codegen
      
        - name: cache codegen
          uses: actions/cache/save@v3
          ${insert(`
          with:
            path: ./path/to/codegen/files
            key: codegen-\${{ github.sha }}`)}`;

  yield* waitUntil('cache save config');

  yield* codeBlock.edit(1.2)`
  jobs:
    codegen:
      steps:
        - uses: actions/checkout@v3
        - uses: actions/setup-dotnet@v3
        
        - run: pnpm run marten-codegen
      
        - name: cache codegen
          uses: actions/cache/save@v3${insert(`
        if: always() # always cache`)}
          with:
            path: ./path/to/codegen/files
            key: codegen-\${{ github.sha }}`;

  yield* waitUntil('always cache');

  yield* codeBlock.selection(lines(0, Infinity), 0.5);
  yield* codeBlock.edit(0, false)`
  jobs:
    codegen:
      steps:
        - uses: actions/checkout@v3
        - uses: actions/setup-dotnet@v3
        
        - run: pnpm run marten-codegen
      
        - name: cache codegen
          uses: actions/cache/save@v3
          if: always() # always cache
          with:
            path: ./path/to/codegen/files
            key: codegen-\${{ github.sha }}`;
  yield* waitUntil('show all');

  const cacheImageRef = createRef<Img>();
  const counter1Ref = createRef<Icon>();
  const counter2Ref = createRef<Icon>();
  view.add(<Img ref={cacheImageRef} src={cachePng} x={2220}>
    <Icon ref={counter1Ref}icon={"material-symbols:counter-1"} color={"#ffc524"} size={64} opacity={0} x={-400} y={-380}/>
    <Icon ref={counter2Ref}icon={"material-symbols:counter-2"} color={"#ffc524"} size={64} opacity={0} x={-600} y={80}/>
  </Img>);
  yield* chain(
    cacheImageRef().position(cacheImageRef().position().addX(-2220), 1.5),
    sequence(0.4, 
      counter1Ref().opacity(1, .8),
      counter2Ref().opacity(1, .8))    
  );
  yield* waitUntil('show cache image');

  yield* cacheImageRef().position(cacheImageRef().position().addX(2220), 1.5);
  cacheImageRef().remove();
  yield* codeBlock.edit(0, false)`
  jobs:
    codegen:
      steps:
        - uses: actions/checkout@v3
        - uses: actions/setup-dotnet@v3
        
        - run: pnpm run marten-codegen
      
        - name: cache codegen
          uses: actions/cache/save@v3
          if: always() # always cache
          with:
            path: ./path/to/codegen/files
            key: codegen-\${{ github.sha }}
    
    
    
    build-all:
      steps:
        - uses: actions/checkout@v3
        - uses: actions/setup-dotnet@v3
        
        - run: pnpm run build`;

  yield* waitUntil('hide cache image');

  yield* layoutRef().position(layoutRef().position().addY(-72*17), 1.5)

  yield* waitUntil('scroll down');

  yield* codeBlock.edit(1.2)`
  jobs:
    codegen:
      steps:
        - uses: actions/checkout@v3
        - uses: actions/setup-dotnet@v3
        
        - run: pnpm run marten-codegen
      
        - name: cache codegen
          uses: actions/cache/save@v3
          if: always() # always cache
          with:
            path: ./path/to/codegen/files
            key: codegen-\${{ github.sha }}
    
    
    
    build-all:
      steps:
        - uses: actions/checkout@v3
        - uses: actions/setup-dotnet@v3
        ${insert(`
      
      - name: restore codegen
        uses: actions/cache/restore@v3
      `)}
        - run: pnpm run build`;

  yield* waitUntil('restore codegen');

  yield* codeBlock.edit(1.2)`
  jobs:
    codegen:
      steps:
        - uses: actions/checkout@v3
        - uses: actions/setup-dotnet@v3
        
        - run: pnpm run marten-codegen
      
        - name: cache codegen
          uses: actions/cache/save@v3
          if: always() # always cache
          with:
            path: ./path/to/codegen/files
            key: codegen-\${{ github.sha }}
    
    
    
    build-all:
      steps:
        - uses: actions/checkout@v3
        - uses: actions/setup-dotnet@v3
        
        - name: restore codegen
          uses: actions/cache/restore@v3
          ${insert(`
          with:
            path: ./path/to/codegen/files
            key: codegen-\${{ github.sha }}
            `)}            
        - run: pnpm run build`;

  yield* waitUntil('restore props');

  yield* codeBlock.edit(1.2)`
  jobs:
    codegen:
      steps:
        - uses: actions/checkout@v3
        - uses: actions/setup-dotnet@v3
        
        - run: pnpm run marten-codegen
      
        - name: cache codegen
          uses: actions/cache/save@v3
          if: always() # always cache
          with:
            path: ./path/to/codegen/files
            key: codegen-\${{ github.sha }}
    
    
    
    build-all:
      steps:
        - uses: actions/checkout@v3
        - uses: actions/setup-dotnet@v3
        
        - name: restore codegen
          uses: actions/cache/restore@v3
          with:
            path: ./path/to/codegen/files
            key: codegen-\${{ github.sha }}
            ${insert(`fail-on-cache-miss: true
            `)}
        - run: pnpm run build`;
  yield* waitUntil('fail on cache miss');

  yield* codeBlock.selection(lines(0, Infinity), 0.5);

  yield* waitUntil('show all again');
  useScene().enterCanTransitionOut();
});
