import { useEffect, useState } from "react";
import RenderTable from "./RenderTable";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
const fields = [
  "Link ID",
  "Publisher",
  "Location Name",
  "Location Address",
  "Location Phone",
  "Listing Name",
  "Listing Address",
  "Listing Phone",
  "Name match",
  "Address match",
  "Phone match",
];
const Load = () => {
  const [files, setFiles] = useState([]);
  const [allData, setAllData] = useState([]);
  const [isDone, setIsDone] = useState(false);
  const [processingData, setProcessingData] = useState(false);
  const [value, setValue] = useState("1");
  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const processCSV = (str, delim = ",") => {
    const headers = str.slice(0, str.indexOf("\n")).split(delim);
    const rows = str.slice(str.indexOf("\n") + 1, str.length - 1).split("\n");
    let nArray = rows.map((row) => {
      const values = row.split(delim);
      const eachObj = headers.reduce((obj, header, i) => {
        if (fields.includes(header)) obj[header] = values[i];
        return obj;
      }, {});
      return eachObj;
    });
    createKeys(nArray);
  };

  const createKeys = async (data) => {
    const dataToSet = {
      keys: Object.keys(data.length ? data[0] : {}),
      values: data.filter((o) => Object.keys(o).length),
    };
    setAllData((prev) => [...prev, dataToSet]);
  };

  useEffect(() => {
    if (
      (files.length >= 1 && files.length === allData.length && !isDone) ||
      processingData
    ) {
      setIsDone(true);
    }
  }, [allData, isDone, files, processingData]);

  const handleUpload = (e) => {
    Array.from(files).forEach((file) => {
      const currFile = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        processCSV(text);
      };
      reader.readAsText(currFile);
    });
  };

  const handleChange = (e) => {
    e.preventDefault();
    setFiles(e.target.files);
  };

  const processData = (e) => {
    var currData = allData;
    setAllData([]);
    currData.forEach((item) => {
      let rowWithSum = item.values.map((item1) => {
        let nameMatch, addressMatch, phoneMatch;
        if (
          replaceSplChars(
            item1["Location Address"] +
              item1["Location City"] +
              item1["Location State"] +
              item1["Location Zip"]
          ) ===
          replaceSplChars(
            item1["Listing Address"] +
              item1["Listing City"] +
              item1["Listing State"] +
              item1["Listing Zip"]
          )
        )
          addressMatch = "True";
        else addressMatch = "False";
        if (item1["Location Phone"] === item1["Listing Phone"])
          phoneMatch = "True";
        else phoneMatch = "False";

        if (item1["Location Name"] === item1["Listing Name"])
          nameMatch = "True";
        else nameMatch = "False";
        return {
          ...item1,
          "Name match": nameMatch,
          "Address match": addressMatch,
          "Phone match": phoneMatch,
        };
      });
      createKeys(rowWithSum);
      setProcessingData(true);
    });
  };

  const replaceSplChars = (data) => {
    return data.toLowerCase().replaceAll(/[^a-zA-Z0-9 ]/g, "");
  };

  const changeColor = () => {
    const fWrapper = document.getElementsByTagName("body")[0];
    fWrapper.classList.toggle("dark");
  };

  return (
    <div id="formWrapper">
      <div id="centerContent">
        <div class="toggleContainer">
          <label className="switch">
            <input type="checkbox" onChange={(e) => changeColor(e)} />
            <span className="slider round"></span>
          </label>
        </div>

        <form id="csv-form">
          <input
            type="file"
            accept=".csv"
            id="csvFile"
            multiple
            onChange={(e) => handleChange(e)}
          />
          <button
            onClick={(e) => {
              e.preventDefault();
              handleUpload();
            }}
          >
            Upload your csv
          </button>
        </form>
        <button
          className="processData"
          onClick={(e) => {
            e.preventDefault();
            processData();
          }}
        >
          Processdata
        </button>
      </div>
      {isDone && allData.length >= 1 && (
        <TabContext value={value}>
          <TabList onChange={handleTabChange}>
            {files.length >= 1 &&
              [...files].map((item1, idx) => (
                <Tab label={`Label ${idx + 1}`} value={`${idx + 1}`} />
              ))}
          </TabList>
          {files.length >= 1 &&
            [...allData].map((item1, idx) => (
              <TabPanel value={`${idx + 1}`}>
                <RenderTable
                  keys={item1.keys}
                  csvArray={item1.values}
                ></RenderTable>
              </TabPanel>
            ))}
        </TabContext>
      )}
    </div>
  );
};

export default Load;
