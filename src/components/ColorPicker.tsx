import { useEffect } from "react";
import { Radio, RadioGroup } from "@headlessui/react";
import { ColorsResponse } from "../interfaces";
import { useColorContext } from "../context/ColorContext";

// const BASE_URL = "https://3dprinter-web-api.benhalverson.workers.dev";
const BASE_URL = "http://localhost:8787";

const ColorPicker: React.FC<Props> = ({ filamentType }) => {
	const { state, dispatch } = useColorContext();
	const { colorOptions, isLoading, color } = state;

	useEffect(() => {
		const fetchColors = async () => {
			dispatch({ type: "SET_IS_LOADING", payload: true });
			try {
				const url = new URL(`${BASE_URL}/colors`);
				if (filamentType) url.searchParams.set("filamentType", filamentType);

				const response = await fetch(url.toString());
				const colors = (await response.json()) as ColorsResponse[];
				dispatch({ type: "SET_COLOR_OPTIONS", payload: colors });
			} catch (error) {
				console.error("Failed to fetch colors:", error);
			} finally {
				dispatch({ type: "SET_IS_LOADING", payload: false });
			}
		};

		if (filamentType) fetchColors();
	}, [filamentType, dispatch]);

	if (isLoading) return <div>Loading...</div>;

	return (
		<fieldset aria-label="Choose a color" className="mt-2">
			<RadioGroup
				value={color}
				onChange={(newColor) =>
					dispatch({ type: "SET_COLOR", payload: newColor })
				}
				className="flex items-center space-x-3"
			>
				{colorOptions
					?.filter(
						(color, index, self) =>
							color.colorTag !== "matteBlack" &&
							self.findIndex((c) => c.hexColor === color.hexColor) === index
					)
					.map((colorOption, index) => (
						<Radio
							key={`${colorOption.colorTag}-${index}`}
							value={colorOption.hexColor}
							className={({ checked }) =>
								`relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 focus:outline-none ${
									checked ? "ring-2 ring-offset-1 ring-blue-500" : ""
								}`
							}
						>
							{({ checked }) => (
								<>
									<span
										aria-hidden="true"
										aria-labelledby={colorOption.colorTag}
										className="h-8 w-8 rounded-full border border-black border-opacity-10"
										style={{ backgroundColor: `#${colorOption.hexColor}` }}
									/>
									<span className="sr-only">{colorOption.colorTag}</span>
									{checked && (
										<span
											className="absolute inset-0 rounded-full ring-2 ring-offset-2"
											aria-hidden="true"
										/>
									)}
								</>
							)}
						</Radio>
					))}
			</RadioGroup>
		</fieldset>
	);
};

export default ColorPicker;

interface Props {
	filamentType: string;
}
