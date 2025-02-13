import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Typewriter from "react-typewriter-effect";
import Profile from "../assets/profile.png";
import Background from "../ui/Background";

// Component for Typewriter Effect
const HeroText = () => {
  const jobTitles = ["Frontend Developer", "UI/UX Designer", "IoT Enthusiast"];
  return (
    <span className="text-white">
      <Typewriter
        textStyle={{
          fontSize: "4rem",
          fontWeight: "bold",
          color: "white",
          display: "inline-block",
        }}
        startDelay={1000}
        cursorColor="white"
        multiText={jobTitles} // Correct multiText usage
        multiTextLoop={true} // Ensures it loops infinitely
        multiTextDelay={4000} // Delay between each text cycle
        typeSpeed={50} // Typing speed
      />
    </span>
  );
};

// Main Hero Section
const Hero = () => {
  return (
    <Background>
      <section className="relative h-screen flex flex-col lg:flex-row gap-2 items-center lg:text-left max-w-6xl mx-auto z-20 justify-center">
        {/* TEXT SECTION */}
        <div className="max-w-3xl flex flex-col items-center px-4 lg:items-start text-center lg:text-left">
          {/* Greeting Text */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-2xl text-gray-300"
          >
            Hey, there 👋
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-gray-500 text-7xl font-bold leading-none mt-2"
          >
            I'm{" "}
            <span className="bg-gradient-to-r from-blue-400 to-blue-600 text-transparent bg-clip-text">
              Raj Shakya
            </span>
            <br />
            <p className="inline-flex items-center gap-3 text-white">
              a <HeroText />
            </p>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl text-gray-400 mt-4"
          >
            currently focused on building user experiences that drive growth.
          </motion.p>
        </div>

        {/* IMAGE SECTION */}
        <div className="flex justify-center mt-8 lg:mt-0">
          <img
            src={Profile}
            alt="Profile"
            className="w-auto max-w-xs lg:max-w-sm"
          />
        </div>
      </section>
    </Background>
  );
};

export default Hero;
