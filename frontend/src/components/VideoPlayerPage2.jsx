import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DashPlayer } from "./DashPlayer2";
import axios from "axios";

export const VideoPlayerPage = () => {
  const navigate = useNavigate();
  const { file: initialVideoId } = useParams();
  const [videos, setVideos] = useState(initialVideoId ? [initialVideoId] : []); // Holds array of videos
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0); // Tracks the currently displayed video
  const [playing, setPlaying] = useState(false); // Tracks play/pause state
  const [liked, setLiked] = useState(null); // Tracks like/dislike state for the current video
  const playerRef = useRef(null);

  // Load initial videos on component mount
  useEffect(() => {
    const fn = async () => {
      const isAuth = await axios.post(
        "http://bubbleguppies.cse356.compas.cs.stonybrook.edu/api/check-auth",
        { withCredentials: true }
      ).data;
      if (!isAuth.error) {
        console.log("navigating to login");
        navigate("/login");
      }
      axios
        .post("/api/videos", { count: 5 }) // Request initial batch of videos
        .then((response) => {
          print(response.data.videos);
          setVideos([...videos, ...response.data.videos.map((e) => e.id)]);
        })
        .catch((error) => console.error("Error fetching videos:", error));
    };
    fn();
  }, []);

  // Handle scroll to advance video index in both directions
  const handleScroll = (event) => {
    // Determine scroll direction: down (positive deltaY), up (negative deltaY)
    const isScrollingDown = event.deltaY > 0;
    const isScrollingUp = event.deltaY < 0;

    console.log(`isScrollingDown: ${isScrollingDown}`);
    console.log(`isScrollingUp: ${isScrollingUp}`);

    // If scrolling down and not at the last video, advance to next video
    if (isScrollingDown && currentVideoIndex < videos.length - 1) {
      setCurrentVideoIndex((prevIndex) => prevIndex + 1);
    }

    // If scrolling up and not at the first video, go to the previous video
    if (isScrollingUp && currentVideoIndex > 0) {
      setCurrentVideoIndex((prevIndex) => prevIndex - 1);
    }

    // If the current video is the last one and scrolling down, fetch more videos
    if (isScrollingDown && currentVideoIndex === videos.length - 1) {
      axios
        .post("/api/videos", { count: 5 })
        .then((response) => {
          setVideos([...videos, ...response.data.videos.map((e) => e.id)]);
        })
        .catch((error) => console.error("Error fetching more videos:", error));
    }

    // If the current video is the first one and scrolling up, do nothing
    // No action needed as the user is already at the first video
  };

  // Play or pause the current video
  const togglePlay = () => {
    if (playerRef.current) {
      if (playing) {
        playerRef.current.pause();
      } else {
        playerRef.current.play();
      }
      setPlaying(!playing);
    }
  };

  // Like or dislike the current video
  const handleLike = (value) => {
    const videoId = videos[currentVideoIndex].id;
    axios
      .post("/api/like", { id: videoId, value })
      .then((response) => {
        setLiked(value);
      })
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          console.error("Cannot relike/dislike the video");
        }
      });
  };

  // Trigger when Dash player is ready
  const onPlayerReady = (player) => {
    playerRef.current = player;
    playerRef.current.on(dashjs.MediaPlayer.events.PLAYBACK_ENDED, () => {
      // When the current video ends, move to the next video if available
      if (currentVideoIndex < videos.length - 1) {
        setCurrentVideoIndex((prevIndex) => prevIndex + 1);
      }
    });
  };

  // Detect scroll for advancing video index and infinite scroll
  useEffect(() => {
    // Add scroll event listener once when the component is mounted
    window.addEventListener("wheel", handleScroll, { passive: true });

    // Cleanup event listener when the component unmounts
    return () => {
      window.removeEventListener("wheel", handleScroll);
    };
  }, []); // Empty dependency array means this effect runs only once on mount

  return (
    <div>
      <div className="video-container">
        {videos.length > 0 && (
          <DashPlayer
            videoUrl={`/api/manifest/${videos[currentVideoIndex].replace(
              "mp4",
              "mpd"
            )}`}
            onPlayerReady={onPlayerReady}
          />
        )}
      </div>

      <div className="video-controls">
        {/* Play/Pause controlled by a single div */}
        <div id="playPauseBtn" onClick={togglePlay}>
          {playing ? "Pause" : "Play"}
        </div>
        <button onClick={() => handleLike(true)} disabled={liked === true}>
          Like
        </button>
        <button onClick={() => handleLike(false)} disabled={liked === false}>
          Dislike
        </button>
      </div>
    </div>
  );
};
