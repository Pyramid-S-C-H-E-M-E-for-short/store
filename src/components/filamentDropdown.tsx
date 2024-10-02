import React from 'react'

const FilamentDropdown: React.FC<Props> = ({selectedFilament, setSelectedFilament}) => {

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFilament(event.target.value);
  };

  return (<div>
    <select id="filamentType" onChange={handleChange} value={selectedFilament}>
      <option value="PLA">PLA</option>
      <option value="PETG">PETG</option>
    </select>
  </div>)
}
export default FilamentDropdown

interface Props {
  selectedFilament: string;
  setSelectedFilament: (value: string) => void;
}