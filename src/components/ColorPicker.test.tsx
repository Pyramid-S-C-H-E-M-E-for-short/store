import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ColorProvider } from "../context/ColorContext";
import ColorPicker from "../components/ColorPicker";
import { ColorsResponse } from "../interfaces";
import { vi } from "vitest";

// Mock data for color options
const mockColors: ColorsResponse[] = [
  { filament: "PLA", hexColor: "FF5733", colorTag: "Red" },
  { filament: "PLA", hexColor: "33FF57", colorTag: "Green" },
  { filament: "PLA", hexColor: "3357FF", colorTag: "Blue" },
];

// Utility to simulate a delay in the fetch response
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe("ColorPicker Component", () => {
  beforeEach(() => {
    vi.spyOn(global, "fetch").mockImplementation(async () => {
      await delay(50); // Simulate a short network delay
      return {
        json: async () => mockColors,
      } as Response;
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("displays loading state initially", async () => {
    await act(async () => {
      render(
        <ColorProvider>
          <ColorPicker filamentType="PLA" />
        </ColorProvider>
      );
    });

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("selects the first color initially after loading", async () => {
    await act(async () => {
      render(
        <ColorProvider>
          <ColorPicker filamentType="PLA" />
        </ColorProvider>
      );
    });

    await waitFor(() => expect(screen.getByLabelText("Choose a color")).toBeInTheDocument());

    const selectedColorButton = screen.getByRole("radio", { checked: true });
    const backgroundColor = selectedColorButton.querySelector("span")?.style.backgroundColor;
    expect(backgroundColor).toBe("rgb(255, 87, 51)"); // Expected color from hex "FF5733"
  });

  it("updates color when a new color is selected", async () => {
    await act(async () => {
      render(
        <ColorProvider>
          <ColorPicker filamentType="PLA" />
        </ColorProvider>
      );
    });

    await waitFor(() => expect(screen.getByLabelText("Choose a color")).toBeInTheDocument());

    const secondColorButton = screen.getByRole("radio", { name: /Green/i });
    
    await act(async () => {
      await userEvent.click(secondColorButton);
    });

    expect(secondColorButton).toBeChecked();
    const selectedBackgroundColor = secondColorButton.querySelector("span")?.style.backgroundColor;
    expect(selectedBackgroundColor).toBe("rgb(51, 255, 87)"); // Expected color from hex "33FF57"
  });
});
