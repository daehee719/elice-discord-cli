import React, { useRef, useEffect } from 'react';

const OpenViduAudioComponent = ({ streamManager }) => {
  const audioRef = useRef();

  useEffect(() => {
    if (streamManager && audioRef.current) {
      streamManager.addVideoElement(audioRef.current);
    }
  }, [streamManager]);

  return <audio autoPlay={true} ref={audioRef} />;
};

export default OpenViduAudioComponent;