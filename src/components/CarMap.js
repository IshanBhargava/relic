import { useEffect } from "react";
import DeckGL from '@deck.gl/react';
import {GeoJsonLayer} from '@deck.gl/layers';

const CarMap = ({ carData, userLoc }) => {
    useEffect(() => {
        console.log(carData);
        console.log(userLoc);
    }, [carData, userLoc]);

    const initialViewState = {
        latitude: userLoc[0],
        longitude: userLoc[1],
        zoom: 1,
    };

    const COUNTRIES ="https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_admin_0_scale_rank.geojson";

    return (
        <DeckGL controller={true} initialViewState={initialViewState}>
            <GeoJsonLayer
                id="base-map"
                data={COUNTRIES}
                stroked={true}
                filled={true}
                lineWidthMinPixels={2}
                opacity={0.4}
                getLineColor={[60, 60, 60]}
                getFillColor={[200, 200, 200]}
            />
        </DeckGL>
    );
};

export default CarMap;
