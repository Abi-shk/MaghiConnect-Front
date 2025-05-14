import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaUserGraduate, FaBriefcase } from "react-icons/fa";
import Footer from "../components/Footer";

const Home = () => {
  const [jobPosts, setJobPosts] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        // Fetch job posts
        const jobResponse = await axios.get("https://maghiconnect.onrender.com/api/candidates/job-posts", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setJobPosts(jobResponse.data);

        // Fetch logged-in user details
        const userResponse = await axios.get("https://maghiconnect.onrender.com/api/candidates/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(userResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleEditProfile = () => {
    navigate("/profile"); // Navigates to profile page
  };

  return (
    <>
    <div className="flex min-h-screen bg-gray-100 p-6">
      {/* Left - Profile Section */}
      <div className="w-1/3 bg-white shadow-md rounded-lg overflow-hidden">
        {/* Cover Photo */}
        <div className="h-24 bg-blue-500"></div>
        
        <div className="flex flex-col items-center p-6 -mt-12">
          {/* Profile Image */}
          {user?.profileImage ? (
            <img src={user.profileImage} alt="Profile" className="w-24 h-24 rounded-full border-4 border-white shadow-md" />
          ) : (
            <div className="w-24 h-24 flex items-center justify-center rounded-full bg-gray-200 border-4 border-white shadow-md text-gray-500">
              No Image
            </div>
          )}

          {/* Name & Role */}
          <h2 className="text-xl font-bold mt-3 capitalize">{user?.name || "Candidate"}</h2>
          <p className="text-gray-500 text-sm">{user?.role || "Candidate"}</p>

          {/* Contact & Details */}
          <div className="mt-4 space-y-2 text-sm text-gray-600 w-full">
            <p className="flex items-center gap-2"><FaEnvelope className="text-blue-500" /> {user?.email || "N/A"}</p>
            <p className="flex items-center gap-2"><FaPhone className="text-green-500" /> {user?.phone || "N/A"}</p>
            <p className="flex items-center gap-2"><FaMapMarkerAlt className="text-red-500" /> {user?.address || "N/A"}</p>
            <p className="flex items-center gap-2"><FaUserGraduate className="text-purple-500" /> {user?.course || "N/A"}</p>
            <p className="flex items-center gap-2"><FaBriefcase className="text-orange-500" /> {user?.department || "N/A"}</p>
          </div>

          <div className="mt-5 flex gap-4">
            <button onClick={handleEditProfile} className="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
              Edit Profile
            </button>
            <button onClick={handleLogout} className="px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Right - Job Posts Section */}
      <div className="w-2/3 ml-6">
        <h2 className="text-xl font-bold mb-4">Job Posts</h2>
        {jobPosts.length === 0 ? (
          <p className="text-gray-600">No job posts available.</p>
        ) : (
          <div className="space-y-4">
            {jobPosts.map((job) => (
              <div key={job._id} className="bg-white p-4 shadow-md rounded-lg">
                <h4 className="text-lg font-semibold">{job.title}</h4>
                <p className="text-gray-800">{job.description}</p>
                <p>
          {Array.isArray(job.requirements)
            ? job.requirements.map((req, index, arr) => (
                <span key={index}>
                  {req.trim()} {index !== arr.length - 1 && " - "}
                </span>
              ))
            : job.requirements}
        </p>
                <p><span className="text-sm text-gray-600">{job.location} - {job.salary}</span></p>
                <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                  Apply Now
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
      <Footer />
      </>
  );
};

export default Home;
