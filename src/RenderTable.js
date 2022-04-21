import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const RenderTable = ({ csvArray, keys }) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            {keys.map((item, idx) => (
              <TableCell key={idx}>{item}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {csvArray.map((item, idx) => (
            <TableRow>
              {keys.map((key, idx) => (
                <TableCell> {item[key]} </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default RenderTable;
