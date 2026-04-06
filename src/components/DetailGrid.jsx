export default function DetailGrid({ weather, forecast }) {
  return (
    <>
      <div className="info-grid">
        <div className="info-item">
          <div style={{fontSize: '12px', opacity: 0.7, marginBottom: '4px'}}>습도</div>
          <div style={{fontSize: '20px', fontWeight: '700'}}>{weather.main.humidity}%</div>
        </div>
        <div className="info-item">
          <div style={{fontSize: '12px', opacity: 0.7, marginBottom: '4px'}}>풍속</div>
          <div style={{fontSize: '20px', fontWeight: '700'}}>{weather.wind.speed}m/s</div>
        </div>
      </div>
      <div className="forecast-scroll">
        {forecast.map((item, idx) => (
          <div key={idx} className="forecast-item">
            <div style={{fontSize: '11px', opacity: 0.8}}>{new Date(item.dt * 1000).getHours()}시</div>
            <img src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`} alt="icon" style={{width: '40px'}} />
            <div style={{fontWeight: '700'}}>{Math.round(item.main.temp)}°</div>
          </div>
        ))}
      </div>
    </>
  );
}
