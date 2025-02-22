import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { Slider, IconButton, MenuItem, Select, FormControl, InputLabel, TextField } from "@mui/material";
import DownloadIcon from '@mui/icons-material/Download';
import SettingsIcon from '@mui/icons-material/Settings';
import { toPng } from 'html-to-image';
import ColorPicker from '@rc-component/color-picker';  // #new#
import '@rc-component/color-picker/assets/index.css';  // #new#

const countryData = {
  NL: 6.2,
  BD: 5.4,
  GB: 1.8,
  US: 2.3,
  IN: 2.5,
  PK: 3.5,
};

const Flag = ({ country, waterLevel, blueShade }) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 200 });
  const flagUrl = `https://flagcdn.com/w1280/${country.toLowerCase()}.png`;

  const handleImageLoad = (e) => {
    const aspectRatio = e.target.naturalWidth / e.target.naturalHeight;
    setDimensions({
      width: 200 * aspectRatio,
      height: 200,
    });
  };

  const handleDownload = () => {
    const flagElement = document.getElementById(`flag-content-${country}`);
    toPng(flagElement, { quality: 1, pixelRatio: 2 })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = `${country}-flag-${waterLevel}m.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch((error) => {
        console.error('oops, something went wrong!', error);
      });
  };

  const percentSubmerged = Math.min(countryData[country] * waterLevel, 100);

  return (
    <div className="flag-container" style={{ width: dimensions.width + 20, height: dimensions.height + 40 }}>
      <div id={`flag-content-${country}`} className="flag-content" style={{ width: dimensions.width, height: dimensions.height }}>
        <img src={flagUrl} alt={`${country} flag`} onLoad={handleImageLoad} className="flag-image" />
        <div className="blue-stripe" style={{ height: `${percentSubmerged}%`, backgroundColor: blueShade }}></div>
      </div>
      <div className="flag-footer">
        <span className="country-code">{country}</span>
        <IconButton onClick={handleDownload} aria-label="download" className="download-button">
          <DownloadIcon />
        </IconButton>
      </div>
    </div>
  );
};

function App() {
  const [waterLevel, setWaterLevel] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [blueShade, setBlueShade] = useState("#6699CC");
  const [customBlueShade, setCustomBlueShade] = useState("#6699CC");

  const handleSettingsToggle = () => {
    setSettingsOpen(!settingsOpen);
  };

  const handleBlueShadeChange = (event) => {
    const value = event.target.value;
    if (value === "custom") {
      setBlueShade(customBlueShade);
    } else {
      setBlueShade(value);
    }
  };

  const handleCustomBlueShadeChange = (color) => {  // #new#
    setCustomBlueShade(color.hex);  // #new#
    setBlueShade(color.hex);  // #new#
  };

  const marks = [
    { value: 0, label: '0m' },
    { value: 2, label: '2m' },
    { value: 4, label: '4m' },
    { value: 6, label: '6m' },
    { value: 8, label: '8m' },
    { value: 10, label: '10m' },
  ];

  return (
    <div className="app">
      <div className="settings-icon">
        <IconButton onClick={handleSettingsToggle} aria-label="settings">
          <SettingsIcon />
        </IconButton>
      </div>
      {settingsOpen && (
        <div className="settings-tab">
          <FormControl fullWidth>
            <InputLabel id="blue-shade-label">Blue Shade</InputLabel>
            <Select
              labelId="blue-shade-label"
              value={blueShade === customBlueShade ? "custom" : blueShade}
              label="Blue Shade"
              onChange={handleBlueShadeChange}
            >
              <MenuItem value="#6699CC">Light Blue</MenuItem>
              <MenuItem value="#336699">Medium Blue</MenuItem>
              <MenuItem value="#003366">Dark Blue</MenuItem>
              <MenuItem value="custom">Custom</MenuItem>
            </Select>
          </FormControl>
          {blueShade === "custom" && (
            <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'center' }}>  // Adjusted style
              <ColorPicker
                value={customBlueShade}
                onChange={handleCustomBlueShadeChange}
              />
            </div>
          )}
        </div>
      )}
      <h1>Future Flags of The Submerged Nations</h1>
      <p className="paragraph">Move the slider to see the impact of sea-level rise on flags. The blue stripe represents the percentage of the country submerged under water due to melting ice caps.</p>
      <div className="slider-container">
        <Slider
          min={0}
          max={10}
          step={0.1}
          value={waterLevel}
          onChange={(e, newValue) => setWaterLevel(newValue)}
          aria-label="Water Level Slider"
          marks={marks}
        />
      </div>
      <div className="flags-container">
        {Object.keys(countryData).map((country) => (
          <Flag key={country} country={country} waterLevel={waterLevel} blueShade={blueShade} />
        ))}
      </div>
    </div>
  );
}

const rootElement = document.getElementById("root");
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
} else {
  console.error("Root element not found");
}