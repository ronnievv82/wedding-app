import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PhotoBooth from "./PhotoBooth";
import Gallery from "./components/Gallery";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PhotoBooth />} />
        <Route path="/gallery" element={<Gallery />} />
      </Routes>
    </Router>
  );
}

export default App;
