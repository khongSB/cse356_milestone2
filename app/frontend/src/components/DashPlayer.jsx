import React, { useEffect, useRef } from "react";
import dashjs from "dashjs";

export const DashPlayer = ({ videoUrl, onPlayerReady, visible }) => {
  const playerRef = useRef(null);

  useEffect(() => {
    // Initialize dash.js player when video URL is set
    if (videoUrl) {
      const player = dashjs.MediaPlayer().create();
      player.initialize(playerRef.current, videoUrl, false);

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

  return (
    <video
      ref={playerRef}
      controls
      style={{ visibility: visible ? "visible" : "hidden" }}
    ></video>
  );
};