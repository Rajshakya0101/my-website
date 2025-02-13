import { skills } from "../data/portfolioData";

const Skills = () => (
  <section className="py-16 px-4 bg-[#0a1e32]">
    <div className="max-w-6xl px-4 mx-auto">
      <h2 className="text-7xl font-bold mb-12">Skills & Tools</h2>
      <div className="grid md:grid-cols-3 gap-8">
        {Object.entries(skills).map(([category, items]) => (
          <div key={category}>
            <h3 className="text-xl font-semibold mb-4 capitalize">{category}</h3>
            <div className="flex flex-wrap gap-2">
              {items.map((skill, i) => (
                <span
                  key={i}
                  className="bg-[#113255] px-3 py-1 rounded-full text-sm text-white"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Skills;