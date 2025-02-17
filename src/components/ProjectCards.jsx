import { motion } from "framer-motion";

const ProjectCard = ({ project }) => (
  <motion.div
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    className="p-6 rounded-2xl shadow-xl backdrop-blur-lg bg-white/8 hover:bg-white/11 transition-all hover:scale-105 flex gap-8 relative"
  >
    <img src={project.thumbnailUrl} alt="" className="h-40 w-80 rounded-lg" />
    <div className="flex flex-col justify-evenly">
      <h3 className="text-6xl font-semibold">{project.name}</h3>
      <p className="text-xl text-gray-300">{project.description}</p>
      <ul className="flex gap-2 cursor-default py-2">
        {Array.isArray(project.techStack)
          ? project.techStack.map((tech, index) => (
              <li
                key={index}
                className="p-1 px-3 rounded-2xl shadow-lg bg-white/8"
              >
                {tech}
              </li>
            ))
          : "No tech stack available"}
      </ul>
      {/* Link Icon */}
      {/* Link Icon with Tooltip */}
      <div className="absolute top-12 right-20">
        <div className="relative group">
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-all hover:scale-110"
          >
            <i className="fas fa-link text-2xl"></i>
          </a>
          <span
            className="absolute -top-8 left-1/2 transform -translate-x-1/2 
                     px-3 py-1 text-xs text-white bg-gray-900 rounded 
                     opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            Demo
          </span>
        </div>
      </div>

      {/* GitHub Icon with Tooltip */}
      <div className="absolute top-12 right-10">
        <div className="relative group">
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-all hover:scale-110 hover:text-gray-300"
          >
            <i className="fab fa-github text-3xl"></i>
          </a>
          <span
            className="absolute -top-8 left-1/2 transform -translate-x-1/2 
                     px-3 py-1 text-xs text-white bg-gray-900 rounded 
                     opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            GitHub
          </span>
        </div>
      </div>
    </div>
  </motion.div>
);

export default ProjectCard;
