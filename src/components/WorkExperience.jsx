import { motion } from "framer-motion";
import { experiences } from "../data/portfolioData";

const WorkExperience = () => (
  <section className="py-16 px-4 max-w-6xl mx-auto">
    <h2 className="text-7xl font-bold mb-12">Work Experience</h2>
    <div className="space-y-8">
      {experiences.map((exp, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="border-l-2 border-blue-400 pl-8"
        >
          <h3 className="text-xl font-semibold">{exp.title}</h3>
          <p className="text-gray-300 mt-2">{exp.company}</p>
          <p className="text-sm text-gray-400 mb-4">{exp.date}</p>
          <ul className="list-disc space-y-2 pl-6 text-gray-300">
            {exp.points.map((point, i) => (
              <li key={i}>{point}</li>
            ))}
          </ul>
        </motion.div>
      ))}
    </div>
  </section>
);

export default WorkExperience;