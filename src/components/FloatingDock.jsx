import {
  IconBrandGithubFilled,
  IconBrandLinkedinFilled,
  IconBrandX,
  IconFileCvFilled,
  IconFolderFilled,
  IconHomeFilled,
  IconUserFilled,
} from "@tabler/icons-react";
import React, { useRef, useState, useEffect } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import { href } from "react-router-dom";

// Custom hook to detect mobile devices (adjust the breakpoint as needed)
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function handleResize() {
      // Here, screen widths of 768px or less are treated as mobile
      setIsMobile(window.innerWidth <= 768);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile;
}

// Mobile-only static icon container (no animations)
function MobileIconContainer({ elem, setOpenState }) {
  return (
    <>
      {elem &&
      elem.title &&
      ["X", "Linkedin", "Github", "Resume"].includes(
        String(elem.title).trim()
      ) ? (
        <a
          href={elem.href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setOpenState(elem.title.toLowerCase())}
          className="relative flex items-center justify-center bg-[#262626] rounded-full w-10 h-10"
        >
          <div className="flex scale-[0.5] h-full w-full items-center justify-center">
            {elem.icon}
          </div>
        </a>
      ) : (
        <div
          onClick={() => setOpenState(elem.title.toLowerCase())}
          className="relative flex items-center justify-center bg-[#262626] rounded-full w-10 h-10"
        >
          <div className="flex scale-[0.5] h-full w-full items-center justify-center">
            {elem.icon}
          </div>
        </div>
      )}
    </>
  );
}

// Animated icon container for non-mobile screens
function AnimatedIconContainer({ elem, mouseX, setOpenState }) {
  const iconContainerRef = useRef(null);
  const distance = useTransform(mouseX, (val) => {
    const bounds = iconContainerRef.current?.getBoundingClientRect() || {
      x: 0,
      width: 0,
    };
    return val - bounds.x - bounds.width / 2;
  });

  const containerWidth = useSpring(
    useTransform(distance, [-150, 0, 150], [40, 80, 40]),
    { mass: 0.1, stiffness: 150, damping: 12 }
  );
  const containerHeight = useSpring(
    useTransform(distance, [-150, 0, 150], [40, 80, 40]),
    { mass: 0.1, stiffness: 150, damping: 12 }
  );
  const yTransform = useSpring(
    useTransform(distance, [-150, 0, 150], [0, -25, 0]),
    { mass: 0.1, stiffness: 150, damping: 12 }
  );
  const iconWidth = useSpring(
    useTransform(distance, [-150, 0, 150], [23, 17, 23]),
    { mass: 0.1, stiffness: 150, damping: 12 }
  );
  const iconHeight = useSpring(
    useTransform(distance, [-150, 0, 150], [23, 17, 23]),
    { mass: 0.1, stiffness: 150, damping: 12 }
  );

  const [hovered, setHovered] = useState(false);
  const isSocialMedia =
    elem &&
    elem.title &&
    ["X", "Linkedin", "Github", "Resume"].includes(String(elem.title).trim());

  return (
    <>
      {isSocialMedia ? (
        <motion.a
          href={elem.href}
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onClick={() => setOpenState(elem.title.toLowerCase())}
          ref={iconContainerRef}
          style={{
            width: containerWidth,
            height: containerHeight,
            y: yTransform,
          }}
          className="relative flex items-center justify-center bg-[#262626] rounded-full"
        >
          <AnimatePresence>
            {hovered && (
              <motion.div
                initial={{ opacity: 0, y: 2, x: "-50%", scale: 0.8 }}
                animate={{ opacity: 1, y: -3, x: "-50%", scale: 1 }}
                exit={{ opacity: 0, y: 2, x: "-50%", scale: 0.8 }}
                className="absolute text-xs left-1/2 -top-8 px-2 py-0.5 whitespace-pre w-fit bg-neutral-100 rounded-md"
              >
                {elem.title}
              </motion.div>
            )}
          </AnimatePresence>
          <motion.div
            style={{
              width: iconWidth,
              height: iconHeight,
            }}
            className="flex h-full w-full items-center justify-center"
          >
            {elem.icon}
          </motion.div>
        </motion.a>
      ) : (
        <motion.div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onClick={() => setOpenState(elem.title.toLowerCase())}
          ref={iconContainerRef}
          style={{
            width: containerWidth,
            height: containerHeight,
            y: yTransform,
          }}
          className="relative flex items-center justify-center bg-[#262626] rounded-full"
        >
          <AnimatePresence>
            {hovered && (
              <motion.div
                initial={{ opacity: 0, y: 2, x: "-50%", scale: 0.8 }}
                animate={{ opacity: 1, y: -3, x: "-50%", scale: 1 }}
                exit={{ opacity: 0, y: 2, x: "-50%", scale: 0.8 }}
                className="absolute text-xs left-1/2 -top-8 px-2 py-0.5 whitespace-pre w-fit bg-neutral-100 rounded-md"
              >
                {elem.title}
              </motion.div>
            )}
          </AnimatePresence>
          <motion.div
            style={{
              width: iconWidth,
              height: iconHeight,
            }}
            className="flex h-full w-full items-center justify-center"
          >
            {elem.icon}
          </motion.div>
        </motion.div>
      )}
    </>
  );
}

// Wrapper component that chooses which container to render based on the device type
function IconContainer({ elem, mouseX, setOpenState, isMobile }) {
  return isMobile ? (
    <MobileIconContainer elem={elem} setOpenState={setOpenState} />
  ) : (
    <AnimatedIconContainer
      elem={elem}
      mouseX={mouseX}
      setOpenState={setOpenState}
    />
  );
}

// Main FloatingDock component
function FloatingDock({ openState, setOpenState }) {
  const isMobile = useIsMobile();

  const links = [
    {
      title: openState === "about me" ? "Home" : "About Me",
      icon:
        openState === "about me" ? (
          <IconHomeFilled className="h-full w-full text-white" />
        ) : (
          <IconUserFilled className="h-full w-full text-white" />
        ),
      href: "/about",
    },
    {
      title: "Projects",
      icon: <IconFolderFilled className="h-full w-full text-white" />,
      href: "/projects",
    },
    {
      title: "X",
      icon: <IconBrandX className="h-full w-full text-white" />,
      href: "https://x.com/Sarthak_Sama",
    },
    {
      title: "Linkedin",
      icon: <IconBrandLinkedinFilled className="h-full w-full text-white" />,
      href: "https://www.linkedin.com/in/sarthak-saklani-734b85235/",
    },
    {
      title: "Github",
      icon: <IconBrandGithubFilled className="h-full w-full text-white" />,
      href: "https://github.com/Sarthak-Sama/",
    },
    {
      title: "Resume",
      icon: <IconFileCvFilled className="-full w-full text-white" />,
      href: "https://drive.google.com/file/d/1l8qT6fLkKeh93LYqYkf555RZniiG83RC/view",
    },
  ];

  // Create a motion value for mouseX (only used on non-mobile)
  const mouseX = useMotionValue(Infinity);

  return (
    <motion.div
      // Only attach mouse events on non-mobile devices
      {...(!isMobile && {
        onMouseMove: (event) => mouseX.set(event.pageX),
        onMouseLeave: () => mouseX.set(Infinity),
      })}
      className="fixed bottom-10 px-4 rounded-2xl inset-x-0 mx-auto w-fit h-[4rem] bg-[#171717] flex items-center justify-between gap-4"
    >
      {links.map((elem, index) => (
        <IconContainer
          key={index}
          elem={elem}
          mouseX={mouseX}
          setOpenState={setOpenState}
          isMobile={isMobile}
        />
      ))}
    </motion.div>
  );
}

export default FloatingDock;
