import { useState } from "react";
import RenderTable from "./RenderTable";

const LoadFiles = () => {
  const [files, setFiles] = useState([]);
  const [processChanges, setProcessChanges] = useState(false);
  const handleChange = async (e) => {
    let files = Array.from(e.target.files).map((file) => {
      let reader = new FileReader();
      return new Promise((resolve) => {
        reader.onload = () => resolve(reader.result);
        reader.readAsText(file);
      });
    });
    let res = await Promise.all(files);
    setFiles(res);
  };

  const processData = (e) => {
    setProcessChanges(true);
  };

  return (
    <div>
      <input type="file" multiple onChange={(e) => handleChange(e)} />
      <input
        type="button"
        value="Submit Data"
        onClick={(e) => processData(e)}
      />
      {files.length >= 1 &&
        [...files].map((item, idx) => (
          <RenderTable
            key={idx}
            isProcessChange={processChanges}
            csvData={item}
          />
        ))}
    </div>
  );
};

export default LoadFiles;
