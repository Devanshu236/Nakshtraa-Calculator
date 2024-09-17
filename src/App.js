import React, { useState } from 'react';
import axios from 'axios';
import './App.css';  // Import external CSS

function App() {
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    time: '',
    lat: '',
    lon: '',
    gender: 'male',
  });

  const [nakshatra, setNakshatra] = useState('');
  const [nakshatraDescription, setNakshatraDescription] = useState('');
  const [detailedDescription, setDetailedDescription] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const apiUrl = `https://api.horocosmo.com/generate-birth-chart?type=birth&name=${encodeURIComponent(
      formData.name
    )}&date=${formData.date}&time=${formData.time}&lat=22&lon=44&gender=${formData.gender}`;

    axios.get(apiUrl)
      .then((response) => {
        const data = response.data;
        const moonData = data['data']['Data']['sign']['Moon'];
        const nakshatra = moonData['nakshatra'];
        const nakshatraDescription = data['data']['Asc sign traits']['Description'];

        setNakshatra(nakshatra);
        setNakshatraDescription(nakshatraDescription);

        // Fetch detailed description from new API
        const detailedApiUrl = `https://api.horocosmo.com/nakshatra?name=${nakshatra}&pada=${moonData['pada']}&gender=${formData.gender}`;
        
        return axios.get(detailedApiUrl);
      })
      .then((response) => {
        const detailedData = response.data.data[0];
        const features = response.data.data[1].Features;
        const characteristics = response.data.data[2].Characteristics.MaleCharacteristics;

        const detailedDescription = `
          Nakshatra Name: ${detailedData.Pada.NakshatraName}
          Pada Characteristics: ${detailedData.Pada.Characteristics}
          Degree: ${detailedData.Pada.Degree}
          Ruling Planet: ${detailedData.Pada.RulingPlanet}
          Features: ${features}
          Male Characteristics: ${characteristics}
        `;

        setDetailedDescription(detailedDescription);
      })
      .catch((error) => {
        console.error('There was an error fetching the data!', error);
      });
  };

  return (
    <div className="app-container">
      <form onSubmit={handleSubmit}>
        <h1>Nakshatra Calculator</h1>

        <div>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Name"
            required
          />
        </div>
        <div>
          <input
            type="text"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            placeholder="Date of Birth (YYYY/MM/DD)"
            required
          />
        </div>
        <div>
          <input
            type="text"
            name="time"
            value={formData.time}
            onChange={handleInputChange}
            placeholder="Time of Birth (HH:MM)"
            required
          />
       
        </div>
        <div>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            required
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <button type="submit">Calculate Nakshatra</button>
      </form>

      {nakshatra && (
        <div className="result">
          <h2>Nakshatra: {nakshatra}</h2>
          {nakshatraDescription && (
            <div className="description-box">
              <h3>Description</h3>
              <p>{nakshatraDescription}</p>
            </div>
          )}
          {detailedDescription && (
            <div className="detailed-description-box">
              <h3>Detailed Description</h3>
              <p>{detailedDescription}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
