// index.js
import React, { useState, Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "./index.css";
import Loader from "./components/Loader";

// Lazy load your App component
const App = lazy(() => import("./App"));

function Root() {
  const [showLoader, setShowLoader] = useState(true);

  // This callback is passed to App and called once it mounts
  const handleAppLoad = () => {
    // After a 1-second delay, remove the loader
    setTimeout(() => {
      setShowLoader(false);
    }, 1000);
  };

  return (
    <BrowserRouter>
      {/* Render the App behind the loader. Suspense fallback is null since we manage the loader ourselves */}
      <Suspense fallback={null}>
        <App onLoad={handleAppLoad} />
      </Suspense>

      {/* The loader is absolutely positioned on top of the content */}
      <AnimatePresence>
        {showLoader && (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 9999,
              background: "#fff", // Ensure the loader covers the screen
            }}
          >
            <Loader />
          </motion.div>
        )}
      </AnimatePresence>
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<Root />);
