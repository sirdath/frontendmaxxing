import {makeScene2D, Rect, Txt} from '@motion-canvas/2d';
import {createRef, all, waitFor, easeOutBack} from '@motion-canvas/core';

// A card animates in (fade + rise), holds, then gives a tasteful pulse.
// Edit this file and the live editor (npm run serve) updates instantly.
export default makeScene2D(function* (view) {
  view.fill('#0e0d0c');

  const card = createRef<Rect>();
  view.add(
    <Rect
      ref={card}
      width={460}
      height={280}
      radius={28}
      fill={'#6c5cff'}
      opacity={0}
      y={48}
      shadowColor={'#000000aa'}
      shadowBlur={40}
      shadowOffsetY={20}
    >
      <Txt fill={'white'} fontSize={56} fontWeight={700} text={'Finder'} />
    </Rect>,
  );

  yield* all(
    card().opacity(1, 0.6),
    card().y(0, 0.7, easeOutBack),
  );
  yield* waitFor(0.7);
  yield* card().scale(1.06, 0.32).to(1, 0.32);
  yield* waitFor(0.6);
});
