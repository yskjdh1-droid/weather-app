import React, { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import DetailGrid from './components/DetailGrid';
export default function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(""); 
  const API_KEY = "2626ea073f4ff9707f54b9656f0089f0";

  // 날씨 상태에 따라 고정된 Unsplash 키워드 배경 이미지 제공
  const getBgUrl = () => {
    if (!weather) return "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80";
    const condition = weather.weather[0].main.toLowerCase();
    
    // source.unsplash.com 대신 더 안정적인 images.unsplash.com 방식 사용
    const bgMap = {
      clear: "https://img.freepik.com/free-photo/cloud-blue-sky_1232-3108.jpg?semt=ais_hybrid&w=740&q=80",
      clouds: "https://images.unsplash.com/photo-1483977399921-6cf94f6fdc3a?q=80&w=1600&auto=format&fit=crop",
      rain: "https://images.unsplash.com/photo-1511634829096-045a111727eb?q=80&w=1600&auto=format&fit=crop",
      snow: "https://images.unsplash.com/photo-1478265409131-1f65c88f965c?q=80&w=1600&auto=format&fit=crop",
      thunderstorm: "https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?q=80&w=1600&auto=format&fit=crop",
      mist: "https://images.unsplash.com/photo-1543968996-ee822b8176ba?q=80&w=2070&auto=format&fit=crop"    
    };
    const mistGroup = ['mist', 'haze', 'fog', 'smoke', 'dust', 'sand', 'ash'];
    if (mistGroup.includes(condition)) {
      return bgMap.mist;
    }
    return bgMap[condition] || "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1600&auto=format&fit=crop";
  };
const fetchWeather = (params) => {
  setLoading(true);
  setErrorMsg(""); 

  const baseWeather = `https://api.openweathermap.org/data/2.5/weather?appid=${API_KEY}&units=metric&lang=kr`;
  const baseForecast = `https://api.openweathermap.org/data/2.5/forecast?appid=${API_KEY}&units=metric&lang=kr`;

  let url = baseWeather;
  let forecastUrl = baseForecast;

  if (params.lat && params.lon) {
    url += `&lat=${params.lat}&lon=${params.lon}`;
    forecastUrl += `&lat=${params.lat}&lon=${params.lon}`;
  } else {
    const targetCity = params.city || "Gyeongju";
    url += `&q=${encodeURIComponent(targetCity)}`;
    forecastUrl += `&q=${encodeURIComponent(targetCity)}`;
  }

  Promise.all([fetch(url), fetch(forecastUrl)])
    .then(async ([res1, res2]) => {
      const data1 = await res1.json();
      const data2 = await res2.json();

      if (data1.cod === 200 || data1.cod === "200") {
        setWeather(data1);
        setErrorMsg(""); 
        // 💡 중요: 사용자가 입력한 도시명과 API가 반환한 영문명이 다를 수 있으므로 
        // 굳이 다시 setCity를 하지 않거나, 성공 시에만 신중하게 처리합니다.
      } else {
        setErrorMsg("잘못된 도시명입니다. 다시 확인해 주세요!");
      }

      if (data2.cod == 200 || data2.cod == "200") {
        setForecast(data2.list.slice(0, 8));
      }
      setLoading(false);
    })
    .catch((err) => {
      setErrorMsg("날씨 정보를 가져오는 중 오류가 발생했습니다.");
      setLoading(false);
    });
};
const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      const options = { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          // 혹은 위치 정보를 쓰되 기본값을 경주로 고정합니다.
          fetchWeather({ city: "Gyeongju" }); 
        },
        (error) => {
          // 실패해도 당연히 경주!
          fetchWeather({ city: "Gyeongju" });
        },
        options
      );
    } else {
      fetchWeather({ city: "Gyeongju" });
    }
  };
useEffect(() => {
  const initApp = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // 실제 위치 정보 사용 시
          fetchWeather({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        () => {
          // 위치 권한 거부 시 기본값 경주
          fetchWeather({ city: "Gyeongju" });
        }
      );
    } else {
      fetchWeather({ city: "Gyeongju" });
    }
  };

  initApp();
}, []);
  const dynamicStyle = `
    .weather-app-container {
      min-height: 100vh;
      background: url('${getBgUrl()}') no-repeat center center/cover;
      display: flex; align-items: center; justify-content: center;
      padding: 20px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; 
      transition: background 0.8s ease-in-out;
      position: relative;
    }
    .weather-app-container::before {
      content: ''; position: absolute; inset: 0; background: rgba(0,0,0,0.3);
    }
    .glass-card {
      position: relative; z-index: 1;
      background: rgba(255, 255, 255, 0.15); backdrop-filter: blur(25px);
      -webkit-backdrop-filter: blur(25px);
      border-radius: 40px; border: 1px solid rgba(255, 255, 255, 0.2);
      width: 100%; max-width: 400px; padding: 40px; color: white; text-align: center;
      box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
    }
    .search-container { display: flex; gap: 10px; margin-bottom: 30px; }
    .search-box {
      background: rgba(255, 255, 255, 0.2); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 15px;
      padding: 12px 20px; flex: 1; color: white; outline: none; transition: 0.2s;
    }
    .search-box:focus { background: rgba(255, 255, 255, 0.3); }
    .icon-button {
      background: rgba(255, 255, 255, 0.2); border: none; border-radius: 15px;
      width: 48px; height: 48px; display: flex; align-items: center; justify-content: center;
      color: white; cursor: pointer; transition: 0.2s;
    }
    .icon-button:hover { background: rgba(255, 255, 255, 0.3); transform: translateY(-2px); }
    .temp-text { font-size: 80px; font-weight: 800; margin: 5px 0; letter-spacing: -2px; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 30px; }
    .info-item { background: rgba(255, 255, 255, 0.1); padding: 15px; border-radius: 20px; border: 1px solid rgba(255, 255, 255, 0.05); }
    .forecast-scroll {
      display: flex; gap: 12px; overflow-x: auto; margin-top: 30px; padding-bottom: 5px;
    }
    .forecast-scroll::-webkit-scrollbar { display: none; }
    .forecast-item {
      min-width: 70px; background: rgba(255, 255, 255, 0.1); padding: 12px 8px; border-radius: 20px;
    }
    /* 에러 메시지 스타일 추가 */
    .error-message {
      background: rgba(255, 107, 107, 0.2);
      color: #ff8e8e;
      border: 1px solid rgba(255, 107, 107, 0.3);
      border-radius: 12px;
      padding: 10px;
      margin-bottom: 20px;
      font-size: 14px;
      font-weight: 600;
      backdrop-filter: blur(5px);
      animation: fadeIn 0.3s ease-in-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }/* 에러 메시지 스타일 추가 */
    .error-message {
      background: rgba(255, 107, 107, 0.2);
      color: #ff8e8e;
      border: 1px solid rgba(255, 107, 107, 0.3);
      border-radius: 12px;
      padding: 10px;
      margin-bottom: 20px;
      font-size: 14px;
      font-weight: 600;
      backdrop-filter: blur(5px);
      animation: fadeIn 0.3s ease-in-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;
return (
  <div className="weather-app-container">
    {/* 동적 배경 스타일 유지 */}
    <style>{dynamicStyle}</style>

    <div className="glass-card">
      {/* 1. 검색바 컴포넌트 */}
      <SearchBar
        city={city}
        setCity={setCity}
        fetchWeather={fetchWeather}
        handleCurrentLocation={handleCurrentLocation}
      />

      {/* [추가] 에러 메시지가 있을 때만 검색창 아래에 표시합니다 */}
      {errorMsg && (
        <div className="error-message">
          ⚠️ {errorMsg}
        </div>
      )}

      {loading ? (
        <div style={{padding: '100px 0'}}>Loading...</div>
      ) : weather && (
        <>
          {/* 2. 날씨 카드 컴포넌트 */}
          <WeatherCard weather={weather} />

          {/* 3. 상세 그리드 컴포넌트 */}
          <DetailGrid weather={weather} forecast={forecast} />
        </>
      )}
    </div>
  </div>
);
}
