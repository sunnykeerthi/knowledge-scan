import LoadFiles from "./LoadFiles";
import { StyledEngineProvider } from "@mui/material/styles";
import "./App.scss";

function App() {
  return (
    <div className="App">
      <StyledEngineProvider injectFirst>
        <LoadFiles></LoadFiles>
      </StyledEngineProvider>
    </div>
  );
}

export default App;
