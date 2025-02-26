import React, { useEffect, useState } from "react";
import { motion } from "motion/react";

function Cursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: e.clientX - 17.5, // Half of new size (35px)
        y: e.clientY - 17.5,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <motion.div
      className="hidden sm:block sm:fixed pointer-events-none z-50  mix-blend-difference"
      animate={{
        x: mousePosition.x,
        y: mousePosition.y,
        rotate: 360,
      }}
      transition={{
        rotate: {
          duration: 3,
          repeat: Infinity,
          ease: "linear",
        },
        x: {
          type: "tween",
          duration: 0,
          ease: "linear",
        },
        y: {
          type: "tween",
          duration: 0,
          ease: "linear",
        },
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
        style={{ height: "35px", width: "35px" }} // Reduced from 50px
      >
        <g style={{ transform: "translate(0,0)" }}>
          <path
            d="M324.52 191.715a97.542 97.542 0 0 0-4.228-4.229L256 22.303l-64.291 165.183a93.225 93.225 0 0 0-4.222 4.224L22.301 255.998l165.179 64.291a97.542 97.542 0 0 0 4.229 4.229L256 489.697l64.284-165.174a95.208 95.208 0 0 0 4.237-4.233l165.178-64.287zM256 297.773c-23.067 0-41.77-18.705-41.77-41.775 0-23.067 18.703-41.767 41.77-41.767 23.068 0 41.767 18.7 41.767 41.767 0 23.07-18.7 41.775-41.767 41.775z"
            fill="#fff"
            fillOpacity="1"
          />
        </g>
      </svg>
    </motion.div>
  );
}

export default Cursor;
