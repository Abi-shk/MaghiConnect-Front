import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [username, setUsername] = useState("");  // Use `username` instead of `email`
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    const response = await fetch("https://maghiconnect.onrender.com/api/auth/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),  // Send `username`
    });

    const data = await response.json();
    if (response.ok) {
      localStorage.setItem("token", data.token);
      navigate("/admin-dashboard");
    } else {
      alert("Login Failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="p-8 bg-gray-800 rounded-xl text-white w-80">
        <h2 className="text-2xl font-bold text-center mb-6">Admin Login</h2>
        <form onSubmit={handleLogin} className="grid gap-3">
          <input 
            type="text" 
            placeholder="Admin ID" 
            className="p-2 bg-gray-700 rounded"
            onChange={(e) => setUsername(e.target.value)} 
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="p-2 bg-gray-700 rounded"
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          <button className="bg-blue-500 p-2 rounded hover:bg-blue-600">Login</button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
