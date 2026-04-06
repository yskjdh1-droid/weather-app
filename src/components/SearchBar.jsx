import React from 'react';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';

export default function SearchBar({ city, setCity, fetchWeather, handleCurrentLocation }) {
  return (
    <div className="search-container">
      {/* 현재 위치 버튼 */}
      <button className="icon-button" onClick={handleCurrentLocation}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      </button>

      <div className="search-box-wrapper" style={{ flex: 1, color: 'black' }}>
        <GooglePlacesAutocomplete
          apiKey="AIzaSyDxnpfa76KV9YmbE89lrFX71gdYNDVeta8"
          selectProps={{
            value: city ? { label: city, value: city } : null,
            onChange: (place) => {
              if (!place || !place.value) return;

              // 1. 구글이 준 데이터(한글+영어 섞임)를 모두 가져옵니다.
              const description = place.value.description || "";
              const mainText = place.value.structured_formatting?.main_text || "";
              const label = place.label || "";

              // 2. 모든 텍스트를 단어 단위로 쪼개서 검사 리스트를 만듭니다.
              const allParts = [
                ...String(description).split(/[\s,]+/),
                ...String(mainText).split(/[\s,]+/),
                ...String(label).split(/[\s,]+/)
              ].map(p => p.trim()).filter(p => p.length > 0);

              // 3. [핵심 추출 로직]
              // '한글이 없고' + '영어 알파벳이 있으며' + '국가명이 아닌' 단어를 찾습니다.
              let englishCity = allParts.find(part => {
                const isEnglish = /[A-Za-z]/.test(part);
                const hasNoKorean = !/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(part);
                const isNotCountry = !/korea|south/i.test(part);
                return isEnglish && hasNoKorean && isNotCountry;
              });

              // 4. 만약 위 로직으로 못 찾았다면 알파벳이 들어간 첫 번째 단어를 씁니다.
              if (!englishCity) {
                englishCity = allParts.find(part => /[A-Za-z]/.test(part));
              }

              // 5. 끝까지 영문을 못 찾으면 한글에서 지명만 남깁니다.
              if (!englishCity) {
                englishCity = String(label).split(' ')[0].replace(/(특별시|광역시|시|구|군)$/, "");
              }

              console.log("📍 선택한 텍스트:", label);
              console.log("🚀 최종 추출된 영문명:", englishCity);

              // 6. 상태 업데이트 및 날씨 API 호출
              setCity(englishCity);
              fetchWeather({ city: englishCity });
            },
            placeholder: "도시 검색 (서울, 대전, Tokyo...)",
            isClearable: true,
            classNamePrefix: "react-select",
          }}
          autocompletionRequest={{
            types: ['(cities)'],
            language: 'ko' // 검색어는 한글로 입력 가능
          }}
        />
      </div>

      {/* 검색 버튼 */}
      <button className="icon-button" onClick={() => { if (city) fetchWeather({ city }) }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      </button>
    </div>
  );
}
