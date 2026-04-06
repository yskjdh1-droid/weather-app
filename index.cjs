const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();
const app = express();
const PORT = 5000;

app.use(cors());

// 브라우저에서 http://localhost:5000/api/weather?city=Seoul 접속 시 작동
app.get('/api/weather', async (req, res) => {
    const city = req.query.city || 'Seoul';
    const API_KEY = process.env.WEATHER_API_KEY || '2626ea073f4ff9707f54b9656f0089f0'; 

    try {
        // Proxy 로직: 서버가 대신 외부 API를 호출 (보안 및 CORS 해결)
        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );
        
        const data = {
            city: response.data.name,
            temp: response.data.main.temp,
            condition: response.data.weather[0].main,
            humidity: response.data.main.humidity,
            wind: response.data.wind.speed
        };
        
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '날씨 정보를 가져오는 서버 에러가 발생했습니다.' });
    }
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`테스트 주소: http://localhost:${PORT}/api/weather?city=Seoul`);
});
