import React, { useEffect } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useColorContext } from "../context/ColorContext";
import * as THREE from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";

const LIMIT_DIMENSIONS_MM = { length: 250, width: 250, height: 310 }; // in mm

interface PreviewComponentProps {
  color: string;
  url: string;
  onExceedsLimit: (limit: boolean) => void;
  onError: (error: string) => void;
  imageUrl?: string; // Optional image URL for photo display
}

interface ModelProps {
  url: string;
  color: number;
  onExceedsLimit: (limit: boolean) => void;
  onError: (error: string) => void;
}

const Model: React.FC<ModelProps> = ({ url, color, onExceedsLimit, onError }) => {
  const geometry = useLoader(STLLoader, url);

  useEffect(() => {
    if (geometry) {
      geometry.computeBoundingBox();
      const size = geometry.boundingBox?.getSize(new THREE.Vector3());
      const center = geometry.boundingBox?.getCenter(new THREE.Vector3());

      if (center) {
        geometry.translate(-center.x, -center.y, -center.z); // Center the model
      }

      if (size) {
        const modelExceedsLimit =
          size.x > LIMIT_DIMENSIONS_MM.length ||
          size.y > LIMIT_DIMENSIONS_MM.width ||
          size.z > LIMIT_DIMENSIONS_MM.height;

        onExceedsLimit(modelExceedsLimit);

        if (modelExceedsLimit) {
          onError(
            `Model dimensions exceed our limit of ${LIMIT_DIMENSIONS_MM.length} (L) x ${LIMIT_DIMENSIONS_MM.width} (W) x ${LIMIT_DIMENSIONS_MM.height} (H) mm.`
          );
        }
      }
    }

    // Clean up geometry when component unmounts
    return () => {
      geometry.dispose();
    };
  }, [geometry, onExceedsLimit, onError]);


  return (
    <mesh geometry={geometry} rotation={[-Math.PI / 2, 0, Math.PI]} position={[0, 0, 0]}>
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

const PreviewComponent: React.FC<PreviewComponentProps> = ({ url, onExceedsLimit, onError, imageUrl }) => {
  const { state } = useColorContext();
  const { color } = state;

  useEffect(() => {
    const handleResize = () => {
      // Handle resize logic if needed
    };

    window.addEventListener("resize", handleResize);

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // If imageUrl is provided, show the image instead of 3D model
  if (imageUrl) {
    return (
      <div className="flex flex-col items-center justify-center">
        <div className="w-full max-w-[600px] h-[400px] bg-gray-100 rounded-lg overflow-hidden">
          <img
            src={imageUrl}
            alt="Product preview"
            className="w-full h-full object-contain"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <Canvas
        style={{ width: "600px", height: "400px" }}
        camera={{ fov: 50, position: [0, 0, 100] }}
        dpr={Math.min(window.devicePixelRatio, 1)} // Lower resolution for resource management
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[1, 1, 1]} intensity={0.5} />
        <OrbitControls />
        {url && (
          <Model
            url={url}
            color={parseInt(color.replace("#", ""), 16)}
            onExceedsLimit={onExceedsLimit}
            onError={onError}
          />
        )}
      </Canvas>
    </div>
  );
};

export default PreviewComponent;
