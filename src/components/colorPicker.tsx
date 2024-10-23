import { useEffect } from "react";
import { Radio, RadioGroup } from "@headlessui/react"; 
import { ColorsResponse } from "../interfaces";
// const BASE_URL = import.meta.env.VITE_BASE_URL;
const BASE_URL = "https://3dprinter-web-api.benhalverson.workers.dev";

import { useColorStore } from "../store/colorStore";


const ColorPicker: React.FC<Props> = ({filamentType}) => {
  const url = new URL(`${BASE_URL}/colors`);
  const {colorOptions, isLoading, setIsLoading, color, setColorOptions, setColor} = useColorStore();

  const fetchColors = async (filamentType?: string) => {

    if(filamentType) {
      url.searchParams.set("filamentType", filamentType);
    }
    const response = await fetch(url.toString());
    setColorOptions(await (response.json() as Promise<ColorsResponse[]>));
    return response

  };

  useEffect(() => {
    if(filamentType) {

    setIsLoading(true);
    fetchColors(filamentType); 
    }
    setIsLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filamentType]);
  

  if (isLoading) return <div>Loading...</div>;
  // if (error) return <div>No data available</div>;

  console.log('colorOptions', colorOptions);
  console.log('color', color)
  return (
    <fieldset aria-label="Choose a color" className="mt-2">
      <RadioGroup
        value={color}
        onChange={setColor}
        className="flex items-center space-x-3"
      >
        {colorOptions?.map((color, i) => (
          <Radio
            key={i}
            value={color.hexColor}
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
                  className={`h-8 w-8 rounded-full border border-black border-opacity-10`}
                  style={{ backgroundColor: `#${color.hexColor}` }}
                />
                <span className="sr-only">{color.colorTag}</span>
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
}

export default ColorPicker;

interface Props {
  filamentType: string;
}