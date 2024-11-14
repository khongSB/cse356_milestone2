import { useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { VideoPlayerPage } from "./components/VideoPlayerPage2";
import { Upload } from "./components/Upload";
import { Login } from "./components/Login";
import { HomePage } from "./components/HomePage";
function App() {
  return (
    <BrowserRouter basename="/">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/play/:file" element={<VideoPlayerPage2 />} />\
      </Routes>
    </BrowserRouter>
  );
}

export default App;
