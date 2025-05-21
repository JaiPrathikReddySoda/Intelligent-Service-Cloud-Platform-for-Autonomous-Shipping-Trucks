export const reverseGeocode = async (lat: number, lon: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`,
        {
          headers: {
            'User-Agent': 'FleetSim/1.0 (your@email.com)', // required by Nominatim
            'Accept-Language': 'en'
          }
        }
      );
      const data = await response.json();
      return data.display_name || `${lat},${lon}`;
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
      return `${lat},${lon}`;
    }
  };
  