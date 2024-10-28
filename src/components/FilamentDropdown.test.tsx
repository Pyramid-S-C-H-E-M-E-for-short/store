import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import FilamentDropdown from "../components/FilamentDropdown";

describe("FilamentDropdown Component", () => {
  it("renders with the correct initial value", () => {
    render(
      <FilamentDropdown selectedFilament="PLA" setSelectedFilament={() => {}} />
    );

    const dropdown = screen.getByRole("combobox");
    expect(dropdown).toBeInTheDocument();
    expect(dropdown).toHaveValue("PLA");
  });

  it("calls setSelectedFilament with the correct value on change", async () => {
    const mockSetSelectedFilament = vi.fn();

    render(
      <FilamentDropdown
        selectedFilament="PLA"
        setSelectedFilament={mockSetSelectedFilament}
      />
    );

    const dropdown = screen.getByRole("combobox");

    // Change the selected filament to "PETG"
    await userEvent.selectOptions(dropdown, "PETG");

    expect(mockSetSelectedFilament).toHaveBeenCalledWith("PETG");
    expect(mockSetSelectedFilament).toHaveBeenCalledTimes(1);
  });

  it("renders all dropdown options", () => {
    render(
      <FilamentDropdown selectedFilament="PLA" setSelectedFilament={() => {}} />
    );

    const options = screen.getAllByRole("option");
    expect(options).toHaveLength(2);
    expect(options[0]).toHaveValue("PLA");
    expect(options[1]).toHaveValue("PETG");
  });
});
