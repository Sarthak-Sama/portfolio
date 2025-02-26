import React, { useState, useEffect } from "react";

function Grid({ openState }) {
  const [dimensions, setDimensions] = useState({
    rows: 0,
    columns: 0,
  });

  const updateGrid = () => {
    setDimensions({
      rows: Math.floor((document.body.clientHeight / 25) * 3),
      columns: Math.floor((document.body.clientWidth / 50) * 3.2),
    });
  };

  useEffect(() => {
    updateGrid();
    window.addEventListener("resize", updateGrid);

    return () => window.removeEventListener("resize", updateGrid);
  }, []);

  return (
    <div className="relative">
      {/* Mask container */}
      <div
        className="absolute inset-0 bg-radial-mask pointer-events-none z-10"
        style={{
          maskImage:
            "radial-gradient(circle at center, black 30%, transparent 70%)",
          WebkitMaskImage:
            "radial-gradient(circle at center, black 30%, transparent 70%)",
        }}
      />

      {/* Grid content */}
      <div className="absolute scale-[1.5] inset-0 inset-x-[-500px] w-[200vw] h-[200vh]">
        {[...Array(dimensions.rows)].map((_, rowIndex) => (
          <div key={`row-${rowIndex}`} className="flex">
            {[...Array(dimensions.columns)].map((_, colIndex) => (
              <div
                key={`tile-${rowIndex}-${colIndex}`}
                className="border border-[0.1px] border-white/10"
                style={{
                  width: openState === "about me" ? "25px" : "50px",
                  height: "25px",
                }}
              />
            ))}
          </div>
        ))}

        {/* Vertex content */}
        <div className="absolute inset-0">
          {[...Array(dimensions.rows + 1)].map((_, rowIndex) =>
            [...Array(dimensions.columns + 1)].map((_, colIndex) => (
              <>
                <div
                  key={`horizontol-bar-${rowIndex}-${colIndex}`}
                  className="absolute w-2 h-[1px] -translate-x-1/2 -translate-y-[100%] opacity-50 bg-white rounded-full"
                  style={{
                    top: `${rowIndex % 2 === 0 ? rowIndex * 50 : 0}px`,
                    left: `${colIndex % 2 === 0 ? colIndex * 50 : 0}px`,
                  }}
                />
                <div
                  key={`vertical-bar-${rowIndex}-${colIndex}`}
                  className="absolute w-[1px] h-2 -translate-y-1/2 -translate-x-[100%]  bg-gray-400 rounded-full"
                  style={{
                    top: `${rowIndex % 2 === 0 ? rowIndex * 50 : 0}px`,
                    left: `${colIndex % 2 === 0 ? colIndex * 50 : 0}px`,
                  }}
                />
              </>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Grid;
