// TODO: implent the transformData function that takes in an array of RawDataEntry objects and from manf and returns structured json for backend endpoint. 
// Define the structure of a color entry
interface ColorEntry {
  color: string;
  hexColor: string;
  colorTag: string;
}

// Define the raw data structure
interface RawDataEntry {
  filament: string;
  hexColor: string;
  colorTag: string;
}

// Define the structure of the transformed output
interface TransformedData {
  [key: string]: ColorEntry[];
}

export const rawData: RawDataEntry[] = [
  { filament: "PETG WHITE", hexColor: "f6efef", colorTag: "petgWhite" },
  { filament: "PETG BLACK", hexColor: "000000", colorTag: "petgBlack" },
  { filament: "PLA BLACK", hexColor: "000000", colorTag: "black" },
  { filament: "PLA GRAY", hexColor: "666666", colorTag: "gray" },
  { filament: "PLA WHITE", hexColor: "ffffff", colorTag: "white" },
  { filament: "PLA YELLOW", hexColor: "f5c211", colorTag: "yellow" },
  { filament: "PLA RED", hexColor: "f91010", colorTag: "red" },
  { filament: "PLA GOLD", hexColor: "d5b510", colorTag: "gold" },
  { filament: "PLA LUNAR REGOLITH", hexColor: "7d7e7e", colorTag: "lunarRegolith" },
  { filament: "PLA MATTE BLACK", hexColor: "000000", colorTag: "matteBlack" }
];

export const transformData = (data: RawDataEntry[]): TransformedData[] => {
  const filamentMap: TransformedData = {};

  data.forEach((item) => {
    const [type, color] = item.filament.split(' '); // Split filament into type and color

    const colorEntry: ColorEntry = {
      color: color.toUpperCase(), // Capitalize color name
      hexColor: item.hexColor,
      colorTag: item.colorTag,
    };

    // If the filament type doesn't exist, initialize it
    if (!filamentMap[type]) {
      filamentMap[type] = [];
    }

    console.log(filamentMap);
    // Push the color entry to the corresponding filament type
    filamentMap[type].push(colorEntry);
  });

  // Convert the map into an array of objects, sorted by PLA first, PETG second
  return Object.entries(filamentMap)
    .sort(([keyA], [keyB]) => {
      if (keyA === 'PLA') return -1;
      if (keyB === 'PLA') return 1;
      return keyA.localeCompare(keyB); // Sort alphabetically otherwise
    })
    .map(([filamentType, colors]) => ({
      [filamentType]: colors,
    }));
};