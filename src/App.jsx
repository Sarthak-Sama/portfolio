// App.jsx
import React, { useEffect } from "react";
import HomePage from "./pages/HomePage";
import { Route, Routes } from "react-router-dom";
import ProjectDets from "./pages/ProjectDets";
import Cursor from "./components/partials/Cursor";

function App({ onLoad }) {
  useEffect(() => {
    // Signal to the parent that the main content is loaded
    if (onLoad) {
      onLoad();
    }
  }, [onLoad]);

  return (
    <div className="w-[100vw] h-[100vh]">
      <Cursor />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/projects/:id" element={<ProjectDets />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </div>
  );
}

export default App;
