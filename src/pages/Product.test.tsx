import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import ProductPage from "./Product";
import { vi } from "vitest";
import React, { Suspense } from "react";

// Mock lazy-loaded component
vi.mock("../components/PreviewComponent", () => ({
  default: () => <div data-testid="preview-component">Preview Component</div>,
}));

// Mock components
vi.mock("../components/ColorPicker", () => ({
  default: ({ filamentType }: {filamentType: string}) => (
    <div data-testid="color-picker">
      Color Picker for {filamentType}
    </div>
  ),
}));

vi.mock("../components/FilamentDropdown", () => ({
  default: ({ selectedFilament, setSelectedFilament }: { selectedFilament: string; setSelectedFilament: (value: string) => void }) => (
    <select
      data-testid="filament-dropdown"
      value={selectedFilament}
      onChange={(e) => setSelectedFilament(e.target.value)}
    >
      <option value="PLA">PLA</option>
      <option value="PETG">PETG</option>
    </select>
  ),
}));

describe("ProductPage", () => {
  beforeEach(async () => {
    // Wrap render in act() to handle Suspense loading
    await act(async () => {
      render(
        <Suspense fallback={<div>Loading...</div>}>
          <ProductPage />
        </Suspense>
      );
    });
  });

  it("renders ProductPage with product details", () => {
    expect(screen.getByText("RC Wheels")).toBeInTheDocument();
    expect(screen.getByText("$35")).toBeInTheDocument();
    expect(screen.getByText("Description")).toBeInTheDocument();
    expect(
      screen.getByText(
        "This is a 12mm RC buggy wheel that will fit any modern buggy for 1/10 scale racing."
      )
    ).toBeInTheDocument();
  });

  it("renders PreviewComponent in a Suspense wrapper", async () => {
    // Wait for PreviewComponent to load and check for its existence
    await waitFor(() => {
      expect(screen.getByTestId("preview-component")).toBeInTheDocument();
    });
  });

  it("displays the initial filament type as PLA", () => {
    const filamentDropdown = screen.getByTestId("filament-dropdown");
    expect(filamentDropdown).toHaveValue("PLA");
  });

  it("updates filament selection when dropdown value changes", async () => {
    const filamentDropdown = screen.getByTestId("filament-dropdown");
    fireEvent.change(filamentDropdown, { target: { value: "PETG" } });
    expect(filamentDropdown).toHaveValue("PETG");
  });

  it("passes selected filament to ColorPicker", () => {
    const colorPicker = screen.getByTestId("color-picker");
    expect(colorPicker).toHaveTextContent("Color Picker for PLA");
  });

  it("updates ColorPicker filamentType when filament selection changes", async () => {
    const filamentDropdown = screen.getByTestId("filament-dropdown");
    fireEvent.change(filamentDropdown, { target: { value: "PETG" } });

    await waitFor(() => {
      const colorPicker = screen.getByTestId("color-picker");
      expect(colorPicker).toHaveTextContent("Color Picker for PETG");
    });
  });

  it("renders Add to cart button", () => {
    const addToCartButton = screen.getByRole("button", { name: "Add to cart" });
    expect(addToCartButton).toBeInTheDocument();
  });
});
