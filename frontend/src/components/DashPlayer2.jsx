import React, { useEffect, useRef } from "react";
import dashjs from "dashjs";

export const DashPlayer = ({ videoUrl, onPlayerReady }) => {
  const playerRef = useRef(null);

  useEffect(() => {
    console.log(videoUrl);
    // Initialize dash.js player when video URL is set
    if (videoUrl) {
      const player = dashjs.MediaPlayer().create();
      player.initialize(playerRef.current, videoUrl, true);

      // Call the onPlayerReady callback
      if (onPlayerReady) {
        onPlayerReady(player);
      }

      return () => {
        // Cleanup when component unmounts
        player.destroy();
      };
    }
  }, [videoUrl]);

  return <video ref={playerRef} controls></video>;
};
