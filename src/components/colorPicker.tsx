import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Radio, RadioGroup } from "@headlessui/react"; 
import Dexie from "dexie";
import { ColorsResponse } from "../interfaces";
const BASE_URL = "https://3dprinter-web-api.benhalverson.workers.dev";
const db = new Dexie("ColorCacheDB");
db.version(1).stores({
  colors: "filamentType, colors", // Using filamentType as the key
});

const ColorPicker: React.FC<Props> = ({filamentType}) => {
  const url = new URL(`${BASE_URL}/colors`);

  const fetchColors = async (filamentType: string) => {

    const cacheData = await db.table("colors").get(selectedColor);
    if(cacheData) {
      console.log('cacheData', cacheData);
      return cacheData.colors;
    }

    if(filamentType) {
      url.searchParams.set("filamentType", filamentType);
    }
    const response = await fetch(url.toString());
    const data = await response.json() //as Promise<ColorsResponse[]>;

    await db.table("colors").put({filamentType, colors: data});
    return data;

  };

  const useColors = (filamentType: string) => {
    return useQuery<ColorsResponse[]>({
      queryKey: ["colors", filamentType],
      queryFn: () => fetchColors(filamentType)
    });

  };

  const { data, error, isLoading } = useColors(filamentType);

  const [selectedColor, setSelectedColor] = useState<string>("");

  useEffect(() => {
    if (data ) {
      setSelectedColor(data[0]?.colorTag); // Default to the first color
    }
  }, [data]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>No data available</div>;

  return (
    <fieldset aria-label="Choose a color" className="mt-2">
      <RadioGroup
        value={selectedColor}
        onChange={setSelectedColor}
        className="flex items-center space-x-3"
      >
        {data?.map((color) => (
          <Radio
            key={color.colorTag}
            value={color.colorTag}
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