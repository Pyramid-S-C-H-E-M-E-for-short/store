import React, { createContext, useContext, useReducer, ReactNode } from "react";
import { ColorsResponse } from "../interfaces";

interface ColorState {
  colorOptions: ColorsResponse[];
  color: string;
  isLoading: boolean;
  hasInitialized: boolean; // Track if the initial color has been set
}

type ColorAction =
  | { type: "SET_COLOR_OPTIONS"; payload: ColorsResponse[] }
  | { type: "SET_COLOR"; payload: string }
  | { type: "SET_IS_LOADING"; payload: boolean };

const initialState: ColorState = {
  colorOptions: [],
  color: "",
  isLoading: false,
  hasInitialized: false, // Initialize as false
};

const ColorContext = createContext<{
  state: ColorState;
  dispatch: React.Dispatch<ColorAction>;
}>({
  state: initialState,
  dispatch: () => null,
});

const colorReducer = (state: ColorState, action: ColorAction): ColorState => {
  switch (action.type) {
    case "SET_COLOR_OPTIONS":
      return {
        ...state,
        colorOptions: action.payload,
        // Only set color initially if not already initialized
        color: !state.hasInitialized && action.payload.length > 0 ? action.payload[0].hexColor : state.color,
        hasInitialized: true,
      };
    case "SET_COLOR":
      return { ...state, color: action.payload };
    case "SET_IS_LOADING":
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
};

export const ColorProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(colorReducer, initialState);

  return (
    <ColorContext.Provider value={{ state, dispatch }}>
      {children}
    </ColorContext.Provider>
  );
};

export const useColorContext = () => useContext(ColorContext);
