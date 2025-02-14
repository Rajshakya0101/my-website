import React, { useState } from "react";
import { storage } from "../data/firebase"; // Ensure you're importing storage
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Import Firebase Storage functions

const Modal = ({ isOpen, onClose, onSubmit, successMessage }) => {
  const [projectData, setProjectData] = useState({
    name: "",
    description: "",
    techStack: [], // Change this to an array to store multiple tech stack items
    link: "",
    thumbnailUrl: "",
  });
  const [thumbnail, setThumbnail] = useState(null); // State to hold the selected file

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProjectData({
      ...projectData,
      [name]: value,
    });
  };

  const handleTechStackChange = (e, index) => {
    const { value } = e.target;
    const newTechStack = [...projectData.techStack];
    newTechStack[index] = value;
    setProjectData({ ...projectData, techStack: newTechStack });
  };

  const addTechStackItem = () => {
    setProjectData({
      ...projectData,
      techStack: [...projectData.techStack, ""], // Add an empty string to the tech stack array
    });
  };

  const removeTechStackItem = (index) => {
    const newTechStack = projectData.techStack.filter((_, i) => i !== index);
    setProjectData({ ...projectData, techStack: newTechStack });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!thumbnail) {
      alert("Please upload a thumbnail image.");
      return;
    }

    const thumbnailRef = ref(storage, `thumbnails/${thumbnail.name}`);
    try {
      // Upload the thumbnail to Firebase Storage
      await uploadBytes(thumbnailRef, thumbnail);
      const url = await getDownloadURL(thumbnailRef); // Get the download URL

      // Add the new project with the thumbnail URL
      const newProject = {
        ...projectData,
        thumbnailUrl: url,
      };

      // Pass the project data to the parent component to save it to Firestore
      await onSubmit(newProject);

      setProjectData({
        name: "",
        description: "",
        techStack: [],
        link: "",
        thumbnailUrl: "",
      }); // Clear form after submit
      setThumbnail(null); // Reset thumbnail
      onClose(); // Close the modal
    } catch (error) {
      alert("Error uploading thumbnail: " + error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center text-black">
      <div className="bg-white p-8 rounded-xl w-96">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">Add Project</h3>
          <button onClick={onClose} className="text-gray-500">
            &times;
          </button>
        </div>

        {!successMessage ? (
          <form onSubmit={handleSubmit} className="space-y-4 text-black">
            <input
              type="file"
              accept="image/png, image/jpeg"
              onChange={handleFileChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
            {thumbnail && (
              <div className="mb-4">
                <img
                  src={URL.createObjectURL(thumbnail)}
                  alt="Thumbnail Preview"
                  className="w-32 h-32 object-cover rounded"
                />
              </div>
            )}
            <input
              type="text"
              name="name"
              value={projectData.name}
              onChange={handleInputChange}
              placeholder="Project Name"
              className="w-full p-2 mb-2 border border-gray-300 rounded"
              required
            />
            <textarea
              name="description"
              value={projectData.description}
              onChange={handleInputChange}
              placeholder="Description"
              className="w-full p-2 mb-2 border border-gray-300 rounded"
              required
            />
            <div>
              <label className="block text-sm font-medium mb-2">Tech Stack</label>
              {projectData.techStack.map((tech, index) => (
                <div key={index} className="flex mb-2">
                  <input
                    type="text"
                    value={tech}
                    onChange={(e) => handleTechStackChange(e, index)}
                    placeholder="Tech Stack"
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                  <button
                    type="button"
                    onClick={() => removeTechStackItem(index)}
                    className="ml-2 text-red-500"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addTechStackItem}
                className="text-blue-500"
              >
                Add Tech Stack
              </button>
            </div>
            <input
              type="url"
              name="link"
              value={projectData.link}
              onChange={handleInputChange}
              placeholder="Project Link"
              className="w-full p-2 mb-2 border border-gray-300 rounded"
              required
            />
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer"
              >
                Save Project
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center">
            <p className="text-green-600">{successMessage}</p>
            <button
              onClick={onClose}
              className="bg-blue-500 text-white px-4 py-2 rounded mt-4 cursor-pointer"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
