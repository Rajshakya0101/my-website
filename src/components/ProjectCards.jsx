import { motion } from "framer-motion";

const ProjectCard = ({ project }) => (
  <motion.div
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    className="p-8 rounded-2xl shadow-xl backdrop-blur-lg bg-white/8 hover:bg-white/13 transition-all hover:scale-105"
  >
    <h3 className="text-6xl font-semibold mb-4">{project.title}</h3>
    <p className="text-gray-200 mb-6 leading-relaxed">{project.description}</p>
    <div className="flex flex-wrap gap-2">
      {project.tech.map((tech, i) => (
        <span
          key={i}
          className="px-4 py-1 bg-white/8 backdrop-blur-md rounded-full text-sm font-medium text-white"
        >
          {tech}
        </span>
      ))}
    </div>
  </motion.div>
);

export default ProjectCard;