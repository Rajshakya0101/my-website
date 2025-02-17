// AdminPanel.jsx

import { AnimatePresence, motion } from "framer-motion";
import { FiAlertCircle } from "react-icons/fi";
import { auth, db } from "../data/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  setDoc,
  getDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Modal from "./Modal"; // Existing modal for Projects
import SkillModal from "./SkillModal"; // New modal for Skills
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState, useEffect } from "react";
import "../../src/App.css";

const AdminPanel = () => {
  const [projects, setProjects] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal for adding projects
  const [successMessage, setSuccessMessage] = useState(null); // Success message after adding project

  // Warning modal states
  const [warningModalOpen, setWarningModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // ========= State for Skills =========
  // We'll store arrays of strings for each skill type
  const [technicalSkills, setTechnicalSkills] = useState([]);
  const [softSkills, setSoftSkills] = useState([]);
  const [tools, setTools] = useState([]);

  // Manage which skill modal is open
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [skillModalType, setSkillModalType] = useState(null);
  const [skillSuccessMessage, setSkillSuccessMessage] = useState(null);

  // Set up Firebase Authentication state listener
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user && user.email === "rajshakya.orai18@gmail.com") {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchProjects();
      fetchSkills(); // Fetch all skills once logged in
      toast.success("Logged in Successfully", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
      });
    }
  }, [isAuthenticated]);

  // =========================
  // ===== Projects Code =====
  // =========================
  const login = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      if (userCredential.user.email === "rajshakya.orai18@gmail.com") {
        setIsAuthenticated(true);
      } else {
        setErrorMessage("Admin Email or Password is Wrong");
        setWarningModalOpen(true);
      }
    } catch (error) {
      setErrorMessage("Admin Email or Password is Wrong");
      setWarningModalOpen(true);
    }
  };

  const fetchProjects = async () => {
    const querySnapshot = await getDocs(collection(db, "projects"));
    const projectsArray = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    setProjects(projectsArray);
  };

  const addProject = async (project) => {
    try {
      await addDoc(collection(db, "projects"), project);
      fetchProjects();
      setSuccessMessage("Project details saved successfully!");
      setIsModalOpen(false);
    } catch (e) {
      alert("Error adding project: " + e);
    }
  };

  const updateProject = async (projectId) => {
    if (editProject) {
      const projectRef = doc(db, "projects", projectId);
      try {
        await updateDoc(projectRef, { ...editProject });
        fetchProjects();
        setEditProject(null);
      } catch (e) {
        alert("Error updating project: " + e);
      }
    }
  };

  const deleteProject = async (projectId) => {
    const projectRef = doc(db, "projects", projectId);
    try {
      await deleteDoc(projectRef);
      fetchProjects();
    } catch (e) {
      alert("Error deleting project: " + e);
    }
  };

  const logout = () => {
    auth.signOut();
    setIsAuthenticated(false);
  };

  // =========================
  // ===== Skills Code =======
  // =========================

  // We'll store Technical, Soft, and Tools in a single `skills` collection
  // with 3 documents: "technicalSkills", "softSkills", "tools".
  // Each doc has a field `items` that is an array of strings.

  const fetchSkills = async () => {
    // For each doc, we attempt to fetch the array of items
    await fetchSkillDoc("technicalSkills", setTechnicalSkills);
    await fetchSkillDoc("softSkills", setSoftSkills);
    await fetchSkillDoc("tools", setTools);
  };

  const fetchSkillDoc = async (docName, setState) => {
    const docRef = doc(db, "skills", docName);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      // data.items is the array
      setState(data.items || []);
    } else {
      // If doc doesn't exist, create it or just set an empty array
      setState([]);
    }
  };

  // Called when user submits the SkillModal
  const addSkill = async (skillName, skillType) => {
    try {
      const skillDocRef = doc(db, "skills", skillType);

      // We'll use arrayUnion to add a new skill to the items array
      await setDoc(
        skillDocRef,
        { items: arrayUnion(skillName) },
        { merge: true }
      );

      // Refresh the local state
      if (skillType === "technicalSkills") {
        setTechnicalSkills((prev) => [...prev, skillName]);
      } else if (skillType === "softSkills") {
        setSoftSkills((prev) => [...prev, skillName]);
      } else if (skillType === "tools") {
        setTools((prev) => [...prev, skillName]);
      }

      setSkillSuccessMessage("Skill added successfully!");
      // Close the modal after a quick delay or immediately
      setTimeout(() => {
        setIsSkillModalOpen(false);
        setSkillSuccessMessage(null);
      }, 1000);
    } catch (error) {
      alert("Error adding skill: " + error.message);
    }
  };

  // To remove a skill from the array
  const removeSkill = async (skillName, skillType) => {
    try {
      const skillDocRef = doc(db, "skills", skillType);
      await updateDoc(skillDocRef, {
        items: arrayRemove(skillName),
      });
      // Update local state
      if (skillType === "technicalSkills") {
        setTechnicalSkills((prev) => prev.filter((sk) => sk !== skillName));
      } else if (skillType === "softSkills") {
        setSoftSkills((prev) => prev.filter((sk) => sk !== skillName));
      } else if (skillType === "tools") {
        setTools((prev) => prev.filter((sk) => sk !== skillName));
      }
    } catch (error) {
      alert("Error removing skill: " + error.message);
    }
  };

  // Helper function to open the skill modal with the correct type
  const openSkillModal = (type) => {
    setSkillModalType(type);
    setIsSkillModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#08233b] flex justify-center items-center text-white relative">
      <ToastContainer className="top-4 h-4" />

      {/* Warning Modal for Login Errors */}
      <AnimatePresence>
        {warningModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setWarningModalOpen(false)}
            className="bg-slate-900/20 backdrop-blur p-8 fixed inset-0 z-50 grid place-items-center overflow-y-scroll"
          >
            <motion.div
              initial={{ scale: 0, rotate: "12.5deg" }}
              animate={{ scale: 1, rotate: "0deg" }}
              exit={{ scale: 0, rotate: "0deg" }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#08233b] text-white p-6 rounded-lg w-full max-w-lg shadow-xl cursor-default relative overflow-hidden border border-gray-600"
            >
              <FiAlertCircle className="text-white/10 rotate-12 text-[250px] absolute z-0 -top-24 -left-24" />
              <div className="relative z-10">
                <div className="bg-white w-16 h-16 mb-2 rounded-full text-3xl text-indigo-600 grid place-items-center mx-auto">
                  <FiAlertCircle />
                </div>
                <h3 className="text-3xl font-bold text-center mb-2">Warning!</h3>
                <p className="text-lg text-center mb-6">{errorMessage}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setWarningModalOpen(false)}
                    className="bg-white hover:opacity-90 transition-opacity text-[#08233b] font-semibold w-full py-2 rounded cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =========================================== */}
      {/* If not authenticated, show Admin Login form */}
      {/* =========================================== */}
      {!isAuthenticated ? (
        <form
          onSubmit={login}
          className="bg-opacity-30 p-8 rounded shadow-lg w-96 lg:w-lg backdrop-blur-md border border-white/6"
        >
          <h2 className="text-2xl font-bold mb-4 text-white">Admin Login</h2>
          <div className="mb-4">
            <label className="block text-sm text-white">Email</label>
            <input
              type="email"
              className="w-full p-2 border border-white/20 rounded bg-transparent text-white cursor-pointer"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm text-white">Password</label>
            <input
              type="password"
              className="w-full p-2 border border-white/20 rounded bg-transparent text-white cursor-pointer"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full p-2 bg-blue-500 text-white rounded cursor-pointer"
          >
            Login
          </button>
        </form>
      ) : (
        /* ===========================
           == Authenticated Content ==
           =========================== */
        <div className="relative pt-25 flex gap-5 mb-20 scrollbar-hidden scroll-smooth">
          {/*  ============ Projects Panel ============ */}
          <div className="space-y-8 p-8 rounded-2xl shadow-xl backdrop-blur-lg bg-white/8 col-span-1">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold">Projects</h2>
              <div className="space-y-2 h-150 overflow-y-auto scrollbar-hidden scroll-smooth">
                {projects.map((project) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="p-8 rounded-2xl shadow-xl backdrop-blur-lg bg-white/8 hover:bg-white/13 transition-all flex gap-8 relative"
                  >
                    <img
                      src={project.thumbnailUrl}
                      alt=""
                      className="h-40 w-80 rounded-lg"
                    />
                    <div className="flex flex-col justify-evenly">
                      <h3 className="text-4xl font-semibold">{project.name}</h3>
                      <p>{project.description}</p>
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
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute top-12 right-18 transition-all hover:scale-120"
                      >
                        <i className="fas fa-link text-xl"></i>
                      </a>
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute top-12 right-10"
                      >
                        <i className="fab fa-github text-2xl transition-all hover:scale-120 hover:text-gray-300"></i>
                      </a>
                      <div className="flex space-x-4 mt-2">
                        <button
                          onClick={() =>
                            setEditProject({
                              name: project.name,
                              description: project.description,
                              techStack: project.techStack,
                              link: project.link,
                            })
                          }
                          className="Btn"
                        >
                          Edit
                          <svg className="svg" viewBox="0 0 512 512">
                            <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path>
                          </svg>
                        </button>
                        <button
                          onClick={() => deleteProject(project.id)}
                          className="button"
                        >
                          <svg viewBox="0 0 448 512" className="svgIcon">
                            <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="button2 font-semibold"
            >
              Add New Project
            </button>

            {/* Modal for Adding Project */}
            <Modal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onSubmit={addProject}
              successMessage={successMessage}
            />
          </div>

          {/* ============ Skills Panel ============= */}
          <div className="grid grid-rows-3 grid-cols-1 gap-5 w-xl">

            {/* =========== TECHNICAL SKILLS =========== */}
            <div className="rounded-2xl shadow-xl backdrop-blur-lg bg-white/8 p-6 px-8 flex justify-between">
              <div>
                <h1 className="text-3xl font-bold">Technical Skills</h1>
                <ul className="mt-4">
                  {technicalSkills.map((skill) => (
                    <li key={skill} className="flex items-center justify-between gap-2 mb-2">
                      <span>{skill}</span>
                      <button
                        onClick={() => removeSkill(skill, "technicalSkills")}
                        className="text-sm text-red-400 hover:text-red-600"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex gap-4">
                <button className="Btn">
                  Edit
                  <svg className="svg" viewBox="0 0 512 512">
                    <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path>
                  </svg>
                </button>
                <button
                  onClick={() => openSkillModal("technicalSkills")}
                  className="button2 font-semibold"
                >
                  Add New
                </button>
              </div>
            </div>

            {/* ============ SOFT SKILLS ============ */}
            <div className="rounded-2xl shadow-xl backdrop-blur-lg bg-white/8 p-6 px-8 flex justify-between">
              <div>
                <h1 className="text-3xl font-bold">Soft Skills</h1>
                <ul className="mt-4">
                  {softSkills.map((skill) => (
                    <li key={skill} className="flex justify-between items-center gap-2 mb-2">
                      <span>{skill}</span>
                      <button
                        onClick={() => removeSkill(skill, "softSkills")}
                        className="text-sm text-red-400 hover:text-red-600"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex gap-4">
                <button className="Btn">
                  Edit
                  <svg className="svg" viewBox="0 0 512 512">
                    <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path>
                  </svg>
                </button>
                <button
                  onClick={() => openSkillModal("softSkills")}
                  className="button2 font-semibold"
                >
                  Add New
                </button>
              </div>
            </div>

            {/* =============== TOOLS =============== */}
            <div className="rounded-2xl shadow-xl backdrop-blur-lg bg-white/8 p-6 px-8 flex justify-between">
              <div>
                <h1 className="text-3xl font-bold">Tools</h1>
                <ul className="mt-4">
                  {tools.map((skill) => (
                    <li key={skill} className="flex justify-between items-center gap-2 mb-2">
                      <span>{skill}</span>
                      <button
                        onClick={() => removeSkill(skill, "tools")}
                        className="text-sm text-red-400 hover:text-red-600"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex gap-4">
                <button className="Btn">
                  Edit
                  <svg className="svg" viewBox="0 0 512 512">
                    <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path>
                  </svg>
                </button>
                <button
                  onClick={() => openSkillModal("tools")}
                  className="button2 font-semibold"
                >
                  Add New
                </button>
              </div>
            </div>
          </div>

          {/* ================ New Skill Modal ================ */}
          <SkillModal
            isOpen={isSkillModalOpen}
            onClose={() => setIsSkillModalOpen(false)}
            onSubmit={addSkill}
            skillType={skillModalType}
            successMessage={skillSuccessMessage}
          />
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
