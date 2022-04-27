import { useEffect, useState } from "react";
import RenderTable from "./RenderTable";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

const fields = [
  "Link ID",
  "Publisher ID",
  "Listing ID",
  "Location ID",
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
  "Match Status",
];

const Load = () => {
  const [files, setFiles] = useState([]);
  const [allData, setAllData] = useState([]);
  const [isDone, setIsDone] = useState(false);
  const [processingData, setProcessingData] = useState(false);
  const [value, setValue] = useState("1");
  const [csvArray, setCsvArray] = useState([]);
  const [currIndex, setCurrIndex] = useState(0);
  const [fileNum, setFileNum] = useState();
  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const processCSV = (str, fileName, delim = ",") => {
    const headers = str.slice(0, str.indexOf("\n")).split(delim);
    const rows = str.slice(str.indexOf("\n") + 1, str.length - 1).split("\n");
    let nArray = rows.map((row) => {
      const values = row.split(delim);
      const eachObj = headers.reduce((obj, header, i) => {
        obj[header] = values[i];
        return obj;
      }, {});
      return eachObj;
    });
    createKeys(nArray, fileName);
  };

  const createKeys = async (data, fileName) => {
    const dataToSet = {
      fileName: fileName,
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

  useEffect(() => {
    if (allData.length >= 1) {
      let currArr = allData;
      currArr[fileNum].values = csvArray;
      setAllData(currArr);
    }
  }, [csvArray]);

  const handleUpload = (e) => {
    Array.from(files).forEach((file) => {
      const currFile = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        processCSV(text, file.name.split(".").slice(0, -1).join("."));
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
        let nameMatch, addressMatch, phoneMatch, botSuggest;
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
        let arr = [nameMatch, addressMatch, phoneMatch];
        botSuggest =
          arr.filter((x) => x.toLowerCase() === "true").length >= 2
            ? "yes"
            : "no";

        return {
          ...item1,
          "Name match": nameMatch,
          "Address match": addressMatch,
          "Phone match": phoneMatch,
          "Match Status": botSuggest,
        };
      });
      createKeys(rowWithSum, item.fileName);
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
  const csvLink = () => {
    allData.forEach((parent) => {
      let nMap = [];
      parent.values.forEach((item) => {
        let obj = {
          locationId: item["Location ID"],
          partnerId: item["Publisher ID"],
          listingId: item["Location ID"],
          override: item["Match Status"],
        };
        nMap.push(obj);
      });
      getCSV(nMap, parent.fileName);
    });
  };

  const getCSV = (object, fileName) => {
    let csv = Object.entries(Object.entries(object)[0][1])
      .map((e) => e[0])
      .join(",");
    for (const [k, v] of Object.entries(object)) {
      csv += "\r\n" + Object.values(v).join(",");
    }
    let j = document.createElement("a");
    j.download = fileName + ".csv";
    j.href = URL.createObjectURL(new Blob([csv]));
    j.click();
  };

  return (
    <div id="formWrapper">
      <div id="centerContent">
        <div className="toggleContainer">
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
        <button
          onClick={(e) => {
            e.preventDefault();
            csvLink();
          }}
        >
          Export to CSV
        </button>
      </div>
      {isDone && allData.length >= 1 && (
        <TabContext value={value}>
          <TabList onChange={handleTabChange}>
            {files.length >= 1 &&
              [...allData].map((item1, idx) => (
                <Tab label={item1.fileName} value={`${idx + 1}`} />
              ))}
          </TabList>
          {files.length >= 1 &&
            [...allData].map((item1, idx) => (
              <TabPanel value={`${idx + 1}`}>
                <RenderTable
                  csvArray={item1.values}
                  setCsvArray={setCsvArray}
                  fileNum={idx}
                  setFileNum={setFileNum}
                  setCurrIndex={setCurrIndex}
                ></RenderTable>
              </TabPanel>
            ))}
        </TabContext>
      )}
    </div>
  );
};

export default Load;
