import React from "react";
import { Map, Geocoder } from 'react-mapbox-geocoder-autocomplete';

const initViewPosition = {
  longitude: -73.9866,
  latitude: 40.72929915979287,
};

/** `promiseFn` for fetching map-box address by coordinates */
const getMapAddress = async (mapToken, { lng, lat }) => {
  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapToken}`
    );
    if (response.status >= 200 && response.status < 300) {
      const result = await response.json();

      return result?.features?.[0]?.place_name || "";
    }
  } catch {
    console.error("Error");
  }
  return {};
};

const App = ({ 
  mapToken = process.env.REACT_APP_MAP_TOKEN,
  mapPosition = initViewPosition,
}) => {
  const [viewPosition, setViewPosition] = React.useState(mapPosition);
  const [address, setAddress] = React.useState("");

  React.useEffect(() => {
    const fetchAddress = async() => {
      const addressReponse = await getMapAddress(mapToken, { lng: mapPosition.longitude, lat: mapPosition.latitude });
      setAddress(addressReponse);
    }
    fetchAddress();
  }, []);

  const onItemClick = (vp, item) => {
    setAddress(item?.place_name);
    setViewPosition(vp);
  };

  const handleMarkerDrag = async (lngLat) => {
    const { lng, lat } = lngLat;
    const addressReponse = await getMapAddress(mapToken, { lng, lat });
    setAddress(addressReponse);
    setViewPosition({ longitude: lng, latitude: lat });
  };

  return (
    <div style={{ margin: 'auto',  height: '100%', width: '600px' }}>
      <Geocoder
        mapToken={mapToken}
        onItemClick={onItemClick}
        address={address}
      />
      <div style={{ height: '100px' }} />
      <div style={{ height: "500px" }}>
        <Map 
          mapToken={mapToken}
          handleMarkerDrag={handleMarkerDrag}
          viewPosition={viewPosition}
        />
      </div>
    </div>
  );
};

export default App;
