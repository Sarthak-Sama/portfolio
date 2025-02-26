import React, { useState, useMemo, useEffect } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import ProjectCard from "./partials/ProjectCard";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 768);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile;
}

const MemoizedProjectCard = React.memo(ProjectCard);

const Card = ({
  projectData,
  index,
  totalCards,
  isSelected,
  onSelect,
  setOpenState,
}) => {
  // Motion value for horizontal dragging
  const cardXCor = useMotionValue(0);
  const initialZIndex = totalCards - index;

  // Local state to mark if the card was swiped (for visual reordering)
  const [isSwiped, setIsSwiped] = useState(false);

  // Capitalize the first letter of the category
  const transformedCategory = useMemo(
    () =>
      projectData.category.charAt(0).toUpperCase() +
      projectData.category.slice(1),
    [projectData.category]
  );

  const isMobile = useIsMobile();

  // Compute the initial position based on the screen size
  const initialPosition = useMemo(() => {
    if (isMobile) {
      // For mobile: center horizontally
      return {
        x: window.innerWidth / 2 - 144, // card width ~18rem (~288px)
        y: window.innerHeight * 0.2,
      };
    } else {
      // For desktop: arrange side by side
      return {
        x: index * 300 - (totalCards * 300) / 2 + window.innerWidth / 2,
        y: window.innerHeight * 0.2,
      };
    }
  }, [isMobile, index, totalCards]);

  // State for card position and storing the original position when flipped
  const [position, setPosition] = useState(initialPosition);
  const [originalPosition, setOriginalPosition] = useState(null);

  // Center position when the card is selected (flipped)
  const centerPosition = useMemo(
    () => ({
      x: window.innerWidth / 2 - 144,
      y: window.innerHeight / 2 - 192,
    }),
    []
  );

  // When screen size or index changes, update the position
  useEffect(() => {
    setPosition(initialPosition);
    setOriginalPosition(null);
  }, [initialPosition]);

  // Manage which side of the card is visible (front/back)
  const [visibleSide, setVisibleSide] = useState("front");

  useEffect(() => {
    setVisibleSide(isSelected ? "back" : "front");
  }, [isSelected]);

  // When flipping, update the card's position accordingly
  useEffect(() => {
    if (visibleSide === "back") {
      setOriginalPosition((prev) => prev ?? position);
      if (position.x !== centerPosition.x || position.y !== centerPosition.y) {
        setPosition(centerPosition);
      }
    } else if (originalPosition) {
      if (
        position.x !== originalPosition.x ||
        position.y !== originalPosition.y
      ) {
        setPosition(originalPosition);
      }
    }
  }, [visibleSide, centerPosition, position, originalPosition]);

  // (Optional) Adjust opacity during drag for extra polish
  const opacityTransform = useTransform(
    cardXCor,
    [-144, 0, 144],
    [0.4, 1, 0.4]
  );

  // Compute the z-index: if swiped, lower it so other cards appear on top.
  const computedZIndex = isSwiped
    ? initialZIndex - 2
    : visibleSide === "back"
    ? 999
    : totalCards - index;
  useEffect(() => {
    if (projectData.category === "Extra" && computedZIndex === -1) {
      setOpenState("");
    }
  }, [computedZIndex, projectData.category, setOpenState]);

  return (
    <motion.div
      className="absolute w-[18rem] aspect-[3/4]"
      style={{
        perspective: "1000px",
        zIndex: computedZIndex,
        // On desktop, use the motion value; on mobile, let animate control x.
        ...(!isMobile && { x: cardXCor }),
        opacity: !isMobile || visibleSide !== "front" ? 1 : opacityTransform,
      }}
      // Enable horizontal drag only on mobile and when front side is visible
      drag={!isMobile || visibleSide !== "front" ? false : "x"}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={(event, info) => {
        if (!isMobile) return;
        const threshold = 100; // adjust threshold as needed
        if (Math.abs(info.offset.x) > threshold) {
          // Mark the card as swiped so its z-index is lowered.
          setIsSwiped(true);
        } else {
          // If not enough, reset swipe state.
          setIsSwiped(false);
        }
        // Reset the drag offset so the card snaps back to its original position.
        cardXCor.set(0);
      }}
      initial={{
        y: window.innerHeight + 100,
        x: window.innerWidth / 2 - 144,
        rotateZ: 0,
        scale: 0.8,
      }}
      animate={{
        x: isMobile ? window.innerWidth / 2 - 144 : position.x,
        y: position.y,
        rotateZ: isSelected ? 0 : index % 2 === 0 ? -2 : 2,
        scale: isSelected ? 1.1 : 1,
        transition: {
          duration: 0.3,
          type: "spring",
          stiffness: 200,
          damping: 20,
        },
      }}
      exit={{
        y: window.innerHeight + 100,
        transition: { delay: (totalCards - index) * 0.05 },
      }}
      onClick={() => {
        if (!isSelected) {
          onSelect();
        }
      }}
    >
      <motion.div
        className="absolute inset-0 bg-white rounded-[3%] cursor-pointer"
        animate={{
          // Flip effect: adjust scale and rotateY to flip the card
          scaleX: visibleSide === "front" ? 1 : isMobile ? 1 : 2.25,
          scaleY: visibleSide === "front" ? 1 : 1.5,
          rotateY: visibleSide === "front" ? 0 : 180,
        }}
        transition={{ type: "spring", damping: 20, stiffness: 100 }}
        style={{ transformStyle: "preserve-3d", transformOrigin: "center" }}
      >
        {/* Front Side */}
        <div
          className="absolute w-full h-full flex items-center justify-center"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          <div>
            <h2 className="text-3xl">{projectData.category}</h2>
          </div>
        </div>

        {/* Back Side */}
        <div
          className="absolute w-full h-full flex items-start bg-white rounded-[3%]"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: `rotateY(180deg)`,
          }}
        >
          <div
            className="w-full p-4"
            style={{
              // Scale back the content on the flipped side.
              transform: `scale(${isMobile ? 1 : 1 / 2.25}, ${1 / 1.5})`,
              transformOrigin: "center top",
            }}
          >
            <h2 className="text-2xl text-center">
              {transformedCategory} Projects
            </h2>
            <div className="mt-5 w-[17rem] md:w-[40rem] h-[31rem] overflow-x-hidden overflow-y-scroll -translate-x-[2%] md:-translate-x-[30%] flex items-center justify-center md:justify-between flex-wrap gap-5 px-3 md:px-8">
              {projectData.projects?.map((project) => (
                <MemoizedProjectCard
                  key={project.name}
                  project={project}
                  category={projectData.category}
                />
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Card;
