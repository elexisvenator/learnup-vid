import { makeScene2D } from '@motion-canvas/2d';
import { Rect, Txt, Node, Icon, Line } from '@motion-canvas/2d/lib/components';
import { all, any, waitFor, waitUntil, sequence, chain } from '@motion-canvas/core/lib/flow';
import { Direction, Spacing, Vector2 } from '@motion-canvas/core/lib/types';
import { createRef, makeRef, useRandom, useScene } from '@motion-canvas/core/lib/utils';
import { slideTransition } from "@motion-canvas/core/lib/transitions";
import { CodeBlock, lines } from '@motion-canvas/2d/lib/components/CodeBlock';
import { linear } from '@motion-canvas/core/lib/tweening';
import { Random } from '@motion-canvas/core/lib/scenes';
import { createSignal } from '@motion-canvas/core/lib/signals';

const shuffle = function <T>(random: Random, array: T[]): T[] {
  return [...array]
    .map(val => ({ idx: random.nextInt(), val: val }))
    .sort((a, b) => a.idx - b.idx)
    .map(x => x.val);
}

export default makeScene2D(function* (view) {
  const random = useRandom();

  const codeBlock = createRef<CodeBlock>();
  const icons: Txt[] = [];
  yield view.add(
    <>
      <Rect layout width={1920} height={1080} >
        <CodeBlock
          ref={codeBlock}
          language="yaml"
          fontSize={36}
          lineHeight={48}
          grow={1}
          margin={20}
          code={`
        jobs:
          build-and-test:
            steps:
              - uses: actions/checkout@v3
              - uses: actions/setup-node@v3
              - uses: actions/setup-dotnet@v3
              
              - run: pnpm i --frozen-lockfile
              
              - run: pnpm run marten-codegen
              
              - run: pnpm run build
              
              - run: pnpm run test:unit
              - run: pnpm run test:services
              - run: pnpm run test:projections
              - run: pnpm run test:integration
              - run: pnpm run test:queryspecs`} />
      </Rect>
      <Txt ref={makeRef(icons, 0)} opacity={0} x={500} y={-160} fontSize={64}>🔽</Txt>
      <Txt ref={makeRef(icons, 1)} opacity={0} x={500} y={-70} fontSize={64}>🪄</Txt>
      <Txt ref={makeRef(icons, 2)} opacity={0} x={500} y={20} fontSize={64}>🔨</Txt>
      <Txt ref={makeRef(icons, 3)} opacity={0} x={500} y={120} fontSize={64}>🧪</Txt>
      <Txt ref={makeRef(icons, 4)} opacity={0} x={500} y={168} fontSize={64}>🧪</Txt>
      <Txt ref={makeRef(icons, 5)} opacity={0} x={500} y={216} fontSize={64}>🧪</Txt>
      <Txt ref={makeRef(icons, 6)} opacity={0} x={500} y={264} fontSize={64}>🧪</Txt>
      <Txt ref={makeRef(icons, 7)} opacity={0} x={500} y={312} fontSize={64}>🧪</Txt>
    </>
  );

  yield* slideTransition(Direction.Left, 1.5);
  yield* waitUntil('transitionDone');

  yield* codeBlock().selection(lines(3, 5), .5);
  yield* waitUntil('setup highlighted');

  yield* any(
    codeBlock().selection(lines(7), .5),
    icons[0].opacity(1, .5));
  yield* waitUntil('pnpm i highlighted');

  yield* any(
    codeBlock().selection(lines(9), .5),
    icons[1].opacity(1, .5));
  yield* waitUntil('codegen highlighted');

  yield* any(
    codeBlock().selection(lines(11), .5),
    icons[2].opacity(1, .5));
  yield* waitUntil('build highlighted');

  yield* any(
    codeBlock().selection(lines(13, 17), .5),
    icons[3].opacity(1, .5),
    icons[4].opacity(1, .5),
    icons[5].opacity(1, .5),
    icons[6].opacity(1, .5),
    icons[7].opacity(1, .5));
  yield* waitUntil('tests highlighted');

  yield* all(
    codeBlock().opacity(0, 0.5),
    ...icons.map((icon, idx, arr) => {
      const gap = 180;
      return any(
        icon.position({ x: (idx - (arr.length / 2) + .5) * gap, y: 0 }, 1),
        icon.fontSize(100, 1)
      );
    })
  );

  const snail = createRef<Txt>();
  view.add(
    <Icon ref={snail} size={400} y={250} x={-1200} icon={'openmoji:snail'}></Icon>
  );

  yield snail().position({ ...snail().position(), x: 1200 }, 5, linear);
  yield* waitUntil('snail');

  const buildIconX = icons[2].position().x;
  yield* all(
    snail().opacity(0, 0.5),
    ...icons.slice(2).map((icon, idx, arr) => {
      const gap = 180;
      return icon.position({ x: buildIconX, y: (idx - (arr.length / 2) + .5) * gap }, 1);
    })
  );

  snail().remove();
  yield* waitUntil('parallel tests');

  const separateBuilds = icons.slice(2).map((icon) => [icon]);

  const addLabel = function (text: string, position: Vector2): Txt {
    const ref = createRef<Txt>();
    view.add(<Txt
      ref={ref}
      text={text}
      position={{ ...position, x: position.x }}
      fontSize={50}
      lineHeight={50}
      fontFamily={'JetBrains Mono'}
      opacity={0}
      width={800}
      fill={'rgba(255, 255, 255, 0.6)'} />);

    return ref();
  }

  const newLabels = ['Build', 'Unit tests', 'Service tests', 'Projection tests', 'Integration tests', 'Query specs'];
  separateBuilds.forEach((build, idx) => {
    build.push(addLabel(newLabels[idx], build[0].position().addX(700)))
  });

  yield* sequence(0.2, ...separateBuilds.map(build => build[1].opacity(1, 0.5)));
  yield* waitUntil('build labels');

  separateBuilds.forEach((build) => {
    const new0 = icons[0].clone();
    const new1 = icons[1].clone();
    view.add(new0);
    view.add(new1);
    new0.position(icons[0].position())
    new1.position(icons[1].position())
    build.unshift(new0, new1);
  });
  icons.shift().remove();
  icons.shift().remove();

  yield* all(
    ...separateBuilds.map(build => [
      build[0].position({ ...build[0].position(), y: build[2].position().y }, 1),
      build[1].position({ ...build[1].position(), y: build[2].position().y }, 1)
    ]).flat()
  );

  yield* waitUntil('parallel builds too');

  yield* sequence(0.05,
    ...shuffle(random, separateBuilds).map(build => all(
      build[0].fontSize(build[0].fontSize() * 2, 0.5),
      build[0].lineHeight(build[0].fontSize() * 2.5, 0.1),
      build[0].opacity(0, 0.5)
    ))
  );

  separateBuilds.forEach(build => {
    build.shift().remove();
  });

  yield* waitUntil('remove install');

  yield* all(
    separateBuilds[1][0].fontSize(separateBuilds[1][0].fontSize() * 2, 0.5),
    separateBuilds[1][0].lineHeight(separateBuilds[1][0].fontSize() * 2.5, 0.1),
    separateBuilds[1][0].opacity(0, 0.5)
  );

  yield* waitUntil('remove unit test codegen');

  const unitTest = separateBuilds.splice(1, 1)[0];
  // remove hidden unit test codegen icon
  unitTest.shift().remove();

  const codebuildIcons = separateBuilds.map(build => build.shift());
  yield* all(
    ...codebuildIcons.map(icon => icon.position({ ...icon.position(), x: -700, y: -200 }, 1))
  );
  const codegen = [
    codebuildIcons.shift(),
    addLabel("CodeGen", { ...codebuildIcons[0].position(), x: -200 })];
  codebuildIcons.forEach(icon => icon.remove());

  yield* all(
    chain(
      waitFor(0.5),
      codegen[1].opacity(1, 0.5),
    ),
    ...separateBuilds.map((build, idx, arr) => {
      const gap = 180;
      return all(
        build[0].position({ ...build[0].position(), x: 100, y: (idx - (arr.length / 2) + .5) * gap }, 1),
        build[1].position({ ...build[1].position(), x: 600, y: (idx - (arr.length / 2) + .5) * gap }, 1)
      );
    }),
    all(
      unitTest[0].position({ ...unitTest[0].position(), x: -700, y: 200 }, 1),
      unitTest[1].position({ ...unitTest[1].position(), x: -200, y: 200 }, 1)
    )
  );

  yield* waitUntil('separate the builds');

  const codegenBoxRef = createRef<Rect>();
  const unitTestBoxRef = createRef<Rect>();
  const buildsBoxRef = createRef<Rect>();
  const codegenToBuildsRef = createRef<Line>();

  view.add(<>
    <Line ref={codegenToBuildsRef} width={100} />
    <Rect ref={codegenBoxRef} width={600} height={165} x={-500} y={-205} />
    <Rect ref={unitTestBoxRef} width={600} height={165} x={-500} y={195} />
    <Rect ref={buildsBoxRef} width={750} height={900} x={390} y={0} />
  </>)
  const boxes = [codegenBoxRef(), unitTestBoxRef(), buildsBoxRef()]
  boxes.forEach(box => {
    box.lineWidth(4);
    box.opacity(0);
    box.stroke("#AAAAAA")
    box.radius(new Spacing(8))
  });

  const codegenToBuilds = codegenToBuildsRef();
  codegenToBuilds.lineWidth(8);
  codegenToBuilds.stroke("#AAAAAA");
  codegenToBuilds.points([boxes[0].position().addX(300), boxes[0].position().addX(300)])
  codegenToBuilds.endArrow(true);
  codegenToBuilds.arrowSize(4)

  yield* sequence(0.2,
    ...boxes.map((box, idx) => {
      if (idx > 0) {
        return all(
          box.opacity(1, 1),
          box.lineWidth(8, 1)
        );
      }

      return sequence(
        0.5,
        all(
          box.opacity(1, 1),
          box.lineWidth(8, 1)
        ),
        all(
          codegenToBuilds.points([boxes[0].position().addX(300), boxes[0].position().addX(500 + 390 - (750 / 2) - 4)], 1),
          codegenToBuilds.arrowSize(20, 1)
        )
      );

    }));

  yield* waitUntil('discreet builds');

  useScene().enterCanTransitionOut();

  yield* all(...view.children().map(n => n.position(n.position().addX(-100), 1.5)));
});
