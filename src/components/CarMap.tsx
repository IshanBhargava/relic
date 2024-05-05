import React, { useEffect, useState } from "react";
import {
    GoogleMap,
    InfoWindow,
    Marker,
    useJsApiLoader,
} from "@react-google-maps/api";
import { carData } from "../interface/CarData";

interface loc {
    lat: number;
    lng: number;
}

interface MapProps {
    cars: carData[];
    userLoc: loc[];
}

const CarMap: React.FC<MapProps> = ({ cars, userLoc }) => {
    const [selectedCar, setSelectedCar] = useState<carData | null>(null);
    const [map, setMap] = React.useState(null);

    useEffect(() => {
        console.log(
            "Rendering CarMap with data:",
            cars,
            "and location:",
            userLoc
        );
    }, [cars, userLoc]);

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: "<API-KEY-HERE>"
      })

    const mapContainerStyle = {
        width: "100%",
        height: "100vh",
    };

    const defaultCenter = {
        lat: userLoc[0].lat,
        lng: userLoc[0].lng,
    };

    const options: google.maps.MapOptions = {
        disableDefaultUI: true,
        zoomControl: true,
    };

    const onUnmount = React.useCallback(function callback(map: any) {
        setMap(null);
    }, []);

    return (
        isLoaded? 
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={defaultCenter}
                zoom={8}
                options={options}
                onUnmount={onUnmount}
            >
                {cars &&
                    cars.map((car, index) => {
                        const lat = parseFloat(car.lati!);
                        const lng = parseFloat(car.longi!);
                        return !isNaN(lat) && !isNaN(lng) ? (
                            <Marker
                                key={index}
                                position={{ lat, lng }}
                                onClick={() => setSelectedCar(car)}
                            >
                                {selectedCar === car && (
                                    <InfoWindow
                                        onCloseClick={() =>
                                            setSelectedCar(null)
                                        }
                                    >
                                        <div>
                                            <h2>Model: {car.model}</h2>
                                            <br />
                                            <div>Price: ${car.price}</div>
                                            <br />
                                            <div>
                                                Mileage: {car.odometer} miles
                                            </div>
                                        </div>
                                    </InfoWindow>
                                )}
                            </Marker>
                        ) : null;
                    })}
            </GoogleMap> : <></>
    );
};

export default React.memo(CarMap);
