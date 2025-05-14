import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function StudentProfile() {
  const [darkMode, setDarkMode] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(""); // Store uploaded image URL
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "profile_photo"); // Replace with Cloudinary preset

    try {
      const response = await fetch("https://api.cloudinary.com/v1_1/dmj2uz5ao/image/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.secure_url) {
        setProfileImage(data.secure_url); // Set profile picture preview
        setImageUrl(data.secure_url); // Store Cloudinary URL
      } else {
        setError("Failed to upload image");
      }
    } catch (err) {
      setError("Error uploading image");
    } finally {
      setLoading(false);
     
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = {
      name: e.target.name.value,
      email: e.target.email.value,
      phone: e.target.phone.value,
      dob: e.target.dob.value,
      gender: e.target.gender.value,
      address: e.target.address.value,
      course: e.target.course.value,
      department: e.target.department.value,
      profileImage: imageUrl, // Send Cloudinary image URL
    };

    try {
      const response = await fetch("https://maghiconnect.onrender.com/api/profile/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to save profile");
      }

      alert("Profile saved successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
       navigate("/");
    }
  };

  return (
    <div className={`min-h-screen flex justify-center items-center p-12 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"} transition-all`}>
      <div className="max-w-2xl w-full p-8 bg-white/10 backdrop-blur-md shadow-2xl rounded-xl border border-white/20">
        
        {/* Dark Mode Toggle */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Create Profile</h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 bg-gray-700 text-white rounded-full"
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
        </div>

        {/* Profile Picture Upload */}
        <div className="flex flex-col items-center">
          <label htmlFor="profileImage" className="cursor-pointer">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-500 hover:border-blue-700 transition-all">
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex justify-center items-center bg-gray-200 text-gray-600">+</div>
              )}
            </div>
          </label>
          <input type="file" id="profileImage" className="hidden" onChange={handleImageUpload} />
          {loading && <p className="text-blue-500 text-sm mt-2">Uploading...</p>}
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input type="text" id="name" name="name" placeholder="Full Name" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" required />

          <input type="email" id="email" name="email" placeholder="Email" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" required />

          <input type="text" id="phone" name="phone" placeholder="Phone" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" required />

          <input type="date" id="dob" name="dob" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" required />

          <select id="gender" name="gender" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" required>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          <input type="text" id="address" name="address" placeholder="Address" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" required />

          <input type="text" id="course" name="course" placeholder="Course" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" required />

          <input type="text" id="department" name="department" placeholder="Department" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" required />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-700 text-white py-3 rounded-lg text-lg font-semibold transition-all"
          >
            {loading ? "Saving..." : "Save Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}
