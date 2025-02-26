import React from "react";

function Loader() {
  return (
    <div className="bg-black relative w-screen h-screen overflow-hidden flex flex-col items-center justify-center">
      <video
        className="h-[25rem] mb-20"
        src="/loaders/loader2.mp4"
        autoPlay
        loop
        muted
      ></video>
      <h2 className="text-2xl md:text-xl sm:text-lg text-white absolute left-1/2 text-center -translate-x-1/2 bottom-20  font-['kollektif']! ">
        fetching info...
      </h2>
    </div>
  );
}

export default Loader;
