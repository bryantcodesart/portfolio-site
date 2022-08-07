import React from 'react';
import { Canvas } from '@react-three/fiber';
import { MoveCameraWithMouse } from './MoveCameraWithMouse';
import { CodeLines } from './CodeLines';

// const Squiggle = ({ image, width, position }:
// {
//   image:StaticImageData,
//   width:number,
//   position:[x:number, y:number, z:number]
// }) => (
//   <Image
//     url={image.src}
//     scale={[width, width * (image.height / image.width), 1]}
//     position={position}
//     transparent
//     tint={0xff0000}
//   />
// );

const ThreeScene = () => (
  <Canvas>
    <ambientLight />
    <CodeLines />
    {/* <OrbitControls /> */}
    <MoveCameraWithMouse />
    {/* <Squiggle image={squiggleBigGreenImage} width={5} position={[0, 0, 3]} /> */}

    {/* <Html transform position={[0, 0, 2]}>
      <p className="p-4 text-white bg-blue font-mono text-[1vw]">
        hi! i’m bryant! (he/him)
        <br />
        i make dope
        <br />
        web experiences.
      </p>
    </Html> */}
  </Canvas>
);
export default ThreeScene;
