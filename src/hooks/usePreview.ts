import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { useCallback, useRef } from 'react';

export const usePreviewService = () => {
  const loader = useRef(new STLLoader()).current;

  const loadModel = useCallback((fileURL: string): Promise<THREE.BufferGeometry> => {
    return new Promise((resolve, reject) => {
      loader.load(
        fileURL,
        (geometry) => {
          // STL loader returns a Geometry or BufferGeometry
          resolve(geometry);
        },
        undefined,
        (error) => reject(error)
      );
    });
  }, [loader]);

  const getDimensions = useCallback((geometry: THREE.BufferGeometry) => {
    geometry.computeBoundingBox();
    const { min, max } = geometry.boundingBox!;

    return {
      width: max.x - min.x,
      height: max.y - min.y,
      depth: max.z - min.z,
    };
  }, []);

  const checkModelDimensions = useCallback((geometry: THREE.BufferGeometry) => {
    const mesh = new THREE.Mesh(geometry);
    const boundingBox = new THREE.Box3().setFromObject(mesh);
    const size = boundingBox.getSize(new THREE.Vector3());
    return {
      length: parseFloat(size.x.toFixed(2)),
      width: parseFloat(size.y.toFixed(2)),
      height: parseFloat(size.z.toFixed(2)),
    };
  }, []);

  return {
    loadModel,
    getDimensions,
    checkModelDimensions,
  };
};