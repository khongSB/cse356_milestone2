import React, { useState } from 'react';
import axios from 'axios';

export function Upload() {
  const [video, setVideo] = useState(null);
  const [videoName, setVideoName] = useState('');
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState(''); // New state for description

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!video || !title || !author || !description) { // Check if description is filled
      alert('Please fill in all fields before submitting.');
      return;
    }

    const formData = new FormData();
    formData.append('mp4File', video);
    formData.append('title', title);
    formData.append('author', author);
    formData.append('description', description); // Append description to form data
    try {
      const response = await axios.post(
        'https://bubbleguppies.cse356.compas.cs.stonybrook.edu/api/upload',
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      alert('Upload successful!');
      console.log(response.data);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('There was an issue with the upload. Please try again.');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setVideo(file);
    setVideoName(file ? file.name : '');
  };

  return (
    <div id="mainContent" className="main-upload-content">
      <h1>Upload</h1>
      <div id="formContainer" className="form-container">
        <form className="upload-form" onSubmit={handleSubmit}>
          <div className="file-button-container">
            <label className="file-button">
              Choose Video
              <input
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </label>
            {videoName && <p className="file-name" style={{ color: 'black' }}>Selected file: {videoName}</p>}
          </div>
          <div className="metadata-form-container">
            <h2>Information</h2>
            <h3>Title</h3>
            <input
              type="text"
              className="video-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter video title"
            />
            <h3>Author</h3>
            <input
              type="text"
              className="video-author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Enter author name"
            />
            <h3>Description</h3>
            <textarea
              className="video-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter video description"
              rows="4"
            />
          </div>
          <hr className="line-break" />
          <div className="upload-button">
            <button type="submit">Upload</button>
          </div>
        </form>
      </div>
    </div>
  );
}