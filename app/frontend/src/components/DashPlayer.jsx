import React, { useEffect, useRef, useState } from "react";
import dashjs from "dashjs";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";


// export const DashPlayer = ({ url, onPlayerReady }) => {
//   const videoRef = useRef(null);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [availableQualities, setAvailableQualities] = useState([]);
//   const player = useRef(null);

//   useEffect(() => {
//     player.current = dashjs.MediaPlayer().create();
//     player.current.initialize(videoRef.current, url, true);

//     // Call onPlayerReady when the player is ready
//     onPlayerReady(player.current);

//     // Fetch available qualities
//     player.current.on(
//       dashjs.MediaPlayer.events.QUALITY_CHANGE_REQUESTED,
//       () => {
//         setAvailableQualities(player.current.getBitrateInfoListFor("video"));
//       }
//     );

//     return () => {
//       player.current.reset();
//     };
//   }, [url, onPlayerReady]);

//   const togglePlayPause = () => {
//     if (isPlaying) {
//       player.current.pause();
//     } else {
//       player.current.play();
//     }
//     setIsPlaying(!isPlaying);
//   };

//   const setQuality = (index) => {
//     player.current.setQualityFor("video", index);
//   };

//   const likeVideo = () => {
//     // Implement like video functionality here
//     console.log("Liked video!");
//   };

//   const dislikeVideo = () => {
//     // Implement dislike video functionality here
//     console.log("Disliked video!");
//   };

//   return (
//     <div>
//       <video ref={videoRef} controls style={{ width: "100%" }} />
//       <div className="video-controls">
//         <button onClick={togglePlayPause}>
//           {isPlaying ? "Pause" : "Play"}
//         </button>

//         <button onClick={likeVideo}>Like</button>
//         <button onClick={dislikeVideo}>Dislike</button>

//         <button onClick={() => setAvailableQualities((prev) => !prev)}>
//           {availableQualities.length > 0
//             ? "Hide Resolutions"
//             : "Show Resolutions"}
//         </button>
//         {availableQualities.length > 0 && (
//           <div className="resolution-menu">
//             <ul>
//               {availableQualities.map((quality, index) => (
//                 <li key={index} onClick={() => setQuality(index)}>
//                   {`${Math.floor(quality.bitrate / 1000)} (${quality.width}x${
//                     quality.height
//                   })`}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

export const DashPlayer = ({ url, onPlayerReady }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showQualities, setShowQualities] = useState(false);
  const [availableQualities, setAvailableQualities] = useState([]);
  const player = useRef(null);

  useEffect(() => {
    player.current = dashjs.MediaPlayer().create();
    player.current.initialize(videoRef.current, url, true);

    // Call onPlayerReady when the player is ready
    onPlayerReady(player.current);

    // Fetch available qualities
    player.current.on(dashjs.MediaPlayer.events.QUALITY_CHANGE_REQUESTED, () => {
      setAvailableQualities(player.current.getBitrateInfoListFor("video"));
    });

    return () => {
      player.current.reset();
    };
  }, [url, onPlayerReady]);

  const togglePlayPause = () => {
    if (isPlaying) {
      player.current.pause();
    } else {
      player.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const setQuality = (index) => {
    player.current.setQualityFor("video", index);
  };

  async function likeVideo(event){
    let videoID = url.split("/").pop().split(".")[0] + ".mp4";
    console.log("THE VIDEO ID:", videoID);
    axios.post('https://bubbleguppies.cse356.compas.cs.stonybrook.edu/api/like', {id: videoID, value: true })
  }
  async function dislikeVideo(event){
    let videoID = url.split("/").pop().split(".")[0] + ".mp4";
    console.log("THE VIDEO ID:", videoID);
      axios.post('https://bubbleguppies.cse356.compas.cs.stonybrook.edu/api/like', {id: videoID, value: false })
  }

  return (
    <div>
      <video ref={videoRef} controls style={{ width: "100%" }} />
      <div className="video-controls">
      <div id="playPauseBtn" onClick={togglePlayPause} style={{ cursor: "pointer", display: "inline-block", padding: "8px", backgroundColor: "#ccc", borderRadius: "4px" }}>
        {isPlaying ? "Pause" : "Play"}
      </div>

        <div id='ratingButtonContainer' className='like-button-container'>
          <button onClick={likeVideo}>Like</button>
          <button onClick={dislikeVideo}>Dislike</button>
        </div>
        <button onClick={() => setShowQualities(!showQualities)}>
          {showQualities ? "Hide Resolutions" : "Show Resolutions"}
        </button>
        {showQualities && availableQualities.length > 0 && (
          <div className="resolution-menu">
            <ul>
              {availableQualities.map((quality, index) => (
                <li key={index} onClick={() => setQuality(index)}>
                  {`${Math.floor(quality.bitrate / 1000)} kbps (${quality.width}x${quality.height})`}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};