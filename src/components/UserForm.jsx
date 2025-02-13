// src/ContactForm.jsx
import React, { useState } from "react";
import { db, storage } from "../data/firebase";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const ContactForm = () => {
  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  // Image file state
  const [imageFile, setImageFile] = useState(null);

  // For feedback to the user
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");

    try {
      // 1. Upload the image if there's an image file
      let imageUrl = "";
      if (imageFile) {
        // Create a unique filename using name & timestamp, etc.
        const imageRef = ref(storage, `images/${imageFile.name}_${Date.now()}`);
        // Upload the file
        const snapshot = await uploadBytes(imageRef, imageFile);
        // Get the download URL
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      // 2. Save form data + image URL in Firestore
      await addDoc(collection(db, "contacts"), {
        name,
        email,
        message,
        imageUrl, // store the image URL
        createdAt: new Date().toISOString(),
      });

      setStatus("Message sent successfully!");
      // Clear the form
      setName("");
      setEmail("");
      setMessage("");
      setImageFile(null);
    } catch (error) {
      console.error("Error adding document or uploading image: ", error);
      setStatus("Error sending message, please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-4">Contact Us</h1>

      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        {/* Name */}
        <label className="flex flex-col">
          <span className="font-medium mb-1">Name</span>
          <input
            type="text"
            className="border border-gray-300 rounded-md p-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>

        {/* Email */}
        <label className="flex flex-col">
          <span className="font-medium mb-1">Email</span>
          <input
            type="email"
            className="border border-gray-300 rounded-md p-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        {/* Message */}
        <label className="flex flex-col">
          <span className="font-medium mb-1">Message</span>
          <textarea
            className="border border-gray-300 rounded-md p-2"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </label>

        {/* Image Upload */}
        <label className="flex flex-col">
          <span className="font-medium mb-1">Attach an image (optional)</span>
          <input
            type="file"
            className="border border-gray-300 rounded-md p-2"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
          />
        </label>

        {/* Submit button */}
        <button
          type="submit"
          className="bg-blue-600 text-white rounded-md py-2 hover:bg-blue-700 transition-colors"
        >
          Send
        </button>
      </form>

      {status && <p className="mt-4 text-center text-sm text-gray-700">{status}</p>}
    </div>
  );
};

export default ContactForm;
