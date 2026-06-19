import React, { useRef, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Play, Pause, Volume2, Maximize } from 'lucide-react';
import { saveVideoProgress, markLessonComplete } from '../../../api/course/course';
import styles from './VideoPlayer.module.css';

const formatTime = (timeInSeconds) => {
  if (!timeInSeconds || isNaN(timeInSeconds)) return '00:00';
  const m = Math.floor(timeInSeconds / 60).toString().padStart(2, '0');
  const s = Math.floor(timeInSeconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

export default function VideoPlayer({ lesson, lastWatchTime, onLessonComplete }) {
  const { courseId } = useParams();
  
  // 获取原生的 <video> DOM 元素，以便我们可以操作它的时间控制（断点续播）
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  // 记录这个视频是否已经标记完成过了，防止每次 80% 都重复发送请求
  const isCompletedRef = useRef(false);

  const [isSaving, setIsSaving] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // ----- 断点续播逻辑 -----
  // 当传入进来的 lesson (也就是视频变了) 或是传入的 lastWatchTime 有变更时执行
  useEffect(() => {
    // 重置状态
    isCompletedRef.current = false;
    setIsPlaying(false);
    setCurrentTime(lastWatchTime || 0);

    const videoEl = videoRef.current;
    if (videoEl && lastWatchTime > 0) {
      // 通过设置 currentTime 来实现断点续播
      videoEl.currentTime = lastWatchTime;
    }
  }, [lesson, lastWatchTime]);

  // 定时器：每 15s 发送一次进度记录
  useEffect(() => {
    let intervalId;
    if (isPlaying && courseId && lesson?.id) {
      intervalId = setInterval(async () => {
        try {
          setIsSaving(true);
          const currTime = videoRef.current?.currentTime || 0;
          
          // TODO: Uncomment this after testing video loads
          // await saveVideoProgress(courseId, lesson.id, Math.floor(currTime));
          console.log(`[Mock] Saved progress at ${Math.floor(currTime)}s for section ${lesson.id}`);

          setTimeout(() => setIsSaving(false), 2000);
        } catch (err) {
          console.error("Failed to save progress", err);
          setIsSaving(false);
        }
      }, 15000);
    }
    return () => clearInterval(intervalId);
  }, [isPlaying, courseId, lesson?.id]);

  const togglePlay = () => {
    const videoEl = videoRef.current;
    if (!videoEl) return;
    if (videoEl.paused) {
      videoEl.play();
      setIsPlaying(true);
    } else {
      videoEl.pause();
      setIsPlaying(false);
    }
  };

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const toggleFullscreen = () => {
    if (containerRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        containerRef.current.requestFullscreen();
      }
    }
  };

  // ----- 视频时间更新逻辑（判断 80% 完播） -----
  const handleTimeUpdate = async () => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    const currTime = videoEl.currentTime;
    const dur = videoEl.duration;
    setCurrentTime(currTime);

    // 如果还没有获取到时长（刚加载时可能为 NaN），先不处理
    if (!dur || isNaN(dur)) return;

    // 完播记录判断：观看进度达到总时长的 80%
    const progressRate = currTime / dur;
    if (progressRate >= 0.8 && !isCompletedRef.current) {
      // 达到条件且之前尚未标记，就发起完播请求
      isCompletedRef.current = true;
      try {
        await markLessonComplete(lesson.id);
        // 通知父组件，将子课时的状态更新，解锁下一课
        if (onLessonComplete) {
          onLessonComplete(lesson.id);
        }
      } catch (err) {
        console.error("Failed to mark lesson complete", err);
        isCompletedRef.current = false; // 出错了后续可以尝试重新发送
      }
    }
  };

  return (
    <div>
      <div className={styles.playerContainer} ref={containerRef}>
        <video
          ref={videoRef}
          src={lesson.videoUrl}
          className={styles.videoElement}
          onClick={togglePlay}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          poster={lesson.thumbnailUrl} // 如果有封面可以放这里
        />
        
        {/* 自定义控件，进度条在上方，按钮在下方 */}
        <div className={styles.controlsWrapper}>
          {/* 上半部分：进度条 */}
          <div className={styles.progressBarContainer}>
             <div 
               className={styles.progressBarFill} 
               style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
             ></div>
             <input 
               type="range" 
               min="0" 
               max={duration || 0} 
               step="0.1"
               value={currentTime} 
               onChange={handleSeek} 
               className={styles.progressInput} 
             />
          </div>
          
          {/* 下半部分：播放控制和时间 */}
          <div className={styles.controlsRow}>
            <button className={styles.controlButton} onClick={togglePlay}>
              {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
            </button>
            
            <div className={styles.timeDisplay}>
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>

            <div style={{ flex: 1 }}></div>

            <button className={styles.controlButton}>
              <Volume2 size={20} />
            </button>
            <button className={styles.controlButton} onClick={toggleFullscreen}>
              <Maximize size={20} />
            </button>
          </div>
        </div>
      </div>
      
      {/* 底部保存提示反馈 */}
      <div style={{minHeight: "24px"}}>
         {isSaving && (
           <div className={styles.savingIndicator}>
             <div className={styles.savingIndicatorDot}></div>
             Saving progress...
           </div>
         )}
      </div>
    </div>
  );
}
