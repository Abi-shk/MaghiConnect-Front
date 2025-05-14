import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

const Login = () => {
  const [email, setEmail] = useState("");  
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const isProfileCompleted = localStorage.getItem("isProfileCompleted");

    if (token) {
      if (isProfileCompleted === "true") {
        navigate("/"); // Redirect to home if profile is completed
      } else {
        navigate("/profile"); // Redirect to profile if not completed
      }
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("https://maghiconnect.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("token", data.token); // Save token
      localStorage.setItem("isProfileCompleted", data.isProfileCompleted); // Save profile status

      alert("Login successful!");

      // Redirect based on profile completion status
      if (data.isProfileCompleted) {
        navigate("/"); // If profile completed, go to Home
      } else {
        navigate("/profile"); // If profile not completed, go to Profile
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <div className="flex items-center justify-center min-h-screen bg-gray-300">
      <div className="p-8 shadow-lg bg-gray-300 rounded-xl border border-gray-400 w-96 text-black">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-600">Login</h2>
        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-blue-400 focus:ring focus:ring-blue-400 outline-none"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-blue-400 focus:ring focus:ring-blue-400 outline-none"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-blue-500 rounded-lg font-semibold hover:bg-blue-600 transition-all duration-300 text-white"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
      <Footer />
    </>
  );
};

export default Login;
