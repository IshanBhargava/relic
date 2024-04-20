import { useEffect, useState } from "react";
import {
    Modal,
    Card,
    CardHeader,
    CardContent,
    Typography,
    Box,
    List,
    ListItem,
    CircularProgress,
} from "@mui/material";
import { carData } from "../interface/CarData";

const modalStyle = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 1200,
    bgcolor: "background.paper",
    boxShadow: 24,
};

interface ModalProps {
    initialCar: carData;
}

const CarModal: React.FC<ModalProps> = ({ initialCar }) => {
    const [currentCar, setCurrentCar] = useState<carData>(initialCar);
    const [data, setData] = useState<{ car: carData; similar: carData[] }>();
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        fetchSimilarCars(currentCar);
    }, [currentCar]);

    const fetchSimilarCars = (current_car: carData) => {
        setIsLoading(true);
        console.log("1",isLoading)

        const options = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({
                cluster: current_car.clusters,
                carId: current_car.car_id,
            }),
        };

        fetch("http://127.0.0.1:5000/getsimilar", options)
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Could not retrieve similar cars");
                }
                return res.json();
            })
            .then((d) => {
                console.log("car", current_car);
                console.log("d", d);
                setData({
                    car: current_car,
                    similar: d,
                });
                setIsLoading(false);
                console.log("2",isLoading)
            })
            .catch(() => {
                setIsLoading(false);
                console.log("3",isLoading)
            });
    };

    return (
        <div>
            {data && (
                <Card sx={modalStyle} elevation={10}>
                    <CardHeader
                        title={data!.car.model}
                        subheader={data!.car.manufacturer}
                    />
                    <CardContent>
                        {isLoading ? (
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    height: 300,
                                }}
                            >
                                <CircularProgress />
                            </Box>
                        ) : (
                            <>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Condition: {data!.car.conditions}
                                    <br />
                                    Cylinders: {data!.car.cylinders}
                                    <br />
                                    Transmission: {data!.car.drive}
                                    <br />
                                    Mileage: {data!.car.odometer} miles
                                    <br />
                                    Year: {data!.car.year}
                                    <br />
                                    Price: {"$"}
                                    {data!.car.price}
                                </Typography>
                                <Typography variant="h6" sx={{ mt: 2 }}>
                                    Similar Cars:
                                </Typography>
                                <Box sx={{ overflow: "auto" }}>
                                    <List
                                        sx={{
                                            display: "flex",
                                            flexDirection: "row",
                                            padding: 0,
                                        }}
                                    >
                                        {data?.similar.map((car, index) => (
                                            <ListItem
                                                key={index}
                                                sx={{
                                                    width: "auto",
                                                    marginRight: 2,
                                                }}
                                            >
                                                <Card
                                                    sx={{ width: 300 }}
                                                    elevation={4}
                                                    onClick={() =>
                                                        setCurrentCar(car)
                                                    }
                                                >
                                                    <CardHeader
                                                        title={car.model}
                                                        subheader={
                                                            car.manufacturer
                                                        }
                                                    />
                                                    <CardContent>
                                                        <Typography
                                                            variant="body2"
                                                            color="text.secondary"
                                                        >
                                                            Condition:{" "}
                                                            {car.conditions}
                                                            <br />
                                                            Cylinders:{" "}
                                                            {car.cylinders}
                                                            <br />
                                                            Transmission:{" "}
                                                            {car.drive}
                                                            <br />
                                                            Mileage:{" "}
                                                            {car.odometer} miles
                                                            <br />
                                                            Price: ${car.price}
                                                        </Typography>
                                                    </CardContent>
                                                </Card>
                                            </ListItem>
                                        ))}
                                    </List>
                                </Box>
                            </>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default CarModal;
