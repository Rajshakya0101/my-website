import React from "react";
import { TextHoverEffect } from "../ui/TextHoverEffect";

// A reusable social icon component
const SocialIcon = ({ href, iconClass, bgColor }) => (
  <li className="list-none">
    <a
      href={href}
      className="w-20 h-20 bg-white text-[35px] mx-[10px] flex justify-center items-center rounded-full relative overflow-hidden border border-white z-[1] group"
    >
      {/* 
        This span simulates the :before pseudo-element.
        It starts off positioned below the element (top-full)
        and slides upward (top-0) on hover.
      */}
      <span
        className="absolute inset-0 top-full left-0 w-full h-full transition-all duration-500 z-[2] group-hover:top-0"
        style={{ backgroundColor: bgColor }}
      ></span>
      <i
        className={`${iconClass} relative text-[#262626] transition duration-500 group-hover:text-white group-hover:[transform:rotateY(360deg)] z-[3]`}
      ></i>
    </a>
  </li>
);

const Footer = () => (
  <footer className="bg-gradient-to-b from-black to-black py-8 overflow-hidden relative">
    {/* TextHoverEffect container */}
    <div 
        style={{
        width: "100vw",
        height: "70vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}>
      <TextHoverEffect text="Developer" duration={0.2} />
    </div>

    {/* Social media icons positioned in the center */}
    <ul className="relative top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex ">
      <SocialIcon
        href="#"
        iconClass="fab fa-facebook-f"
        bgColor="#3b5999"
      />
      <SocialIcon
        href="#"
        iconClass="fab fa-twitter"
        bgColor="#55acee"
      />
      <SocialIcon
        href="#"
        iconClass="fab fa-linkedin-in"
        bgColor="#0077b5"
      />
      <SocialIcon
        href="#"
        iconClass="fab fa-google-plus-g"
        bgColor="#dd4b39"
      />
    </ul>

    {/* Footer bottom content */}
    <div className="max-w-6xl mx-auto px-4 text-center mt-8">
      <p className="mb-4 text-gray-300">
        © 2025. Raj Shakya. All rights reserved
      </p>
      <button
        onClick={() =>
          window.scrollTo({ top: 0, behavior: "smooth" })
        }
        className="hover:text-blue-400 transition-colors cursor-pointer"
      >
        ↑ Scroll to Top
      </button>
    </div>
  </footer>
);

export default Footer;
