import { useState } from "react";
import RenderTable from "./RenderTable";

const ShowData1 = () => {
  const [dataToSend, setDataToSend] = useState([]);
  const [doIt, setDoIt] = useState(false);
  const handleChange = (e) => {
    Array.from(e.target.files).forEach((file) => {
      let reader = new FileReader();
      reader.onload = () => {
        setDataToSend(reader.result);
        setDoIt(true);
      };
      reader.readAsText(file);
    });
  };
  return (
    <div>
      <input
        type="file"
        name="files"
        multiple
        onChange={(e) => handleChange(e)}
      />
      {doIt === true && <RenderTable csvData={dataToSend}></RenderTable>}
    </div>
  );
};

export default ShowData1;
