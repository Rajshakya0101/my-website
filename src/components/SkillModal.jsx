// SkillModal.jsx
import React, { useState } from "react";

const SkillModal = ({ isOpen, onClose, onSubmit, skillType, successMessage }) => {
  const [skillInput, setSkillInput] = useState("");

  if (!isOpen) return null;

  const handleSkillChange = (e) => {
    setSkillInput(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!skillInput.trim()) {
      alert("Please enter a skill name!");
      return;
    }

    // Call the parent function to save
    onSubmit(skillInput, skillType);
    setSkillInput("");
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center text-black z-50">
      <div className="bg-white p-8 rounded-xl w-96">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">
            Add {skillType === "technicalSkills"
              ? "Technical Skill"
              : skillType === "softSkills"
              ? "Soft Skill"
              : "Tool"}
          </h3>
          <button onClick={onClose} className="text-gray-500">
            &times;
          </button>
        </div>

        {!successMessage ? (
          <form onSubmit={handleSubmit} className="space-y-4 text-black">
            <input
              type="text"
              value={skillInput}
              onChange={handleSkillChange}
              placeholder={
                skillType === "technicalSkills"
                  ? "e.g. React"
                  : skillType === "softSkills"
                  ? "e.g. Teamwork"
                  : "e.g. GitHub"
              }
              className="w-full p-2 mb-2 border border-gray-300 rounded"
              required
            />

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer"
              >
                Save
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

export default SkillModal;
