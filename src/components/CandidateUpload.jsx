import { useState } from "react";
import axios from "axios";

const CandidateUpload = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [loginDetails, setLoginDetails] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return setMessage("Please select a file");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("http://localhost:5000/api/candidates/upload", formData);
      setMessage(res.data.message);
    } catch (error) {
      setMessage("Error uploading file");
    }
  };

  const handleSendEmail = async () => {
    if (!email || !loginDetails) return setMessage("Please enter both email and login details");

    try {
      const res = await axios.post("http://localhost:5000/api/candidates/create-candidate", {
        email,
        name: loginDetails,
      });
      setMessage(res.data.message);
    } catch (error) {
      setMessage("Error sending email");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Upload Candidate CSV</h2>
      <input type="file" accept=".csv" onChange={handleFileChange} className="mb-2" />
      <button onClick={handleUpload} className="bg-blue-600 text-white px-4 py-2 rounded">
        Upload
      </button>
      
      <h2 className="text-xl font-bold mt-4 mb-2">Send Email to Candidate</h2>
      <input
        type="email"
        placeholder="Candidate Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mb-2 p-2 border rounded w-full"
      />
      <input
        type="text"
        placeholder="Login Credentials"
        value={loginDetails}
        onChange={(e) => setLoginDetails(e.target.value)}
        className="mb-2 p-2 border rounded w-full"
      />
      <button onClick={handleSendEmail} className="bg-green-600 text-white px-4 py-2 rounded">
        Send Email
      </button>
      
      {message && <p className="mt-2 text-red-500">{message}</p>}
    </div>
  );
};

export default CandidateUpload;
