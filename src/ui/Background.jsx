"use client";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";

const RainDropEffect = ({ children }) => {
  const [droplets, setDroplets] = useState([]);

  // Generate droplets at regular intervals
  useEffect(() => {
    const interval = setInterval(() => {
      setDroplets((prevDroplets) => [
        ...prevDroplets,
        createDroplet(), // Add a new droplet every interval
      ]);
    }, 1000); // Add new droplets every 100ms

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  // Create a droplet with random size, speed, and starting position
  const createDroplet = () => {
    return {
      id: Math.random(),
      x: Math.random() * window.innerWidth, // Random horizontal position
      y: -30, // Start off-screen above the top
      size: Math.random() * 3 + 2, // Random size for droplets
      duration: Math.random() * 2 + 3, // Random falling duration between 3 and 5 seconds
    };
  };

  return (
    <div
      className="h-screen w-full relative overflow-hidden bg-gradient-to-b from-gray-900 to-black"
    >
      {droplets.map((droplet) => (
        <RainDroplet key={droplet.id} droplet={droplet} />
      ))}
      {children}
    </div>
  );
};

const RainDroplet = ({ droplet }) => {
  return (
    <motion.div
      className="absolute bg-blue-500 rounded-full opacity-80"
      style={{
        width: `${droplet.size}px`,
        height: `${droplet.size}px`,
        left: `${droplet.x}px`,
      }}
      animate={{
        y: [droplet.y, window.innerHeight + 50], // Droplet falls downwards
        opacity: [1, 0], // Fade out as it falls
      }}
      transition={{
        duration: droplet.duration, // Randomize the fall duration
        repeat: Infinity, // Keep the droplet falling
        ease: "easeIn", // Ease-in effect for smooth falling
      }}
    />
  );
};

export default RainDropEffect;
