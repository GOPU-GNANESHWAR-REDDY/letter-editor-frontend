import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import axios from 'axios';
import 'react-quill/dist/quill.snow.css';

const BACKEND_URL = 'https://letter-editor-buen.onrender.com'; // ✅ Correct backend URL

const LetterEditor = ({ onSave }) => {
  const [content, setContent] = useState('');

  const handleSave = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      alert('You must be logged in to save letters.');
      return;
    }

    try {
      const response = await axios.post(
        `${BACKEND_URL}/save-letter`, // ✅ Correct API URL
        { content },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(`Letter saved! View it here: ${response.data.fileUrl}`);
      onSave(content);
    } catch (error) {
      console.error('Error saving letter:', error);
      alert('Failed to save letter.');
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <h2>Write Your Letter</h2>
      <ReactQuill value={content} onChange={setContent} />
      <button onClick={handleSave} style={{ marginTop: '10px' }}>
        Save Letter
      </button>
    </div>
  );
};

export default LetterEditor;

