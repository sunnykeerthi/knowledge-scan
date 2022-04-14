import { useState } from "react";
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
const Showdata = () => {
  const [csvFile, setCsvFile] = useState();
  const [csvArray, setCsvArray] = useState([]);
  const [keys, setKeys] = useState([]);
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
    setKeys(Object.keys(nArray.length ? nArray[0] : {}));
    setCsvArray(nArray.filter((o) => Object.keys(o).length));
  };

  const submit = () => {
    const file = csvFile;
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      processCSV(text);
    };
    reader.readAsText(file);
  };

  const processChanges = () => {
    var rowWithSum = csvArray.map((item) => {
      let nameMatch, addressMatch, phoneMatch;
      if (
        replaceSplChars(
          item["Location Address"] +
            item["Location City"] +
            item["Location State"] +
            item["Location Zip"]
        ) ===
        replaceSplChars(
          item["Listing Address"] +
            item["Listing City"] +
            item["Listing State"] +
            item["Listing Zip"]
        )
      )
        addressMatch = "True";
      else addressMatch = "False";
      if (item["Location Phone"] === item["Listing Phone"]) phoneMatch = "True";
      else phoneMatch = "False";

      if (item["Location Name"] === item["Listing Name"]) nameMatch = "True";
      else nameMatch = "False";
      return {
        ...item,
        "Name match": nameMatch,
        "Address match": addressMatch,
        "Phone match": phoneMatch,
      };
    });
    setCsvArray(rowWithSum);
    setKeys(Object.keys(rowWithSum.length ? rowWithSum[0] : {}));
  };

  const replaceSplChars = (data) => {
    return data.toLowerCase().replaceAll(/[^a-zA-Z0-9 ]/g, "");
  };
  return (
    <div id="formWrapper">
      <form id="csv-form">
        <input
          type="file"
          accept=".csv"
          id="csvFile"
          onChange={(e) => {
            setCsvFile(e.target.files[0]);
          }}
        />
        <button
          onClick={(e) => {
            e.preventDefault();
            if (csvFile) submit();
          }}
        >
          Upload your csv
        </button>
      </form>
      <button
        onClick={(e) => {
          e.preventDefault();
          processChanges();
        }}
      >
        Process Changes
      </button>
      {csvArray.length >= 1 && (
        <table>
          <thead>
            <tr>
              {keys.map((item, idx) => (
                <th key={idx}>{item}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {csvArray.map((item, idx) => (
              <tr key={idx}>
                {keys.map((key, idx) => (
                  <td>{item[key]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Showdata;
