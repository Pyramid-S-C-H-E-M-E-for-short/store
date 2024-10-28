/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { usePreviewService } from "../hooks/usePreview";
import { useColorContext } from "../context/ColorContext"; // Import the ColorContext

const GRID_SIZE = 250; // in mm
const LIMIT_DIMENSIONS_MM = { length: 250, width: 250, height: 310 }; // in mm

interface PreviewComponentProps {
  url: string;
  onExceedsLimit: (limit: boolean) => void;
  onError: (error: string) => void;
}

const PreviewComponent: React.FC<PreviewComponentProps> = ({
  url,
  onExceedsLimit,
  onError,
}) => {
  const { state } = useColorContext(); // Access the context state
  const { color } = state; // Destructure color from state

  const previewRef = useRef<HTMLDivElement | null>(null);
  const { loadModel } = usePreviewService();
  const scene = useRef(new THREE.Scene()).current;
  const camera = useRef(
    new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  ).current;
  const renderer = useRef(new THREE.WebGLRenderer({ antialias: true })).current;
  const meshRef = useRef<THREE.Mesh | null>(null);
  const gridHelperRef = useRef<THREE.GridHelper | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const [_dimensions, setDimensions] = useState<{ length: number; width: number; height: number }>({
    length: 0,
    width: 0,
    height: 0,
  });
  const [modelLoaded, setModelLoaded] = useState<boolean>(false);
  const [_exceedsLimit, setExceedsLimit] = useState<boolean>(false);
  const [_errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (previewRef.current) {
      initializeScene();
    }
  }, []);

  useEffect(() => {
    if (modelLoaded) {
      fitCameraToObject(meshRef.current!);
      updateGrid();
      updateDimensions();
    }
  }, [modelLoaded]);

  useEffect(() => {
    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Reload the model whenever the URL or color changes
  useEffect(() => {
    if (url && color) {
      loadModelAndCheckDimensions(url);
    }
  }, [url, color]);

  const initializeScene = () => {
    renderer.setSize(600, 400); // Fixed size
    previewRef.current!.appendChild(renderer.domElement);
    camera.position.z = 500;
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    scene.add(new THREE.DirectionalLight(0xffffff, 0.5));

    renderer.setClearColor(0xf0f0f0); // A slightly darker white color

    controlsRef.current = new OrbitControls(camera, renderer.domElement);
    animate();
  };

  const loadModelAndCheckDimensions = async (url: string) => {
    try {
      const geometry = await loadModel(url);
      if (geometry) {
        const hexColor = parseInt(color.replace("#", ""), 16); // Convert color to hex
        const material = new THREE.MeshStandardMaterial({ color: hexColor });

        meshRef.current = new THREE.Mesh(geometry, material);

        let boundingBox = new THREE.Box3().setFromObject(meshRef.current);
        const center = boundingBox.getCenter(new THREE.Vector3());
        const size = boundingBox.getSize(new THREE.Vector3());

        checkDimensions(size);

        meshRef.current.rotation.x = Math.PI / 2;
        meshRef.current.updateMatrixWorld();

        const worldDir = new THREE.Vector3();
        meshRef.current.getWorldDirection(worldDir);
        if (worldDir.y < 0) {
          meshRef.current.rotation.x += Math.PI;
        }

        boundingBox = new THREE.Box3().setFromObject(meshRef.current);
        boundingBox.getCenter(center);
        boundingBox.getSize(size);

        checkDimensions(size);

        meshRef.current.position.copy(center).multiplyScalar(-1);
        meshRef.current.position.y += size.y / 2;

        scene.add(meshRef.current);
        setModelLoaded(true);
      } else {
        throw new Error("Invalid file: Could not load the 3D model from the provided file.");
      }
    } catch (error: any) {
      console.error(error);
      setErrorMessage(error.message);
      setExceedsLimit(true);
      onError(error.message);
    }
  };

  const fitCameraToObject = (object: THREE.Object3D, offset = 2) => {
    const boundingBox = new THREE.Box3().setFromObject(object);
    const center = boundingBox.getCenter(new THREE.Vector3());
    const size = boundingBox.getSize(new THREE.Vector3());

    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = camera.fov * (Math.PI / 180);
    const cameraZ = Math.abs(maxDim / (2 * Math.tan(fov / 2)));

    camera.position.set(center.x, size.y / 2, cameraZ * offset);
    camera.lookAt(center.add(new THREE.Vector3(0, size.y / 2, 0)));

    if (controlsRef.current) {
      controlsRef.current.target = center;
    }

    camera.updateProjectionMatrix();
  };

  const animate = () => {
    requestAnimationFrame(animate);
    controlsRef.current!.update();
    renderer.render(scene, camera);
  };

  const updateGrid = () => {
    if (gridHelperRef.current) {
      scene.remove(gridHelperRef.current);
    }

    const gridHelper = new THREE.GridHelper(GRID_SIZE, GRID_SIZE);
    scene.add(gridHelper);
    gridHelperRef.current = gridHelper;
  };

  const updateMaterialColor = (hexColor: number) => {
    if (meshRef.current) {
      const material = new THREE.MeshStandardMaterial({ color: hexColor });
      meshRef.current.material = material;
    }
  };

  useEffect(() => {
    if (modelLoaded && color) {
      updateMaterialColor(parseInt(color.replace("#", ""), 16));
    }
  }, [color, modelLoaded]);

  const updateDimensions = () => {
    const boundingBox = new THREE.Box3().setFromObject(meshRef.current!);
    const size = boundingBox.getSize(new THREE.Vector3());

    if (size.x === 0 || size.y === 0 || size.z === 0) {
      setError("Invalid model: The model dimensions are zero.");
      return;
    }

    setDimensions({
      length: parseFloat(size.x.toFixed(2)),
      width: parseFloat(size.y.toFixed(2)),
      height: parseFloat(size.z.toFixed(2)),
    });

    const modelExceedsLimit =
      size.x > LIMIT_DIMENSIONS_MM.length ||
      size.y > LIMIT_DIMENSIONS_MM.width ||
      size.z > LIMIT_DIMENSIONS_MM.height;

    setExceedsLimit(modelExceedsLimit);
    onExceedsLimit(modelExceedsLimit);
  };

  const checkDimensions = (size: THREE.Vector3) => {
    if (size.x === 0 || size.y === 0 || size.z === 0) {
      setError("Invalid model: The model dimensions are zero.");
      return;
    }

    setDimensions({
      length: parseFloat(size.x.toFixed(2)),
      width: parseFloat(size.y.toFixed(2)),
      height: parseFloat(size.z.toFixed(2)),
    });

    const modelExceedsLimit =
      size.x > LIMIT_DIMENSIONS_MM.length ||
      size.y > LIMIT_DIMENSIONS_MM.width ||
      size.z > LIMIT_DIMENSIONS_MM.height;

    if (modelExceedsLimit) {
      setError(
        `Model dimensions exceed our limit of ${LIMIT_DIMENSIONS_MM.length} (L) x ${LIMIT_DIMENSIONS_MM.width} (W) x ${LIMIT_DIMENSIONS_MM.height} (H) mm. Please choose a smaller model.`
      );
    }
  };

  const setError = (message: string) => {
    setErrorMessage(message);
    setExceedsLimit(true);
    onError(message);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative">
        <div ref={previewRef}></div>
      </div>
    </div>
  );
};

export default PreviewComponent;
