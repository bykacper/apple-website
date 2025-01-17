import React, { useEffect, useRef, useState } from "react";
import { hightlightsSlides } from "../constants/index.js";
import gsap from "gsap";
import { pauseImg, playImg, replayImg } from "../utils";
import { useGSAP } from "@gsap/react";

const VideoCarousel = () => {
  const videoRef = useRef([]);
  const videoSpanRef = useRef([]);
  const videoDivRef = useRef([]);

  const [video, setVideo] = useState({
    isEnd: false,
    startPlay: false,
    videoId: 0,
    isLastVideo: false,
    isPlaying: false,
  });

  const [loadedData, setLoadedData] = useState([]);

  const { isEnd, startPlay, videoId, isLastVideo, isPlaying } = video;

  useGSAP(() => {
    gsap.to('#video', {
      scrollTrigger: {
        trigger: "#video",
        toggleActions: 'restart none none none'
      },
      onComplete: () => {
        setVideo((pre) => ({
          ...pre,
          startPlay: true,
          isPlaying: true
        }))
      }
    })
  }, [isEnd, videoId])

  useEffect(() => {
    if (loadedData.length > 3) {
      if (!isPlaying) {
        videoRef.current[videoId].pause();
      } else {
        startPlay && videoRef.current[videoId].play();
      }
    }
  }, [startPlay, videoId, isPlaying, loadedData]);

  const handleLoadedMetadata = (i, e) => setLoadedData
  ((pre) => [...pre, e])

  useEffect(() => {
    const currentProgress = 0;
    let span = videoSpanRef.current;
    if (span[videoId]) {
      // animacja progresu tego wideo
      let anim = gsap.to(span[videoId], {
        onUpdate: () => {},

        onComplete: () => {},
      });
    }
  }, [videoId, startPlay]);

  const handleProcess = (type, i) => {
    switch (type) {
      case 'video-end':
        setVideo((pre) => ({...pre, isEnd: true}));
        break;

      case 'video-last':
        setVideo((pre) => ({...pre, isLastVideo: true}));
        break;

      case 'video-reset':
        setVideo((pre) => ({...pre, isLastVideo: false, videoId: 0}));
        break;

      case 'play':
        setVideo((pre) => ({...pre, isPlaying: !pre.isPlaying}));
        break;

      default:
        return video;
    }
  }

  return (
    <>
      <div className="flex items-center">
        {hightlightsSlides.map((list, i) => {
          return (
            <div key={list.id} id="slider" className="sm-pr-20 pr-10">
              <div className="video-carousel_container">
                <div className="w-full h-full flex-center rounded-3xl overflow-hidden bg-black"> {/* definicja pojedyńczego slajdu */}
                  <video
                    id="video"
                    playsInline={true}
                    preload="auto"
                    muted
                    ref={(video) => (videoRef.current[i] = video)}
                    onPlay={(prevVideo) => ({
                      ...prevVideo,
                      isPlaying: true,
                    })}
                    onLoadedMetadata={(e) => handleLoadedMetadata(i, e)}
                  >
                    <source src={list.video} type="video/mp4" />
                  </video>
                </div>

                <div className="absolute top-12 left-[5%] z-10">
                  {list.textLists.map((text) => {
                    return (
                      <p key={text} className="md:text-2xl text-xl font-medium">
                        {text}
                      </p>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="relative flex-center mt-10">
        <div className="flex-center py-5 px-7 bg-gray-300 backdrop-blur rounded-full">
          {videoRef.current.map((_, i) => {
            return (
              <span
                key={i}
                ref={(el) => (videoDivRef.current[i] = el)}
                className="mx-2 w-3 h-3 bg-gray-200 rounded-full relative cursor-pointer"
              >
                <span
                  className="absolute h-full w-full rounded-full"
                  ref={(el) => (videoSpanRef.current[i] = el)}
                >
                </span>
              </span>
            );
          })}
        </div>

        <button className="control-btn">
          <img
            src={isLastVideo ? replayImg : !isPlaying ? playImg : pauseImg}
            alt={isLastVideo ? "replay" : !isPlaying ? "play" : "pause"}
            onClick={isLastVideo 
              ? () => handleProcess('videoReset')
              : !isPlaying ? () => handleProcess('play')
              : () => handleProcess('pause')

            }                  
          />
        </button>
      </div>
    </>
  );
};

export default VideoCarousel;
