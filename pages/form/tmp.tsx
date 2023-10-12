import { useState, useEffect } from 'react';

const LocationComponent = () => {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        function(position) {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          setLocation({ latitude, longitude });
        },
        function(error) {
          // Handle errors
          console.error(error);
        }
      );
    } else {
      console.error("Geolocation is not supported by your browser.");
    }
  }, []); // Empty dependency array ensures this effect runs once after initial render

  return (
    <div>
      {location ? (
        <p>
          Latitude: {location.latitude}, Longitude: {location.longitude}
        </p>
      ) : (
        <p>Loading location...</p>
      )}
    </div>
  );
};

export default LocationComponent;
