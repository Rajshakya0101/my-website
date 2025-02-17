import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../data/firebase";

const Skills = () => {
  const [skillsData, setSkillsData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper function to format IDs
  function formatDocId(docId) {
    const spaced = docId.replace(/([A-Z])/g, " $1");
    return spaced.charAt(0).toUpperCase() + spaced.slice(1);
  }

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "skills"));
        const skillsObj = {};
        querySnapshot.forEach((doc) => {
          skillsObj[doc.id] = doc.data().items;
        });
        setSkillsData(skillsObj);
      } catch (err) {
        console.error("Error fetching skills:", err);
        setError("Failed to fetch skills");
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <section className="py-16 px-4 bg-[#0a1e32]">
      <div className="max-w-6xl px-4 mx-auto">
        <h2 className="text-7xl font-bold mb-12 text-white">Skills & Tools</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {Object.entries(skillsData).map(([docId, items]) => (
            <div key={docId}>
              <h3 className="text-xl font-semibold mb-4 capitalize text-white">
                {/* Format the docId to add spaces and capitalize */}
                {formatDocId(docId)}
              </h3>
              <div className="flex flex-wrap gap-2">
                {items?.map((skill, i) => (
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
};

export default Skills;
