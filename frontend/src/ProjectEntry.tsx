import { Text } from '@react-three/drei';
import React, { useEffect, useState } from 'react';
import { Color } from 'three';
import { config, animated, useSpring } from '@react-spring/three';
import { Project } from '../generatedSanitySchemaTypes';
import colors from './colors';
import { fontUrls } from './typography';
import { CoffeeVideoMaterial } from './CoffeeVideoMaterial';
import labelBackPoints from './lines/labelBack';
import { Scribble } from './Scribble';
import { CoordArray } from './CoordArray';

const TITLE_BACK_COLOR = colors.cyan;
const TITLE_TEXT_COLOR = colors.blue;

export const ProjectEntry = ({ project, active }: { project: Project; active: boolean; }) => {
  const [showText, setShowText] = useState(false);
  const [showBack, setShowBack] = useState(false);

  useEffect(() => {
    const timeouts:ReturnType<typeof setTimeout>[] = [];
    if (active) {
      let delay = 0;
      timeouts.push(setTimeout(() => {
        setShowBack(true);
      }, delay += 400));
      timeouts.push(setTimeout(() => {
        setShowText(true);
      }, delay += 1000));
    } else {
      setShowBack(false);
      setShowText(false);
    }
    return () => {
      timeouts.forEach((timeout) => { clearTimeout(timeout); });
    };
  }, [active]);

  const { videoScale } = useSpring({
    videoScale: showBack ? 1 : 0.7,
    config: config.wobbly,
  });

  return (
    <>
      <animated.mesh
        position={[0, 0, 3]}
        scale={videoScale}
        renderOrder={1}
      >
        <boxGeometry args={[1, 1, 1]} attach="geometry" />
        <CoffeeVideoMaterial src="/videos/test.mp4" playing={active} />
      </animated.mesh>
      <group
        position={[-1.4, 0.8, 3.2]}
        rotation={[0, 0, Math.PI / 9]}
      >
        <Scribble
          position={[0, 0, -0.1]}
          points={(labelBackPoints as CoordArray[])}
          size={2}
          lineWidth={0.15}
          color={new Color(TITLE_BACK_COLOR)}
          rotation={[Math.PI, 0, 0]}
          visible={showBack}
          drawSpringConfig={active ? config.molasses : config.stiff}
          scaleSpringConfig={config.wobbly}
          curved
          nPointsInCurve={1200}
        />
        <Text
          position={[0, -0.0, -0.1]}
          color={TITLE_TEXT_COLOR}
          anchorX="center"
          anchorY="middle"
          fontSize={0.25}
          font={fontUrls.bryantBold}
          visible={showText}
        >
          {project.title}
        </Text>
      </group>
    </>
  );
};
