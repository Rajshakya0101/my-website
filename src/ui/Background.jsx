"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const SnowfallEffect = ({ children }) => {
  const [snowflakes, setSnowflakes] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSnowflakes((prev) => [
        ...prev,
        createSnowflake(), // Add new snowflake every 300ms
      ]);
    }, 300);

    return () => clearInterval(interval);
  }, []);

  const createSnowflake = () => ({
    id: Math.random(),
    x: Math.random() * window.innerWidth,
    y: -30,
    size: Math.random() * 5 + 2, // Size between 2-7px
    duration: Math.random() * 5 + 5, // Duration between 5-10s
    drift: Math.random() * 50 - 25, // Horizontal drift variation
    rotate: Math.random() * 360, // Random initial rotation
  });

  return (
    <div className="h-screen w-full relative overflow-hidden bg-gradient-to-b from-gray-900 to-black">
      {snowflakes.map((snowflake) => (
        <Snowflake key={snowflake.id} snowflake={snowflake} />
      ))}
      {children}
    </div>
  );
};

const Snowflake = ({ snowflake }) => {
  return (
    <motion.div
      className="absolute bg-white rounded-full"
      style={{
        width: `${snowflake.size}px`,
        height: `${snowflake.size}px`,
        left: `${snowflake.x}px`,
        top: `${snowflake.y}px`,
        filter: "blur(1px)",
      }}
      animate={{
        y: window.innerHeight + 50,
        x: snowflake.x + snowflake.drift,
        rotate: snowflake.rotate + 360,
        opacity: [1, 0.8, 0],
      }}
      transition={{
        duration: snowflake.duration,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  );
};

export default SnowfallEffect;