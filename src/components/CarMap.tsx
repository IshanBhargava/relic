import { useEffect } from "react";
import DeckGL from '@deck.gl/react';

interface Props {
    carData?: any
}

const CarMap = ({carData}: Props) => {
    useEffect(() => {
        console.log(carData);
    }, [carData])

    return ( 
        <div>
            {carData.length}
        </div>
     );
}
 
export default CarMap;