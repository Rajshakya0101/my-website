import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Main from "./components/Main";
import Projects from "./components/Projects";
import WorkExperience from "./components/WorkExperience";
import Skills from "./components/Skills";
import AdminPanel from "./components/AdminPanel";
import Footer from "./components/Footer";
import UserForm from "./components/UserForm";

const App = () => {
  return (
    <Router>
      <div className="min-h-screen">
        <Navbar />
        <Routes>
          {/* Regular routes */}
          <Route path="/" element={<Main />} />
          <Route path="/home" element={<Main />} />
          <Route path="/work" element={<Projects />} />
          <Route path="/work-experience" element={<WorkExperience />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/user" element={<UserForm />} />

          {/* Admin Panel Route */}
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>

        <Footer />
      </div>
    </Router>
  );
};

export default App;
