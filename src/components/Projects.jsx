import ProjectCard from "../components/ProjectCards";
import { projects } from "../data/portfolioData";

const Projects = () => (
  <section className="py-16 px-4 bg-[#0a1e32] text-white">
    <div className="max-w-6xl mx-auto px-4">
      <h2 className="text-7xl font-bold mb-12">Projects</h2>
      <div className="space-y-16">
        {projects.map((project, index) => (
          <ProjectCard key={index} project={project} />
        ))}
      </div>
    </div>
  </section>
);

export default Projects;