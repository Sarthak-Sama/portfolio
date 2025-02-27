import React from "react";
import { Link } from "react-router-dom";

function ProjectCard({ project, category }) {
  return (
    <div className="w-[100%] md:w-[47%] text-zinc-800 p-5 aspect-square rounded-lg bg-neutral-200 flex flex-col justify-between">
      <h3 className="">{project.name}</h3>
      <img src={project?.imageSrc}></img>
      <p className="text-sm mt-1">{project.desc}</p>
      <div className="flex items-center justify-between">
        <Link
          to={`/projects/${project.id}`}
          className={`
            ${
              category === "Frontend" || project.name === "NSFW Detector"
                ? "hidden"
                : "block"
            }
          relative w-[49%]
          overflow-hidden 
          rounded-lg 
          px-6 py-1 mt-2
          text-lg 
          font-medium 
          text-zinc-300 
          hover:text-zinc-200 
          flex 
          justify-center
        `}
          style={{
            background:
              "linear-gradient(to bottom, rgb(39 39 42), rgb(24 24 27))",
            boxShadow:
              "inset 0 -2px 4px 1px rgba(0,0,0,0.4), inset 0 2px 2px 1px rgba(255,255,255,0.1)",
            transition: "all 200ms ease-out",
          }}
        >
          details
        </Link>
        <a
          className={`
          relative ${
            category === "Frontend" || project.name === "NSFW Detector"
              ? "w-full"
              : "w-[49%]"
          }
          overflow-hidden 
          rounded-lg 
          px-6 py-1 mt-2
          text-lg 
          font-medium 
          text-zinc-300 
          hover:text-zinc-200 
          flex 
          justify-center
        `}
          style={{
            background:
              "linear-gradient(to bottom, rgb(39 39 42), rgb(24 24 27))",
            boxShadow:
              "inset 0 -2px 4px 1px rgba(0,0,0,0.4), inset 0 2px 2px 1px rgba(255,255,255,0.1)",
            transition: "all 200ms ease-out",
          }}
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          visit
        </a>
      </div>
    </div>
  );
}

export default ProjectCard;
