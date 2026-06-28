const STATE_BOUNDS = [
  { state: 'Karnataka', minLat: 11.5, maxLat: 18.5, minLng: 74, maxLng: 78.5 },
  { state: 'Maharashtra', minLat: 15.5, maxLat: 22.5, minLng: 72.5, maxLng: 80.5 },
  { state: 'Tamil Nadu', minLat: 8, maxLat: 13.5, minLng: 76.5, maxLng: 80.5 },
  { state: 'Telangana', minLat: 15.5, maxLat: 19.5, minLng: 77.5, maxLng: 81.5 },
  { state: 'Kerala', minLat: 8, maxLat: 12.5, minLng: 74.5, maxLng: 77.5 },
  { state: 'Delhi', minLat: 28.4, maxLat: 28.9, minLng: 76.8, maxLng: 77.4 },
  { state: 'Gujarat', minLat: 20, maxLat: 24.5, minLng: 68.5, maxLng: 74.5 },
  { state: 'Andhra Pradesh', minLat: 12.5, maxLat: 19.5, minLng: 76.5, maxLng: 84.5 },
  { state: 'Uttar Pradesh', minLat: 23.5, maxLat: 30.5, minLng: 77, maxLng: 84.5 },
  { state: 'West Bengal', minLat: 21.5, maxLat: 27.5, minLng: 85.5, maxLng: 89.5 },
  { state: 'Bihar', minLat: 24, maxLat: 27.5, minLng: 83.5, maxLng: 88.5 },
  { state: 'Haryana', minLat: 27.5, maxLat: 30.5, minLng: 74.5, maxLng: 77.5 },
  { state: 'Punjab', minLat: 29.5, maxLat: 32.5, minLng: 73.5, maxLng: 76.5 },
  { state: 'Rajasthan', minLat: 23, maxLat: 30.5, minLng: 69.5, maxLng: 78.5 },
  { state: 'Madhya Pradesh', minLat: 21, maxLat: 26.5, minLng: 74, maxLng: 82.5 },
];

const INDIA_BOUNDS = { minLat: 6, maxLat: 37, minLng: 68, maxLng: 97 };

export function isWithinIndia(lat, lng) {
  return (
    lat >= INDIA_BOUNDS.minLat &&
    lat <= INDIA_BOUNDS.maxLat &&
    lng >= INDIA_BOUNDS.minLng &&
    lng <= INDIA_BOUNDS.maxLng
  );
}

export function guessStateFromCoords(lat, lng) {
  if (!isWithinIndia(lat, lng)) return null;

  for (const bound of STATE_BOUNDS) {
    if (
      lat >= bound.minLat &&
      lat <= bound.maxLat &&
      lng >= bound.minLng &&
      lng <= bound.maxLng
    ) {
      return bound.state;
    }
  }

  return 'National';
}

export function detectUserState() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        resolve(guessStateFromCoords(latitude, longitude));
      },
      () => resolve(null),
      { timeout: 8000, maximumAge: 300000 },
    );
  });
}
