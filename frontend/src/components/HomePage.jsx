// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// export const HomePage = () => {
//   const [videos, setVideos] = useState([]);
//   const navigate = useNavigate();

//   // Fetch the list of videos when the component is mounted
//   useEffect(() => {
//     const fetchVideos = async () => {
//       try {
//         // Fetch the list of videos
//         const response = await axios.post("/api/videos", { count: 10 });
//         const videoList = response.data.videos;

//         // Update the state with the video data
//         setVideos(videoList);
//       } catch (error) {
//         console.error("Error fetching videos:", error);
//       }
//     };

//     fetchVideos();
//   }, []);

//   // Handle navigation to the play page when a thumbnail is clicked
//   const handleThumbnailClick = (id) => {
//     navigate(`/play/${id}`);
//   };

//   return (
//     <div className="home-page">
//       <h1>Video Library</h1>
//       <div className="video-thumbnails">
//         {videos.map((video) => (
//           <div
//             key={video.id}
//             className="video-thumbnail"
//             onClick={() => handleThumbnailClick(video.id)}
//             style={{ cursor: "pointer" }}
//           >
//             {/* Directly use the src link for the thumbnail */}
//             <img
//               src={`/api/thumbnail/${video.id.replace(".mp4", ".jpg")}`} // Assuming the backend serves the thumbnail images at this URL pattern
//               alt={video.title}
//               className="thumbnail-img"
//             />
//             <h3>{video.title}</h3>
//             <p>{video.description}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./home-page.css";

export const HomePage = () => {
  const [videos, setVideos] = useState([]);
  const navigate = useNavigate();

  // Fetch the list of videos when the component is mounted
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        // Fetch the list of videos
        const response = await axios.post("/api/videos", { count: 10 });
        const videoList = response.data.videos;

        // Update the state with the video data
        setVideos(videoList);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };

    fetchVideos();
  }, []);

  // Handle navigation to the play page when a thumbnail is clicked
  const handleThumbnailClick = (id) => {
    navigate(`/play/${id}`);
  };

  return (
    <div className="home-page">
      <h1>Video Library</h1>
      <div className="video-thumbnails">
        {videos.map((video) => (
          <div
            key={video.id}
            className="video-thumbnail"
            onClick={() => handleThumbnailClick(video.id)}
            style={{ cursor: "pointer" }}
          >
            {/* Directly use the src link for the thumbnail */}
            <img
              src={`/api/thumbnail/${video.id.replace(".mp4", ".jpg")}`} // Assuming the backend serves the thumbnail images at this URL pattern
              alt={video.title}
              className="thumbnail-img"
            />
            <h3>{video.title}</h3>
            <p>{video.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
