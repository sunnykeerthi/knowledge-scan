import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
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
const RenderTable = ({
  csvArray,
  setCsvArray,
  setCurrIndex,
  fileNum,
  setFileNum,
}) => {
  const [csvArrayState, setCsvArrayState] = useState(csvArray);
  const handleBlur = (e) => {
    e.currentTarget.classList.add("noBorder");
    e.currentTarget.classList.remove("border");
    setCsvArray([...csvArrayState]);
    setFileNum(fileNum);
  };

  useEffect(() => {
    setCsvArrayState(csvArray);
  }, [csvArray]);

  const handleChange = (e) => {
    e.preventDefault();
    e.currentTarget.readOnly = false;
    e.currentTarget.classList.remove("noBorder");
    e.currentTarget.classList.add("border");
  };

  function getHeadings(data) {
    return Object.keys(data[0]).map((key) => {
      if (fields.includes(key)) return <TableCell>{key}</TableCell>;
    });
  }

  // `map` over the data to return
  // row data, passing in each mapped object
  // to `getCells`
  function getRows(data) {
    return data.map((obj, idx) => {
      return (
        <TableRow>
          {Object.keys(obj).map((key) => {
            if (fields.includes(key)) {
              return getCells(obj[key], idx, key);
            }
          })}
        </TableRow>
      );
    });
  }

  // Return an array of cell data using the
  // values of each object
  function getCells(currCell, i, key) {
    return key === "Match Status" ? (
      <TableCell>
        <input
          className="noBorder"
          type="true"
          value={csvArrayState[i]["Match Status"]}
          onChange={(e) => {
            const updatedRankFields = csvArrayState.map((r, rIdx) => {
              if (rIdx === i) {
                return { ...r, "Match Status": e.target.value };
              } else {
                return r;
              }
            });
            setCurrIndex(i)
            setCsvArrayState(updatedRankFields);
          }}
          onBlur={(e) => handleBlur(e)}
          onClick={(e) => handleChange(e)}
        ></input>
      </TableCell>
    ) : (
      <TableCell>{currCell}</TableCell>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>{getHeadings(csvArrayState)}</TableRow>
        </TableHead>

        <TableBody>{getRows(csvArrayState)}</TableBody>
      </Table>
    </TableContainer>
  );
};

export default RenderTable;
