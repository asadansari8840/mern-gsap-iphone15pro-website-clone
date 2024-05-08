import React, { useEffect, useRef, useState } from 'react'
import { hightlightsSlides } from "../constants"
import gsap from 'gsap';
import { pauseImg, playImg, replayImg } from '../utils';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/all';


gsap.registerPlugin(ScrollTrigger);

const VideoCarousel = () => {

    const videoRef = useRef([]);
    const videoSpanRef = useRef([]);
    const videoDivRef = useRef([]);
    const [loadedData, setLoadedData] = useState([]);

    const [video, setVideo] = useState({
        isEnd: false,
        startPlay: false,
        videoId: 0,
        isLastVideo: false,
        isPlaying: false,
    });

    const { isEnd, isLastVideo, isPlaying, startPlay, videoId } = video;

    useGSAP(() => {

        gsap.to("#slider", {
            transform: `translateX(${-100 * videoId}%)`,
            duration: 2,
            ease: "power2.inOut"
        })

        gsap.to("#video", {
            scrollTrigger: {
                trigger: "#video",
                toggleActions: 'restart none none none',
            },
            onComplete: () => {
                setVideo((prev) => (
                    {
                        ...prev,
                        startPlay: true,
                        isPlaying: true
                    }
                ))

            }
        })

    }, [isEnd, videoId]);

    const handleLoadedMetadata = (i, e) => setLoadedData((prev) => [...prev, e]);

    //used to play the video initially and on dependency changes
    useEffect(() => {
        if (loadedData.length > 3) {
            if (!isPlaying) {
                videoRef.current[videoId].pause();
            } else {
                startPlay && videoRef.current[videoId].play();
            }
        };

    }, [startPlay, videoId, isPlaying, loadedData])

    useEffect(() => {
        let currentProgress = 0;
        let span = videoSpanRef.current;
        if (span[videoId]) {
            //animate the progress of the video
            let anim = gsap.to(span[videoId], {
                onUpdate: () => {
                    const progress = Math.ceil(anim.progress() * 100);
                    if (progress !== currentProgress) {
                        currentProgress = progress;
                        gsap.to(videoDivRef.current[videoId], {
                            transitionDuration:"1000ms",
                            width: window.innerWidth < 760 ? "10vw"
                                : window.innerWidth < 1200 ? "10vw"
                                    : "4vw"
                        });

                        gsap.to(span[videoId], {
                            width: `${currentProgress}%`,
                            backgroundColor: "white"
                        })
                    }
                },

                onComplete: () => {
                    if (isPlaying) {
                        gsap.to(videoDivRef.current[videoId], {
                            width: "12px",
                        })
                        gsap.to(span[videoId], {
                            backgroundColor: "#afafaf",
                        })
                    }

                },

            });

            if (videoId == 0) {
                anim.restart();
            }
            const animUpdate = () => {
                anim.progress(videoRef.current[videoId].currentTime
                    / hightlightsSlides[videoId].videoDuration)

            }
            if (isPlaying) {
                gsap.ticker.add(animUpdate)
            } else {
                gsap.ticker.remove(animUpdate)
            }
        }

    }, [videoId, startPlay])

    const handleProcess = (type, i) => {
        switch (type) {
            case 'video-end':
                setVideo((prevVideo) => ({ ...prevVideo, isEnd: true, videoId: i + 1 }))
                break;
            case 'video-last':
                setVideo((prevVideo) => ({ ...prevVideo, isLastVideo: true }))
                break;
            case 'video-reset':
                setVideo((prevVideo) => ({ ...prevVideo, isLastVideo: false, videoId: 0 }))
                break;
            case 'play':
                setVideo((prevVideo) => ({ ...prevVideo, isPlaying: !prevVideo.isPlaying }))
                break;
            case 'pause':
                setVideo((prevVideo) => ({ ...prevVideo, isPlaying: !prevVideo.isPlaying }))
                break;
            default: return video
        };
    };

    return (
        <>
            <div className='flex items-center'>
                {hightlightsSlides.map((list, i) => (
                    <div key={i} className='pr-10 sm:pr-20' id='slider'>
                        <div className='video-carousel_container'>
                            <div className='flex-col-reverse w-full h-full overflow-hidden bg-black rounded-3xl'>
                                <video
                                    ref={(el) => (videoRef.current[i] = el)}
                                    id='video'
                                    className={list.id == 2 && "translate-x-44 pointer-events-none"}
                                    playsInline={true}
                                    onEnded={() => {
                                        i !== 3 ? handleProcess('video-end', i)
                                            : handleProcess('video-last')
                                    }}
                                    preload='auto'
                                    muted
                                    onLoadedMetadata={(e) => handleLoadedMetadata(i, e)}
                                    onPlay={() => {
                                        setVideo((prevVideo) => ({
                                            ...prevVideo,
                                            isPlaying: true,
                                        }))
                                    }}
                                >
                                    <source src={list.video} type='video/mp4' />
                                </video>
                            </div>
                            <div className='absolute top-12 left-[5%] z-10'>
                                {list.textLists.map((text) => (
                                    <p className='text-xl font-medium md:text-2xl' key={text}>{text}</p>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className='relative mt-10 flex-center'>
                <div className='py-5 bg-gray-300 rounded-full flex-center px-7 backdrop-blur'>
                    {videoRef.current.map((_, i) => (
                        <span key={i} ref={(el) => videoDivRef.current[i] = el}
                            className='relative w-3 h-3 mx-2 bg-gray-200 rounded-full cursor-pointer'
                        >
                            <span
                                ref={(el) => (videoSpanRef.current[i] = el)}
                                className='absolute w-full h-full rounded-full'
                            />
                        </span>
                    ))}
                </div>
                <button
                    onClick={isLastVideo ? () => handleProcess('video-reset')
                        : !isPlaying ? () => handleProcess('play')
                            : () => handleProcess('pause')
                    }
                    className='transition-all hover:bg-white hover:bg-opacity-20 control-btn'>
                    <img
                        src={isLastVideo ? replayImg : !isPlaying ? playImg : pauseImg}
                    />
                </button>
            </div>
        </>
    )
}

export default VideoCarousel