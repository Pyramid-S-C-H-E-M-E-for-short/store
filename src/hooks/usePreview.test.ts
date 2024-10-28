import { renderHook } from "@testing-library/react";
import { vi } from "vitest";
import * as THREE from "three";
import { usePreviewService } from './usePreview';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';

// Mock STLLoader directly
vi.mock("three/examples/jsm/loaders/STLLoader.js", () => {
  return {
    STLLoader: vi.fn().mockImplementation(() => ({
      load: vi.fn(), // Define load as a mock function
    })),
  };
});

describe("usePreviewService", () => {
  let mockGeometry: THREE.BufferGeometry;

  beforeEach(() => {
    // Set up a mock geometry with a bounding box
    mockGeometry = new THREE.BufferGeometry();
    mockGeometry.computeBoundingBox = vi.fn(() => {
      mockGeometry.boundingBox = new THREE.Box3(
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(10, 20, 30)
      );
    });

    // Ensure load is mocked for each test
    STLLoader.prototype.load = vi.fn();
  });

  it.skip(
    "loads a model successfully using loadModel",
    async () => {
      const { result } = renderHook(() => usePreviewService());

      // Mock load to immediately call onLoad with mockGeometry
      (STLLoader.prototype.load as jest.Mock).mockImplementation((_, onLoad) => {
        onLoad(mockGeometry);
      });

      const geometry = await result.current.loadModel("mockURL");
      expect(geometry).toBe(mockGeometry);
    },
    10000
  );

  it.skip(
    "handles loadModel error correctly",
    async () => {
      const { result } = renderHook(() => usePreviewService());

      // Mock load to immediately call onError with an error
      (STLLoader.prototype.load as jest.Mock).mockImplementation((_, __, ___, onError) => {
        onError(new Error("Failed to load"));
      });

      await expect(result.current.loadModel("mockURL")).rejects.toThrow("Failed to load");
    },
    10000
  );

  it("calculates dimensions using getDimensions", () => {
    const { result } = renderHook(() => usePreviewService());
    mockGeometry.computeBoundingBox();

    const dimensions = result.current.getDimensions(mockGeometry);
    expect(dimensions).toEqual({
      width: 10,
      height: 20,
      depth: 30,
    });
  });

  it("checks model dimensions using checkModelDimensions", () => {
    const { result } = renderHook(() => usePreviewService());
    const dimensions = result.current.checkModelDimensions(mockGeometry);

    expect(dimensions).toEqual({
      length: 10,
      width: 20,
      height: 30,
    });
  });
});
