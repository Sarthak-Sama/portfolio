import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  IconArrowsHorizontal,
  IconChevronLeft,
  IconChevronRight,
  IconX,
} from "@tabler/icons-react";
import { useNavigate, useParams } from "react-router-dom";
import projectsData from "../Constant/ProjectsData.json";

const getProjectById = (id) => {
  // Combine Fullstack and Extra projects into a single array
  const fullstackProjects = projectsData.find(
    (category) => category.category === "Fullstack"
  ).projects;
  const extraProjects = projectsData.find(
    (category) => category.category === "Extra"
  ).projects;
  const combinedProjects = [...fullstackProjects, ...extraProjects];

  // Find the project by id
  return combinedProjects.find((project) => project.id === Number(id));
};

const ProjectDets = () => {
  const { id } = useParams();
  const [leftWidth, setLeftWidth] = useState(50); // percentage
  const [isDragging, setIsDragging] = useState(false);
  const [isMediumOrLarger, setIsMediumOrLarger] = useState(
    window.innerWidth >= 768
  );
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsMediumOrLarger(window.innerWidth >= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleDrag = (e) => {
    if (!isDragging) return;
    const container = document.getElementById("project-container");
    const containerWidth = container.offsetWidth;
    const mouseX = e.clientX;
    const percentage = (mouseX / containerWidth) * 100;
    // Clamp between 30% and 70%
    setLeftWidth(Math.min(Math.max(percentage, 30), 60));
  };

  const projectData = getProjectById(id);
  console.log(projectData);
  const imagesArray = [projectData.imageSrc, ...projectData.secondaryImages];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  return (
    <div className="black-navbar bg-black overflow-y-auto">
      {projectData ? (
        <div
          id="project-container"
          className={`h-screen w-screen flex relative ${
            isMediumOrLarger ? "" : "flex-col"
          }`}
          onMouseMove={isMediumOrLarger ? handleDrag : null}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
        >
          {/* Left Section */}
          <motion.div
            className="h-full relative pt-10"
            animate={{ width: isMediumOrLarger ? `${leftWidth}%` : "100%" }}
            transition={{ type: "linear", duration: 0 }}
          >
            <div
              onClick={() => navigate(-1)}
              className="w-10 h-10 bg-white rounded-full absolute top-5 left-5 flex items-center justify-center opacity-50 hover:opacity-100 transition-all duration-300 ease-in-out"
            >
              <IconX className="text-black" />
            </div>

            <div className="p-8 h-full flex flex-col justify-around">
              <h1 className="text-4xl font-bold mt-6 text-zinc-300">
                {projectData.name}
              </h1>
              <div className="relative w-full aspect-[16/8.5] overflow-hidden rounded-lg shadow-xl">
                <div
                  className="w-fit h-full bg-red-200 flex transition-all duration-300 ease-in-out"
                  style={{
                    transform: `translateX(${-100 * currentImageIndex}%)`,
                  }}
                >
                  {imagesArray.map((image, i) => (
                    <img
                      key={i}
                      src={image}
                      alt={projectData.name}
                      className={`w-full h-full object-cover `}
                    />
                  ))}
                </div>
                <div
                  onClick={() => {
                    if (currentImageIndex > 0)
                      setCurrentImageIndex(currentImageIndex - 1);
                  }}
                  className={`${
                    currentImageIndex === 0 ? "hidden" : "block"
                  } absolute top-1/2 left-2 flex justify-center items-center p-[0.4rem] bg-black rounded-full opacity-60 hover:opacity-100 transition-all duration-250 ease-in-out`}
                >
                  <IconChevronLeft color="white" size={20} />
                </div>
                <div
                  onClick={() => {
                    if (currentImageIndex < imagesArray.length - 1)
                      setCurrentImageIndex(currentImageIndex + 1);
                  }}
                  className={`${
                    currentImageIndex === imagesArray.length - 1
                      ? "hidden"
                      : "block"
                  } absolute top-1/2 right-2 flex justify-center items-center p-[0.4rem] bg-black rounded-full opacity-60 hover:opacity-100 transition-all duration-250 ease-in-out`}
                >
                  <IconChevronRight color="white" size={20} />
                </div>
              </div>
              <a
                className="
          relative w-full
          overflow-hidden 
          rounded-lg 
          px-6 py-5 mt-10
          text-lg 
          font-medium 
          text-zinc-300 
          hover:text-zinc-200 
          flex 
          justify-center
        "
                style={{
                  background:
                    "linear-gradient(to bottom, rgb(39 39 42), rgb(24 24 27))",
                  boxShadow:
                    "inset 0 -2px 4px 1px rgba(0,0,0,0.4), inset 0 2px 2px 1px rgba(255,255,255,0.1)",
                  transition: "all 200ms ease-out",
                }}
                href={""}
              >
                visit
              </a>
            </div>
          </motion.div>

          {/* Draggable Divider */}
          {isMediumOrLarger && (
            <div
              className="w-1 h-full bg-white cursor-col-resize flex items-center justify-center absolute"
              style={{ left: `${leftWidth}%` }}
              onMouseDown={() => setIsDragging(true)}
            >
              <div className=" absolute flex items-center justify-center w-10 h-10 rounded-full bg-white rounded-full">
                <IconArrowsHorizontal className="text-black" stroke={1.5} />
              </div>
            </div>
          )}

          {/* Right Section */}
          <motion.div
            className="black-navbar h-full min-h-[40vh] text-[#EDEDED] overflow-y-auto"
            animate={{
              width: isMediumOrLarger ? `${100 - leftWidth}%` : "100%",
            }}
            transition={{ type: "linear", duration: 0 }}
          >
            <div className="p-8 space-y-8 ">
              <section>
                <h2 className="text-2xl font-bold mb-4 font-['kollektif']!">
                  Technologies
                </h2>
                <div className="flex gap-2 flex-wrap">
                  {projectData.techs.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-white/10 rounded-full text-sm font-['kollektif']!"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold  mb-4 font-['kollektif']!">
                  Features
                </h2>
                <ul className="list-disc list-inside space-y-2">
                  {projectData.features.map((feature) => (
                    <li key={feature} className="font-['kollektif']!">
                      {feature}
                    </li>
                  ))}
                </ul>
              </section>
              <section>
                <h2 className="text-2xl font-bold mb-4 font-['kollektif']!">
                  New Challenges Faced
                </h2>
                <div>
                  {projectData.challenges.map((challenge, i) => (
                    <div className="flex w-full" key={i}>
                      <p className="w-[5%] font-['kollektif']!">{i + 1})</p>
                      <p className="w-[95%] font-['kollektif']!">{challenge}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </motion.div>
        </div>
      ) : (
        <p>Loading</p>
      )}
    </div>
  );
};

export default ProjectDets;
