import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
// import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import React, { Suspense } from 'react';

export default function Viewer({ fileUrl, wireframe, StlFile, ObjFile }) {

  if (!fileUrl) return;

  return (
    <Canvas
      camera={{ position: [0, 0, 100] }}
      style={{
        maxWidth: '500px',
        maxHeight: '500px',
        background: '#f0f0f0',
        borderRadius: '8px',
      }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <Suspense fallback={null}>
        { <STLModel file={fileUrl} wireframe={wireframe} />}
      </Suspense>
      <OrbitControls />
    </Canvas>
  );
}

export function STLModel({ file, wireframe }) {
  const geometry = useLoader(STLLoader, file);
  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial
        color="#c0c0c0"
        metalness={0}
        roughness={0.3}
        wireframe={wireframe}
      />
    </mesh>
  );
}

// export function OBJModel({ file, wireframe }) {
//   const obj = useLoader(OBJLoader, file);
//   return (
//     <primitive
//       object={obj}
//       material={
//         new THREE.MeshStandardMaterial({
//           color: '#c0c0c0',
//           metalness: 0,
//           roughness: 0.3,
//           wireframe: wireframe,
//         })
//       }
//     />
//   );
// }
