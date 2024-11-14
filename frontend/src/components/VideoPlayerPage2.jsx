// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { DashPlayer } from "./DashPlayer2";
// import axios from "axios";

// export const VideoPlayerPage = () => {
//   const navigate = useNavigate();
//   const { file: initialVideoId } = useParams();
//   const [videos, setVideos] = useState(initialVideoId ? [initialVideoId] : []); // Holds array of videos
//   const [currentVideoIndex, setCurrentVideoIndex] = useState(0); // Tracks the currently displayed video
//   const [playing, setPlaying] = useState(false); // Tracks play/pause state
//   const [liked, setLiked] = useState(null); // Tracks like/dislike state for the current video
//   const playerRef = useRef(null);

//   // Load initial videos on component mount
//   useEffect(() => {
//     const fn = async () => {
//       const isAuth = await axios.post(
//         "http://bubbleguppies.cse356.compas.cs.stonybrook.edu/api/check-auth",
//         { withCredentials: true }
//       ).data;
//       if (!isAuth.error) {
//         console.log("navigating to login");
//         navigate("/login");
//       }
//       axios
//         .post("/api/videos", { count: 5 }) // Request initial batch of videos
//         .then((response) => {
//           print(response.data.videos);
//           setVideos([...videos, ...response.data.videos.map((e) => e.id)]);
//         })
//         .catch((error) => console.error("Error fetching videos:", error));
//     };
//     fn();
//   }, []);

//   // Handle scroll to advance video index in both directions
//   const handleScroll = (event) => {
//     // Determine scroll direction: down (positive deltaY), up (negative deltaY)
//     const isScrollingDown = event.deltaY > 0;
//     const isScrollingUp = event.deltaY < 0;

//     console.log(`isScrollingDown: ${isScrollingDown}`);
//     console.log(`isScrollingUp: ${isScrollingUp}`);

//     // If scrolling down and not at the last video, advance to next video
//     if (isScrollingDown && currentVideoIndex < videos.length - 1) {
//       setCurrentVideoIndex((prevIndex) => prevIndex + 1);
//     }

//     // If scrolling up and not at the first video, go to the previous video
//     if (isScrollingUp && currentVideoIndex > 0) {
//       setCurrentVideoIndex((prevIndex) => prevIndex - 1);
//     }

//     // If the current video is the last one and scrolling down, fetch more videos
//     if (isScrollingDown && currentVideoIndex === videos.length - 1) {
//       axios
//         .post("/api/videos", { count: 5 })
//         .then((response) => {
//           setVideos([...videos, ...response.data.videos.map((e) => e.id)]);
//         })
//         .catch((error) => console.error("Error fetching more videos:", error));
//     }

//     // If the current video is the first one and scrolling up, do nothing
//     // No action needed as the user is already at the first video
//   };

//   // Play or pause the current video
//   const togglePlay = () => {
//     if (playerRef.current) {
//       if (playing) {
//         playerRef.current.pause();
//       } else {
//         playerRef.current.play();
//       }
//       setPlaying(!playing);
//     }
//   };

//   // Like or dislike the current video
//   const handleLike = (value) => {
//     const videoId = videos[currentVideoIndex].id;
//     axios
//       .post("/api/like", { id: videoId, value })
//       .then((response) => {
//         setLiked(value);
//       })
//       .catch((error) => {
//         if (error.response && error.response.status === 400) {
//           console.error("Cannot relike/dislike the video");
//         }
//       });
//   };

//   // Trigger when Dash player is ready
//   const onPlayerReady = (player) => {
//     playerRef.current = player;
//     playerRef.current.on(dashjs.MediaPlayer.events.PLAYBACK_ENDED, () => {
//       // When the current video ends, move to the next video if available
//       if (currentVideoIndex < videos.length - 1) {
//         setCurrentVideoIndex((prevIndex) => prevIndex + 1);
//       }
//     });
//   };

//   // Detect scroll for advancing video index and infinite scroll
//   useEffect(() => {
//     // Add scroll event listener once when the component is mounted
//     window.addEventListener("wheel", handleScroll, { passive: true });

//     // Cleanup event listener when the component unmounts
//     return () => {
//       window.removeEventListener("wheel", handleScroll);
//     };
//   }, []); // Empty dependency array means this effect runs only once on mount

//   return (
//     <div>
//       <div className="video-container">
//         {videos.length > 0 && (
//           <DashPlayer
//             videoUrl={`/api/manifest/${videos[currentVideoIndex].replace(
//               "mp4",
//               "mpd"
//             )}`}
//             onPlayerReady={onPlayerReady}
//           />
//         )}
//       </div>

//       <div className="video-controls">
//         {/* Play/Pause controlled by a single div */}
//         <div id="playPauseBtn" onClick={togglePlay}>
//           {playing ? "Pause" : "Play"}
//         </div>
//         <button onClick={() => handleLike(true)} disabled={liked === true}>
//           Like
//         </button>
//         <button onClick={() => handleLike(false)} disabled={liked === false}>
//           Dislike
//         </button>
//       </div>
//     </div>
//   );
// };

import React, { useState, useEffect, useRef, useCallback } from "react";
import { createPath, useNavigate, useParams } from "react-router-dom";
import { DashPlayer } from "./DashPlayer2";
import axios from "axios";
import "./video-player-page.css";

export const VideoPlayerPage = () => {
  const navigate = useNavigate();
  const { file: initialVideoId } = useParams();
  const [videos, setVideos] = useState(initialVideoId ? [initialVideoId] : []);
  const [playing, setPlaying] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [playersState, setPlayersState] = useState([
    { index: 0, visible: true },
    { index: 1, visible: false },
    { index: 2, visible: false },
    { index: 3, visible: false },
    { index: 4, visible: false },
    { index: 5, visible: false },
    { index: 6, visible: false },
    { index: 7, visible: false },
    { index: 8, visible: false },
    { index: 9, visible: false },
    { index: 10, visible: false },
    { index: 11, visible: false },
    { index: 12, visible: false },
  ]);
  const playerRef = useRef([
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ]);

  // Load initial videos on component mount
  useEffect(() => {
    const fn = async () => {
      playerRef.current[currentPlayer].play();
      setPlaying(true);

      const isAuth = (
        await axios.post(
          "http://bubbleguppies.cse356.compas.cs.stonybrook.edu/api/check-auth",
          { withCredentials: true }
        )
      ).data;

      if (isAuth.error) {
        console.log("navigating to login");
        navigate("/login");
      } else {
        try {
          const response = await axios.post("/api/videos", {
            count: playersState.length + 3,
          });
          setVideos([...videos, ...response.data.videos.map((e) => e.id)]);
        } catch (error) {
          console.error("Error fetching videos:", error);
        }
      }
    };
    fn();
  }, []);

  const advanceVideo = () => {
    console.log("advancing video");
    playerRef.current[currentPlayer].pause();
    setPlaying(false);
    setPlayersState((prev) => {
      const newPlayersState = JSON.parse(JSON.stringify(playersState));
      console.log(
        "initial copy of player state: " + JSON.stringify(newPlayersState)
      );
      newPlayersState[currentPlayer].visible = false;
      newPlayersState[currentPlayer].index =
        newPlayersState.at(currentPlayer - 1).index + 1;
      newPlayersState[(currentPlayer + 1) % playersState.length].visible = true;
      console.log(
        "| [Advancing video]:\n" +
          "  oldPlayersState: " +
          JSON.stringify(playersState) +
          "  newPlayersState: " +
          JSON.stringify(newPlayersState)
      );
      return newPlayersState;
    });
    if (
      playersState[currentPlayer].index >=
      videos.length - playersState.length - 2
    ) {
      axios
        .post("/api/videos", { count: 5 })
        .then((response) => {
          setVideos((prevVideos) => [
            ...prevVideos,
            ...response.data.videos.map((e) => e.id),
          ]);
        })
        .catch((error) => console.error("Error fetching more videos:", error));
    }
    playerRef.current[(currentPlayer + 1) % playersState.length].play();
    setPlaying(true);
    setCurrentPlayer((prev) => (prev + 1) % playersState.length);
  };
  const reverseVideo = () => {
    console.log("reversing video");
    playerRef.current[currentPlayer].pause();
    setPlaying(false);
    setPlayersState((prev) => {
      const newPlayersState = JSON.parse(JSON.stringify(playersState));
      console.log(
        "initial copy of player state" + JSON.stringify(newPlayersState)
      );
      newPlayersState[currentPlayer].visible = false;
      newPlayersState.at(currentPlayer - 1).index =
        newPlayersState[currentPlayer].index - 1;
      newPlayersState.at(currentPlayer - 1).visible = true;
      console.log(
        "| [Reversing video]:\n" +
          "  oldPlayersState: " +
          JSON.stringify(playersState) +
          "  newPlayersState: " +
          JSON.stringify(newPlayersState)
      );
      return newPlayersState;
    });
    playerRef.current[
      (currentPlayer - 1 + playersState.length) % playersState.length
    ].play();
    setPlaying(true);
    setCurrentPlayer(
      (prev) => (prev - 1 + playersState.length) % playersState.length
    );
  };

  // Handle scroll to advance video index
  const handleScroll = useCallback(
    (event) => {
      const isScrollingDown = event.deltaY > 0;
      const isScrollingUp = event.deltaY < 0;

      if (
        isScrollingDown &&
        playersState[currentPlayer].index < videos.length - 1
      ) {
        const currentPlayerCache = currentPlayer;
        advanceVideo();
        navigate(
          "/play/" + videos[playersState[currentPlayerCache].index + 1],
          {
            replace: true,
          }
        );
      } else if (isScrollingUp && playersState[currentPlayer].index > 0) {
        const currentPlayerCache = currentPlayer;
        reverseVideo();
        navigate(
          "/play/" + videos[playersState[currentPlayerCache].index - 1],
          {
            replace: true,
          }
        );
      }
    },
    [playersState, videos.length]
  );

  // Attach scroll listener
  useEffect(() => {
    window.addEventListener("wheel", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("wheel", handleScroll);
    };
  }, [handleScroll]);

  const togglePlay = () => {
    if (playerRef.current[currentPlayer]) {
      if (playing) {
        playerRef.current[currentPlayer].pause();
        setPlaying(false);
      } else {
        playerRef.current[currentPlayer].play();
        setPlaying(true);
      }
    }
  };

  const handleLike = (value) => {
    const videoId = videos[playersState[currentPlayer].index];
    axios
      .post("/api/like", { id: videoId, value })
      .then(() => {})
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          console.error("Cannot relike/dislike the video");
        }
      });
  };

  const onPlayerReady = (index) => {
    return (player) => {
      playerRef.current[index] = player;
      // playerRef.current[index].on(dashjs.MediaPlayer.events.PLAYBACK_ENDED, () => {
      //   if (playersState[currentPlayer].index < videos.length - 1) {
      //     const currentPlayerCache = currentPlayer;
      //     advanceVideo();
      //     navigate(
      //       "/play/" + videos[playersState[currentPlayerCache].index + 1],
      //       {
      //         replace: true,
      //       }
      //     );
      //   }
      // });
    };
  };

  return (
    <div className="video-container">
      <div className="video-wrapper">
        {videos.length > 0 && (
          <DashPlayer
            videoUrl={`/api/manifest/${videos[playersState[0].index].replace(
              "mp4",
              "mpd"
            )}`}
            onPlayerReady={onPlayerReady(0)}
            visible={playersState[0].visible}
          />
        )}
        {videos.length > 1 && (
          <DashPlayer
            videoUrl={`/api/manifest/${videos[playersState[1].index].replace(
              "mp4",
              "mpd"
            )}`}
            onPlayerReady={onPlayerReady(1)}
            visible={playersState[1].visible}
          />
        )}
        {videos.length > 2 && (
          <DashPlayer
            videoUrl={`/api/manifest/${videos[playersState[2].index].replace(
              "mp4",
              "mpd"
            )}`}
            onPlayerReady={onPlayerReady(2)}
            visible={playersState[2].visible}
          />
        )}
        {videos.length > 3 && (
          <DashPlayer
            videoUrl={`/api/manifest/${videos[playersState[3].index].replace(
              "mp4",
              "mpd"
            )}`}
            onPlayerReady={onPlayerReady(3)}
            visible={playersState[3].visible}
          />
        )}
        {videos.length > 4 && (
          <DashPlayer
            videoUrl={`/api/manifest/${videos[playersState[4].index].replace(
              "mp4",
              "mpd"
            )}`}
            onPlayerReady={onPlayerReady(4)}
            visible={playersState[4].visible}
          />
        )}
        {videos.length > 5 && (
          <DashPlayer
            videoUrl={`/api/manifest/${videos[playersState[5].index].replace(
              "mp4",
              "mpd"
            )}`}
            onPlayerReady={onPlayerReady(5)}
            visible={playersState[5].visible}
          />
        )}

        {videos.length > 6 && (
          <DashPlayer
            videoUrl={`/api/manifest/${videos[playersState[6].index].replace(
              "mp4",
              "mpd"
            )}`}
            onPlayerReady={onPlayerReady(6)}
            visible={playersState[6].visible}
          />
        )}

        {videos.length > 7 && (
          <DashPlayer
            videoUrl={`/api/manifest/${videos[playersState[7].index].replace(
              "mp4",
              "mpd"
            )}`}
            onPlayerReady={onPlayerReady(7)}
            visible={playersState[7].visible}
          />
        )}

        {videos.length > 8 && (
          <DashPlayer
            videoUrl={`/api/manifest/${videos[playersState[8].index].replace(
              "mp4",
              "mpd"
            )}`}
            onPlayerReady={onPlayerReady(8)}
            visible={playersState[8].visible}
          />
        )}
        {videos.length > 9 && (
          <DashPlayer
            videoUrl={`/api/manifest/${videos[playersState[9].index].replace(
              "mp4",
              "mpd"
            )}`}
            onPlayerReady={onPlayerReady(9)}
            visible={playersState[9].visible}
          />
        )}

        {videos.length > 10 && (
          <DashPlayer
            videoUrl={`/api/manifest/${videos[playersState[10].index].replace(
              "mp4",
              "mpd"
            )}`}
            onPlayerReady={onPlayerReady(10)}
            visible={playersState[10].visible}
          />
        )}
        {videos.length > 11 && (
          <DashPlayer
            videoUrl={`/api/manifest/${videos[playersState[11].index].replace(
              "mp4",
              "mpd"
            )}`}
            onPlayerReady={onPlayerReady(11)}
            visible={playersState[11].visible}
          />
        )}
        {videos.length > 12 && (
          <DashPlayer
            videoUrl={`/api/manifest/${videos[playersState[12].index].replace(
              "mp4",
              "mpd"
            )}`}
            onPlayerReady={onPlayerReady(12)}
            visible={playersState[12].visible}
          />
        )}
      </div>
      <div className="video-controls">
        <div id="playPauseBtn" onClick={togglePlay}>
          {playing ? "Pause" : "Play"}
        </div>
        <button name="like" onClick={() => handleLike(true)}>
          Like
        </button>
        <button name="dislike" onClick={() => handleLike(false)}>
          Dislike
        </button>
      </div>
    </div>
  );
};
