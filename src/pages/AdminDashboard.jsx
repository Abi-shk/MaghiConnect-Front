import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [jobPosts, setJobPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [jobData, setJobData] = useState({
    title: "",
    description: "",
    requirements: "",
    location: "",
    salary: "",
  });
  const [editingJobId, setEditingJobId] = useState(null);
  const [editingJobData, setEditingJobData] = useState({
    title: "",
    description: "",
    requirements: "",
    location: "",
    salary: "",
  });
  
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Fetch Users
  useEffect(() => {
    if (!token) return;
    
    fetch("http://localhost:5000/api/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("Error fetching users:", err));
  }, [token]);

  // Fetch Job Posts
  useEffect(() => {
    if (!token) return;
    
    fetch("http://localhost:5000/api/candidates/job-posts", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setJobPosts(data))
      .catch((err) => console.error("Error fetching jobs:", err));
  }, [token]);

  // Handle Job Post Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const response = await fetch("http://localhost:5000/api/candidates/job-posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(jobData),
    });

    if (response.ok) {
      alert("Job Posted Successfully!");
      setJobData({ title: "", description: "", requirements: "", location: "", salary: "" });
      window.location.reload();
    } else {
      alert("Error posting job");
    }
  };

  const handleEditJob = (job) => {
    setEditingJobId(job._id);
    setEditingJobData({
      title: job.title,
      description: job.description,
      requirements: Array.isArray(job.requirements) ? job.requirements.join(", ") : job.requirements,
      location: job.location,
      salary: job.salary,
    });
  };
  const handleUpdateJob = async (e) => {
    e.preventDefault();
    const response = await fetch(`http://localhost:5000/api/candidates/edit/${editingJobId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...editingJobData,
        requirements: editingJobData.requirements.split(",").map((r) => r.trim()),
      }),
    });
  
    if (response.ok) {
      alert("Job updated successfully!");
      setEditingJobId(null);
      setEditingJobData({ title: "", description: "", requirements: "", location: "", salary: "" });
      window.location.reload();
    } else {
      alert("Error updating job.");
    }
  };
  const handleDeleteJob = async (id) => {
    if (confirm("Are you sure you want to delete this job post?")) {
      const response = await fetch(`http://localhost:5000/api/candidates/delete/job-posts/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (response.ok) {
        alert("Job deleted");
        setJobPosts(jobPosts.filter((job) => job._id !== id));
      } else {
        alert("Error deleting job");
      }
    }
  };
  
  const handleDeleteUser = async (id) => {
    if (confirm("Are you sure you want to delete this user?")) {
      const response = await fetch(`http://localhost:5000/api/candidates/delete/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        alert("User deleted");
        setUsers(users.filter((u) => u._id !== id));
      } else {
        alert("Error deleting user");
      }
    }
  };
  

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Admin Dashboard</h2>
        <button onClick={handleLogout} className="bg-red-500 p-2 rounded hover:bg-red-600">Logout</button>
      </div>

      {/* Add Job Post Form */}
      <div className="bg-gray-800 p-4 rounded-lg mb-6">
        <h3 className="text-xl font-semibold mb-2">Post a Job</h3>
        <form onSubmit={handleSubmit} className="grid gap-2">
          <input
            type="text"
            placeholder="Job Title"
            className="p-2 bg-gray-700 rounded"
            value={jobData.title}
            onChange={(e) => setJobData((prev) => ({ ...prev, title: e.target.value }))}
            required
          />
          <textarea
            placeholder="Job Description"
            className="p-2 bg-gray-700 rounded"
            value={jobData.description}
            onChange={(e) => setJobData((prev) => ({ ...prev, description: e.target.value }))}
            required
          />
          <input
            type="text"
            placeholder="Requirements (comma-separated)"
            className="p-2 bg-gray-700 rounded"
            value={jobData.requirements}
            onChange={(e) => setJobData((prev) => ({ ...prev, requirements: e.target.value.split(",") }))}
            required
          />
          <input
            type="text"
            placeholder="Location"
            className="p-2 bg-gray-700 rounded"
            value={jobData.location}
            onChange={(e) => setJobData((prev) => ({ ...prev, location: e.target.value }))}
            required
          />
          <input
            type="text"
            placeholder="Salary"
            className="p-2 bg-gray-700 rounded"
            value={jobData.salary}
            onChange={(e) => setJobData((prev) => ({ ...prev, salary: e.target.value }))}
            required
          />
          <button className="bg-blue-500 p-2 rounded hover:bg-blue-600">Post Job</button>
        </form>
      </div>
     
      {editingJobId && (
  <div className="bg-gray-800 p-4 rounded-lg mb-6">
    <h3 className="text-xl font-semibold mb-2">Edit Job Post</h3>
    <form onSubmit={handleUpdateJob} className="grid gap-2">
      <input
        type="text"
        placeholder="Job Title"
        className="p-2 bg-gray-700 rounded"
        value={editingJobData.title}
        onChange={(e) => setEditingJobData({ ...editingJobData, title: e.target.value })}
        required
      />
      <textarea
        placeholder="Job Description"
        className="p-2 bg-gray-700 rounded"
        value={editingJobData.description}
        onChange={(e) => setEditingJobData({ ...editingJobData, description: e.target.value })}
        required
      />
      <input
        type="text"
        placeholder="Requirements (comma-separated)"
        className="p-2 bg-gray-700 rounded"
        value={editingJobData.requirements}
        onChange={(e) => setEditingJobData({ ...editingJobData, requirements: e.target.value })}
        required
      />
      <input
        type="text"
        placeholder="Location"
        className="p-2 bg-gray-700 rounded"
        value={editingJobData.location}
        onChange={(e) => setEditingJobData({ ...editingJobData, location: e.target.value })}
        required
      />
      <input
        type="text"
        placeholder="Salary"
        className="p-2 bg-gray-700 rounded"
        value={editingJobData.salary}
        onChange={(e) => setEditingJobData({ ...editingJobData, salary: e.target.value })}
        required
      />
      <div className="flex gap-2">
        <button type="submit" className="bg-green-500 p-2 rounded hover:bg-green-600">Update Job</button>
        <button type="button" className="bg-gray-500 p-2 rounded hover:bg-gray-600" onClick={() => setEditingJobId(null)}>Cancel</button>
      </div>
    </form>
  </div>
)}


      {/* Display Job Posts */}
      <h3 className="text-xl font-semibold">Job Listings</h3>
      <div className="bg-gray-800 p-4 rounded-lg mb-6">
      {jobPosts.map((job) => (
  <div key={job._id} className="border-b border-gray-700 p-2">
    <h4 className="text-lg">{job.title}</h4>
    <p>{job.description}</p>
    <p>
      {Array.isArray(job.requirements)
        ? job.requirements.map((req, index, arr) => (
            <span key={index}>
              {req.trim()} {index !== arr.length - 1 && " - "}
            </span>
          ))
        : job.requirements}
    </p>
    <span className="text-sm text-gray-400">{job.location} - {job.salary}</span>
    <div className="mt-2 flex gap-3">
      <button
        onClick={() => handleEditJob(job)}
        className="text-yellow-400 hover:text-yellow-500 text-sm"
      >
        Edit
      </button>
      <button
        onClick={() => handleDeleteJob(job._id)}
        className="text-red-400 hover:text-red-600 text-sm"
      >
        Delete
      </button>
    </div>
  </div>
))}

      </div>

      {/* Display Users */}
      <h3 className="text-xl font-semibold">Registered Users</h3>
      <div className="bg-gray-800 p-4 rounded-lg">
      {users.length > 0 ? (
  <div className="overflow-x-auto">
    <table className="min-w-full border border-gray-600 text-left text-sm">
      <thead className="bg-gray-800 text-white">
        <tr>
          <th className="p-2 border-b border-gray-600">Name</th>
          <th className="p-2 border-b border-gray-600">Email</th>
          <th className="p-2 border-b border-gray-600">Action</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user._id} className="hover:bg-gray-700">
            <td className="p-2 border-b border-gray-600">{user.name}</td>
            <td className="p-2 border-b border-gray-600">{user.email}</td>
            <td className="p-2 border-b border-gray-600">
              <button
                onClick={() => handleDeleteUser(user._id)}
                className="text-red-400 hover:text-red-600 text-sm"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
) : (
  <p className="text-gray-400">No registered users found.</p>
)}
      </div>
    </div>
  );
};

export default AdminDashboard;
