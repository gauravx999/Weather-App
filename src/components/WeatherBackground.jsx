import React from 'react';

import Thunderstorm from '../assets/Thunderstorm.gif';
import Rain from '../assets/Rain.gif';
import SnowDay from '../assets/Snow.gif';
import ClearDay from '../assets/ClearDay.gif';
import ClearNight from '../assets/ClearNight.gif';
import CloudsDay from '../assets/CloudsDay.gif';
import CloudsNight from '../assets/CloudsNight.gif';
import Haze from '../assets/Haze.gif';
import video from '../assets/video1.mp4';

const WeatherBackground = ({ condition }) => {
  const gifs = {
    Thunderstorm,
    Drizzle: Rain,
    Rain,
    Snow: SnowDay,
    Clear: { day: ClearDay, night: ClearNight },
    Clouds: { day: CloudsDay, night: CloudsNight },
    Mist: Haze,
    Smoke: Haze,
    Haze,
    Fog: Haze,
    default: video,
  };

  const getBackground = () => {
    if (!condition) return gifs.default;
    const asset = gifs[condition.main];
    if (!asset) return gifs.default;
    if (typeof asset === 'object') {
      return condition.isDay ? asset.day : asset.night;
    }
    return asset;
  };

  const background = getBackground();
  const isVideo = background === video;

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {isVideo ? (
        <video
          autoPlay
          loop
          muted
          className="w-full h-full object-cover pointer-events-none animate-fade-in"
        >
          <source src={background} type="video/mp4" />
        </video>
      ) : (
        <img
          src={background}
          alt="Weather Background"
          className="w-full h-full object-cover pointer-events-none animate-fade-in opacity-20"
        />
      )}
      <div className="absolute inset-0 bg-black/30" />
    </div>
  );
};

export default WeatherBackground;
