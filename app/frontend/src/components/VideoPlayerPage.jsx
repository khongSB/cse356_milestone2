import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import { DashPlayer } from "./DashPlayer";

export const VideoPlayerPage = () => {
  const navigate = useNavigate();
  const [initialVideos, setInitialVideos] = useState([]);
  const [videos, setVideos] = useState([]);

  const fetchInitialVideos = () => {
    console.log("Fetching initial videos");
    axios
      .post(
        "https://bubbleguppies.cse356.compas.cs.stonybrook.edu/api/videos",
        { count: 10 },
        { withCredentials: true }
      )
      .then((response) => {
        setInitialVideos((prevVideos) => [
          ...prevVideos,
          ...response.data.videos,
        ]);
      })
      .catch((error) => {
        console.error("Error fetching initial videos:", error);
      });
  };

  const fetchMoreVideos = () => {
    console.log("Fetching more videos");
    axios
      .post(
        "https://bubbleguppies.cse356.compas.cs.stonybrook.edu/api/videos",
        { count: 10, continue: true },
        { withCredentials: true }
      )
      .then((response) => {
        setVideos((prevVideos) => [...prevVideos, ...response.data.videos]);
      })
      .catch((error) => {
        console.error("Error fetching more videos:", error);
      });
  };

  useEffect(() => {
    axios
      .post(
        "https://bubbleguppies.cse356.compas.cs.stonybrook.edu/api/check-auth",
        { withCredentials: true }
      )
      .then((response) => {
        if (response.data.error) {
          navigate("/login");
        } else {
          fetchInitialVideos();
        }
      })
      .catch((error) => {
        console.error("Error checking login status:", error);
        navigate("/login");
      });
  }, [navigate]);

  return (
    <>
      <InfiniteScroll
        dataLength={videos.length + initialVideos.length}
        next={fetchMoreVideos}
        hasMore={true}
        loader={<h4>Loading...</h4>}
      >
        {initialVideos.concat(videos).map((video, index) => (
          <DashPlayer
            key={index}
            url={`/media/processed-media/manifests/${video.id}`}
            onPlayerReady={(player) => {
              // Additional player setup if needed
            }}
          />
        ))}
      </InfiniteScroll>
    </>
  );
};

// import React, { useEffect, useState, useRef } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import InfiniteScroll from "react-infinite-scroll-component";

// import { DashPlayer } from "./DashPlayer";

// export const VideoPlayerPage = () => {
//   const { file: initialVideoId } = useParams(); // Get the initial video ID from the URL
//   const [videos, setVideos] = useState(initialVideoId ? [initialVideoId] : []);

//   useEffect(() => {
//     console.log("initialVideoId: " + initialVideoId);
//     console.log("initial videos: " + JSON.stringify(videos));
//     if (initialVideoId) {
//       const fn = async () => {
//         await axios.post("/api/view", { id: initialVideoId });
//       };
//       fn();
//     }
//     fetchVideos();
//   }, []);

//   // Function to fetch videos
//   const fetchVideos = async () => {
//     try {
//       const response = await axios.post("/api/videos/", { count: 10 });
//       if (response.data.videos && response.data.videos.length > 0) {
//         const newVideos = response.data.videos.map((e) => e.id);
//         const fn = async (id) => {
//           await axios.post("/api/view", { id });
//         };
//         newVideos.forEach((e) => fn(e));

//         setVideos((prev) => [...prev, ...newVideos]);
//         console.log("new videos array: " + JSON.stringify(videos));
//       } else {
//       }
//     } catch (error) {
//       console.error("Error fetching videos:", error);
//     }
//   };

//   return (
//     <div>
//       <InfiniteScroll
//         dataLength={videos.length}
//         next={fetchVideos} // Fetch more videos on scroll
//         hasMore={true} // Control whether more videos can be loaded
//         loader={<h4>Loading more videos...</h4>}
//         scrollThreshold={0.8}
//       >
//         {videos.map((video, index) => (
//           <DashPlayer
//             key={index}
//             url={`/media/processed-media/manifests/${video.replace(
//               ".mp4",
//               ""
//             )}.mpd`}
//             onPlayerReady={(player) => {
//               // Additional player setup if needed
//             }}
//           />
//         ))}
//       </InfiniteScroll>
//     </div>
//   );
// };

// export const VideoPlayerPage = () => {
//   const { file: initialVideoId } = useParams(); // Get the initial video ID from the URL
//   const navigate = useNavigate();
//   const [videos, setVideos] = useState(initialVideoId ? [initialVideoId] : []);
//   const [currentVideoIndex, setCurrentVideoIndex] = useState(0); // Track the index of the currently visible video

//   useEffect(() => {
//     console.log("initialVideoId: " + initialVideoId);
//     console.log("initial videos: " + JSON.stringify(videos));
//     fetchVideos();
//   }, []);

//   // Function to fetch videos
//   const fetchVideos = async () => {
//     try {
//       const response = await axios.post("/api/videos/", { count: 10 });
//       if (response.data.videos && response.data.videos.length > 0) {
//         const newVideos = response.data.videos.map((e) => e.id);
//         setVideos((prev) => [...prev, ...newVideos]);
//         console.log("new videos array: " + JSON.stringify(videos));
//       }
//     } catch (error) {
//       console.error("Error fetching videos:", error);
//     }
//   };

//   // Update the URL when the current video index changes
//   useEffect(() => {
//     const currentVideoId = videos[currentVideoIndex];
//     if (currentVideoId) {
//       navigate(`/play/${currentVideoId}`, { replace: true });
//     }
//   }, [currentVideoIndex, videos, navigate]);

//   // Handle the visibility of videos
//   const handleVideoVisibility = (index) => {
//     setCurrentVideoIndex(index);
//   };

//   return (
//     <div>
//       <InfiniteScroll
//         dataLength={videos.length}
//         next={fetchVideos} // Fetch more videos on scroll
//         hasMore={true} // Control whether more videos can be loaded
//         loader={<h4>Loading more videos...</h4>}
//         scrollThreshold={0.8}
//       >
//         {videos.map((video, index) => (
//           <div
//             key={index}
//             ref={(element) => {
//               if (element) {
//                 const observer = new IntersectionObserver(
//                   ([entry]) => {
//                     if (entry.isIntersecting) {
//                       handleVideoVisibility(index);
//                     }
//                   },
//                   { threshold: 0.5 }
//                 );
//                 observer.observe(element);
//                 return () => observer.unobserve(element);
//               }
//             }}
//           >
//             <DashPlayer
//               url={`/media/processed-media/manifests/${video.replace(
//                 ".mp4",
//                 ""
//               )}.mpd`}
//               onPlayerReady={(player) => {
//                 // Additional player setup if needed
//               }}
//             />
//           </div>
//         ))}
//       </InfiniteScroll>
//     </div>
//   );
// };

// export const VideoPlayerPage = () => {
//   const { file: initialVideoId } = useParams(); // Get the initial video ID from the URL
//   const navigate = useNavigate();
//   const [videos, setVideos] = useState(initialVideoId ? [initialVideoId] : []);
//   const [currentVideoIndex, setCurrentVideoIndex] = useState(0); // Track the index of the currently visible video
//   const videoRefs = useRef([]); // Store references to video elements

//   useEffect(() => {
//     console.log("initialVideoId: " + initialVideoId);
//     console.log("initial videos: " + JSON.stringify(videos));
//     fetchVideos();
//   }, []);

//   // Function to fetch videos
//   const fetchVideos = async () => {
//     try {
//       const response = await axios.post("/api/videos/", { count: 10 });
//       if (response.data.videos && response.data.videos.length > 0) {
//         const newVideos = response.data.videos.map((e) => e.id);
//         setVideos((prev) => [...prev, ...newVideos]);
//         console.log("new videos array: " + JSON.stringify(videos));
//       }
//     } catch (error) {
//       console.error("Error fetching videos:", error);
//     }
//   };

//   // Update the URL when the current video index changes
//   useEffect(() => {
//     const currentVideoId = videos[currentVideoIndex];
//     if (currentVideoId) {
//       navigate(`/play/${currentVideoId}`, { replace: true });
//     }
//   }, [currentVideoIndex, videos, navigate]);

//   // Intersection observer setup
//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((entry) => {
//           if (entry.isIntersecting) {
//             const index = videoRefs.current.findIndex(
//               (ref) => ref === entry.target
//             );
//             if (index !== -1) {
//               setCurrentVideoIndex(index);
//             }
//           }
//         });
//       },
//       { threshold: 0.5 }
//     );

//     videoRefs.current.forEach((ref) => ref && observer.observe(ref));

//     // Cleanup observer on unmount
//     return () => {
//       videoRefs.current.forEach((ref) => ref && observer.unobserve(ref));
//     };
//   }, [videos]);

//   return (
//     <div>
//       <InfiniteScroll
//         dataLength={videos.length}
//         next={fetchVideos} // Fetch more videos on scroll
//         hasMore={true} // Control whether more videos can be loaded
//         loader={<h4>Loading more videos...</h4>}
//         scrollThreshold={0.8}
//       >
//         {videos.map((video, index) => (
//           <div
//             key={index}
//             ref={(el) => (videoRefs.current[index] = el)} // Assign refs to each video container
//           >
//             <DashPlayer
//               url={`/media/processed-media/manifests/${video.replace(
//                 ".mp4",
//                 ""
//               )}.mpd`}
//               onPlayerReady={(player) => {
//                 // Additional player setup if needed
//               }}
//             />
//           </div>
//         ))}
//       </InfiniteScroll>
//     </div>
//   );
// };
