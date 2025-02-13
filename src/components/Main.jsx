import React from "react";
import Hero from "./Hero";
import Projects from "./Projects";
import WorkExperience from "./WorkExperience";
import Skills from "./Skills";
import Contact from "./Contact";

export default function Main() {
  return (
    <div className="min-h-screen bg-[#08233b] text-white">
      <Hero />
      <Projects />
      <WorkExperience />
      <Skills />
      <Contact />
    </div>
  );
}
