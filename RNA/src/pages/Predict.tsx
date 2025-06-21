import React, { useState } from "react";
import axios from "axios";

const FileUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [predictions, setPredictions] = useState<string[] | number[] | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("http://localhost:5000/predict", formData);
      setPredictions(res.data.predictions);
    } catch (err) {
      console.error(err);
      alert("Error during prediction.");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Upload CSV and Predict</h2>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <br /><br />
      <button onClick={handleSubmit} disabled={!file}>
        Submit
      </button>

      {predictions && (
        <div style={{ marginTop: 20 }}>
          <h3>Predictions:</h3>
          <ul>
            {predictions.map((pred, idx) => (
              <li key={idx}>{pred}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
