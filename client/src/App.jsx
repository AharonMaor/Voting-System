import { Routes, Route } from "react-router-dom";

import Home from "./screens/Home";
import Navbar from "./components/Navbar";
import CoverPage from "./screens/CoverPage";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const darkTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#ff5722', // Primary color for buttons, links, etc.
    },
    secondary: {
      main: '#03a9f4', // Secondary color for accents, call-to-action buttons, etc.
    },
    background: {
      default: '#f5f5f5', // Default background color for the application
      paper: '#ffffff', // Background color for paper-like elements (cards, dialogs, etc.)
    },
    text: {
      primary: '#212121', // Default text color
      secondary: '#757575', // Secondary text color
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <div>
        <Routes>
          <Route path="/" element={<div></div>} />
          <Route path="/*" element={<Navbar />} />
        </Routes>
      </div>

      <div>
        <Routes>
          <Route path="/" element={<CoverPage />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;
