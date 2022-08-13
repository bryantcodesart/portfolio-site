import React from 'react';
import { InvisibleInteractiveMesh } from './InvisibleInteractiveMesh';
import { Typewriter } from './Typewriter';
import { fontUrls } from './typography';

export function ComputerTerminal() {
  const computerScreenText = `I'm Bryant! (he/him)
    I build web experiences.`;
  return (
    <group
      // position={[-2.6, 1.3, 2.1]}
      position={[-1, 0.7, 2]}
      rotation={[0, 0, Math.PI / 40]}
    >
      <Typewriter
        color="white"
        anchorX="left"
        anchorY="top"
        position={[-1.6, 0.9, 0.1]}
        fontSize={0.27}
        lineHeight={1.3}
        font={fontUrls.bryantBold}
      >
        {computerScreenText}
      </Typewriter>
      <InvisibleInteractiveMesh position={[0, 0, 0]} width={3.5} height={2} />
    </group>
  );
}
