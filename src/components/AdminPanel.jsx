import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { auth, db } from "../data/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Modal from "./Modal"; // Modal component for adding projects
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminPanel = () => {
  const [projects, setProjects] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal for adding projects
  const [successMessage, setSuccessMessage] = useState(null); // Success message after adding project

  // State for the warning modal when login fails
  const [warningModalOpen, setWarningModalOpen] = useState(false);

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
      // Show "Logged in Successfully" notification when the admin successfully logs in
      toast.success("Logged in Successfully", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
      });
    }
  }, [isAuthenticated]);

  const login = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      // If the logged in user is the admin, authenticate;
      // otherwise, show the warning modal.
      if (userCredential.user.email === "rajshakya.orai18@gmail.com") {
        setIsAuthenticated(true);
      } else {
        setWarningModalOpen(true);
      }
    } catch (error) {
      // For wrong password, non-existent user, or any error during login, show warning modal.
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

  return (
    <div className="min-h-screen bg-[#08233b] flex justify-center items-center text-white relative">
      <ToastContainer className="top-4 h-4" />

      {/* Warning Modal for Login Errors */}
      {warningModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black opacity-50"></div>
          {/* Modal Content */}
          <div className="bg-white text-black p-8 rounded shadow-md z-10">
            <p className="text-red-600 font-bold">
              Email or Password is incorrect
            </p>
            <button
              onClick={() => setWarningModalOpen(false)}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}

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
        <div className="space-y-8">
          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded cursor-pointer"
          >
            Logout
          </button>

          <div className="space-y-4">
            <h2 className="text-xl font-bold">Projects</h2>
            <div className="space-y-2">
              {projects.map((project) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  className="p-8 rounded-2xl shadow-xl backdrop-blur-lg bg-white/8 hover:bg-white/13 transition-all hover:scale-105 flex gap-8"
                >
                  <img
                    src={project.thumbnailUrl}
                    alt=""
                    className="h-40 w-auto rounded-lg"
                  />
                  <div className="flex flex-col justify-evenly">
                    <h3 className="text-lg font-semibold">{project.name}</h3>
                    <p>{project.description}</p>
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 cursor-pointer"
                    >
                      View Project
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
                        className="bg-yellow-500 text-white px-4 py-2 rounded cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteProject(project.id)}
                        className="bg-red-500 text-white px-4 py-2 rounded cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-green-500 text-white px-4 py-2 rounded cursor-pointer"
          >
            Add New Project
          </button>

          {/* Modal Component for Adding Project */}
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={addProject}
            successMessage={successMessage}
          />
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
