import React, {
  // useEffect,
  useMemo, useState,
} from 'react';
import { Color, MeshBasicMaterial } from 'three';
import { useInterval } from 'usehooks-ts';
import { config } from '@react-spring/three';
import { Text } from '@react-three/drei';
import { Project } from '../generatedSanitySchemaTypes';
import colors from './colors';
import { CoordArray } from './CoordArray';
import { Scribble } from './Scribble';
import { fontUrls } from './typography';
import { useDelayedBoolean } from './useDelayedBoolean';
import squiggle1Points from './lines/squiggle1';
import squiggle2Points from './lines/squiggle2';
import squiggle3Points from './lines/squiggle3';
import { useChangingColorPalette } from './useChangingColorPalette';

export const possibleColors = [colors.violet, colors.lime, colors.cyan, colors.yellow];
export const baseSquiggles = [
  squiggle3Points,
  squiggle3Points.reverse().map((point) => [point[0], 1 - point[1], point[2]])];
export const decorativeSquiggles1 = [
  squiggle1Points,
  squiggle1Points.reverse().map((point) => [point[0], 1 - point[1], point[2]])];
export const decorativeSquiggles2 = [
  squiggle2Points,
  squiggle2Points.reverse().map((point) => [point[0], 1 - point[1], point[2]]),
];

// eslint-disable-next-line no-unused-vars
export const ProjectTitlePreview = ({ project, basePosition, visible }:
  { project: Project; basePosition: [number, number, number]; visible: boolean; }) => {
  const [titleRotation, setTitleRotation] = useState(0);
  useInterval(() => {
    setTitleRotation(Math.random());
  }, 300);

  const baseSquiggle = useMemo(() => baseSquiggles[
    Math.floor(Math.random() * baseSquiggles.length)], []);
  const decorativeSquiggle1 = useMemo(() => decorativeSquiggles1[
    Math.floor(Math.random() * decorativeSquiggles1.length)], []);
  const decorativeSquiggle2 = useMemo(() => decorativeSquiggles2[
    Math.floor(Math.random() * decorativeSquiggles2.length)], []);

  // const titlePosition: [number, number, number] = [
  //   0,
  //   basePosition[1] < 0 ? basePosition[1] + 2.5 : basePosition[1] - 2.25,
  //   2,
  // ];
  // const titlePosition:[number, number, number] = [0, 0, 2];
  const yDist = 2.5 - Math.abs(basePosition[0]) * 0.25;
  const titlePosition: [number, number, number] = [
    -basePosition[0] / 4,
    basePosition[1] < 0 ? basePosition[1] + yDist : basePosition[1] - yDist,
    2,
  ];

  const delayedVisible = useDelayedBoolean(visible, 800, null);

  // Cant seem to turn off depthTest with drei Text props, so making a material here to pass to Text
  const textMaterial = useMemo(() => new MeshBasicMaterial({
    depthTest: false,
  }), []);

  const renderOrder = 2;

  const { textColor, bgColor } = useChangingColorPalette(500);

  return (
    <>
      <group
        position={titlePosition}
        rotation={[0, 0, (titleRotation * 2 - 1) * (Math.PI * 2 * 0.02)]}
        scale={[1, 2, 1]}
      >
        <Scribble
          position={[0, 0, 0]}
          points={(baseSquiggle as CoordArray[])}
          size={3}
          lineWidth={0.4}
          color={new Color(bgColor)}
          rotation={[Math.PI, 0, 0]}
          visible={delayedVisible}
          drawSpringConfig={{
            duration: 200,
          }}
          scaleSpringConfig={config.wobbly}
          curved
          nPointsInCurve={800}
          depthTest={false}
          renderOrder={renderOrder}
        />
      </group>
      <group
        position={titlePosition}
        rotation={[0, 0, (titleRotation * 2 - 1) * (Math.PI * 2 * 0.02)]}
        scale={[1, 0.5, 1]}
      >
        <Scribble
          position={[0, 0, 0]}
          points={(decorativeSquiggle1 as CoordArray[])}
          size={2}
          lineWidth={0.3}
          color={new Color(bgColor)}
          rotation={[Math.PI, 0, 0]}
          visible={delayedVisible}
          drawSpringConfig={{
            duration: 200,
          }}
          scaleSpringConfig={config.wobbly}
          curved
          nPointsInCurve={800}
          depthTest={false}
          renderOrder={renderOrder}
        />
        <Scribble
          position={[0, 0, 0]}
          points={(decorativeSquiggle2 as CoordArray[])}
          size={3}
          lineWidth={0.3}
          color={new Color(bgColor)}
          rotation={[Math.PI, 0, 0]}
          visible={delayedVisible}
          drawSpringConfig={{
            duration: 200,
          }}
          scaleSpringConfig={config.wobbly}
          curved
          nPointsInCurve={800}
          depthTest={false}
          renderOrder={renderOrder}
        />
      </group>

      <Text
        position={titlePosition}
        rotation={[0, 0, (titleRotation * 2 - 1) * (Math.PI * 2 * 0.02)]}
        color={new Color(textColor)}
        anchorX="center"
        anchorY="middle"
        fontSize={0.5}
        font={fontUrls.bryantBold}
        visible={delayedVisible}
        material={textMaterial}
        renderOrder={renderOrder + 1}
        material-toneMapped={false}
      >
        {project?.shortTitle}
      </Text>
    </>
  );
};
