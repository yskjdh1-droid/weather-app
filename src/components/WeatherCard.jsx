export default function WeatherCard({ weather }) {
  return (
    <div className="animate-in fade-in duration-500">
      <h2 style={{fontSize: '36px', fontWeight: '800', margin: 0}}>{weather.name}</h2>
      <p style={{opacity: 0.7, marginBottom: '20px'}}>{new Date().toLocaleDateString('ko-KR', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
      <img
        src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
        style={{width: '140px', margin: '-20px 0'}} alt="weather icon"
      />
      <div className="temp-text">{Math.round(weather.main.temp)}°</div>
      <p style={{fontSize: '22px', fontWeight: '600', marginBottom: '20px'}}>{weather.weather[0].description}</p>
    </div>
  );
}
