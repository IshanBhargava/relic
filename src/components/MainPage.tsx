import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import CarMap from "./CarMap";
import CarModal from "./CarModal";

import manModelData from "../data/data.json";
import { carData } from "../interface/CarData";
import { manu_model } from "../interface/ManuModel";

import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Slider from "@mui/material/Slider";
import Collapse from "@mui/material/Collapse";
import {
    Card,
    CardContent,
    CardHeader,
    Grid,
    Modal,
    Paper,
    Typography,
} from "@mui/material";
import styled from "@emotion/styled";
import SearchIcon from "@mui/icons-material/Search";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const Item = styled(Paper)(({ theme }) => ({
    textAlign: "center",
}));

const MainPage = () => {
    const apiOptions = useLocation().state

    const  [data, setData] = useState<carData[]>();
    const  [isPending, setIsPending] = useState<Boolean>(true);


    const [manmodel, setManmodel] = useState<manu_model[]>([]);
    const [selectedManufacturer, setSelectedManufacturer] = useState<string[]>(
        []
    );
    const [selectedModel, setSelectedModel] = useState<string[]>([]);
    const [availableModel, setAvailableModel] = useState<string[]>([]);

    const [distance, setDistance] = useState<string>("");
    const [price, setPrice] = useState<number[]>([10200, 194000]);
    const [year, setYear] = useState<number[]>([1900, 2022]);
    const [mileage, setMileage] = useState<number[]>([0, 10000000]);

    const [priceOpen, setPriceOpen] = useState(false);
    const [yearOpen, setYearOpen] = useState(false);
    const [mileageOpen, setMileageOpen] = useState(false);

    const [modalOpen, setModalOpen] = useState(false);
    const [modalData, setModalData] = useState<carData>();

    const dist_range = ["50", "100", "150"];

    
    useEffect(() => {
        console.log('apiOptions', apiOptions)
        fetch("http://127.0.0.1:5000/getcars", apiOptions)
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Could not retreive data");
                }
                return res.json();
            })
            .then((d) => {
                setData(d)
                setIsPending(false)
            })

        setManmodel(manModelData!["manumodel"]);
    }, [apiOptions]);

    const handleChange = async (event: any) => {
        const {
            target: { value },
        } = event;
        setSelectedManufacturer(
            typeof value === "string" ? value.split(",") : value
        );
        handleAvailableModels(value);
    };

    const handleAvailableModels = (sm: string[]) => {
        let am: string[] = [];
        manmodel
            .filter((item) => sm.includes(item.manufacturer))
            .map((item) => {
                item.models.forEach((item) => am.push(item));
                return item;
            });
        setAvailableModel(am.sort());
    };

    const handleModelChange = (event: any, data: any) => {
        setSelectedModel(typeof data === "string" ? data.split(",") : data)
    };

    const handleMenuChange = (menu: string) => {
        if (menu === "price") {
            setPriceOpen(!priceOpen);
        } else if (menu === "year") {
            setYearOpen(!yearOpen);
        } else if (menu === "mileage") {
            setMileageOpen(!mileageOpen);
        }
    };

    const handleMenuValueChange = (event: any, menu: string, newValue: any) => {
        if (menu === "price") {
            setPrice(newValue as number[]);
        } else if (menu === "year") {
            setYear(newValue as number[]);
        } else if (menu === "mileage") {
            setMileage(newValue as number[]);
        }
    };

    const handleModal = (car: any) => {
        setModalOpen(!modalOpen);
        setModalData(car);
    };

    const search = () => {
        if (selectedManufacturer.length !== 0 && distance.length !== 0) {
            const options = {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify({
                    manufacturer: selectedManufacturer,
                    model: selectedModel,
                    dist_range: distance,
                    lat: JSON.parse(apiOptions["body"]).lat,
                    long: JSON.parse(apiOptions["body"]).long,
                    price: price,
                    year: year,
                    mileage: mileage
                }),
            };
            setIsPending(true)
            fetch("http://127.0.0.1:5000/getcarsmain", options)
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Could not retreive data");
                }
                return res.json();
            })
            .then((d) => {
                setData(d)
                setIsPending(false)
            })
        } else {
            alert(
                "Please select atleast one Make and a distance range before searching."
            );
        }
    };

    return (
        <div id="main" className="flex flex-col">
            <div id="filterMenu" className="border-b-2 max-h-20">
                <div className="flex flex-row">
                    <Grid
                        container
                        columns={12}
                        className="flex"
                        justifyContent={"center"}
                    >
                        <Grid item xs={2}>
                            <Item sx={{ m: 1, width: 200 }}>
                                <FormControl
                                    id="make-select"
                                    className="bg-white"
                                    sx={{ width: 200 }}
                                >
                                    <InputLabel id="make-chip-label">
                                        Make
                                    </InputLabel>
                                    <Select
                                        id="make-chip"
                                        multiple
                                        value={selectedManufacturer}
                                        onChange={handleChange}
                                        input={
                                            <OutlinedInput
                                                id="select-multiple-manufacturer-chip"
                                                label="Chip"
                                            />
                                        }
                                        renderValue={(selected) => (
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    flexWrap: "wrap",
                                                    gap: 0.5,
                                                }}
                                            >
                                                {selected.map((value) => (
                                                    <Chip
                                                        key={value}
                                                        label={value}
                                                    />
                                                ))}
                                            </Box>
                                        )}
                                        MenuProps={MenuProps}
                                    >
                                        {manmodel.map((rec) => (
                                            <MenuItem
                                                key={rec.manufacturer}
                                                value={rec.manufacturer}
                                            >
                                                {rec.manufacturer}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Item>
                        </Grid>
                        <Grid item xs={2}>
                            <Item sx={{ m: 1, width: 200 }}>
                                <Autocomplete
                                    freeSolo
                                    multiple
                                    disableClearable
                                    id="model-autocomplete"
                                    disabled={selectedManufacturer.length === 0}
                                    onChange={(event, data): any => {
                                        handleModelChange(event, data)
                                    }}
                                    sx={{ width: 200 }}
                                    className="bg-white"
                                    options={availableModel.map(
                                        (model) => model
                                    )}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Model"
                                            InputProps={{
                                                ...params.InputProps,
                                                type: "search",
                                            }}
                                        />
                                    )}
                                />
                            </Item>
                        </Grid>
                        <Grid item xs={2}>
                            <Item sx={{ m: 1, width: 200 }}>
                                <FormControl
                                    id="distance-select"
                                    sx={{ width: 200 }}
                                    className="bg-white"
                                >
                                    <InputLabel id="distance-select-label">
                                        Distance
                                    </InputLabel>
                                    <Select
                                        labelId="distance-select-label"
                                        id="distance-select"
                                        value={distance.toString()}
                                        label="distance"
                                        onChange={(
                                            event: SelectChangeEvent
                                        ) => {
                                            setDistance(event.target.value);
                                        }}
                                        MenuProps={MenuProps}
                                    >
                                        <MenuItem value="">
                                            <em>None</em>
                                        </MenuItem>
                                        {dist_range.map((d) => (
                                            <MenuItem key={d} value={d}>
                                                {d}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Item>
                        </Grid>
                        <Grid item xs={1}>
                            <Item sx={{ m: 1, width: 100 }}>
                                <FormControl
                                    sx={{ width: 100 }}
                                    className="bg-white"
                                >
                                    <Button
                                        onClick={() => {
                                            handleMenuChange("price");
                                        }}
                                        sx={{ width: 100, height: 56 }}
                                    >
                                        Price
                                    </Button>
                                    <Collapse
                                        in={priceOpen}
                                        unmountOnExit
                                        className="m-4"
                                    >
                                        <Paper
                                            elevation={6}
                                            className="min-w-60 p-1 min-h-28 flex justify-center content-center"
                                        >
                                            <Slider
                                                sx={{ mt: 6, width: 150 }}
                                                value={price}
                                                onChange={(e, data) => {
                                                    handleMenuValueChange(
                                                        e,
                                                        "price",
                                                        data
                                                    );
                                                }}
                                                valueLabelDisplay="on"
                                                min={10200}
                                                max={194000}
                                                marks={[
                                                    {
                                                        value: 10200,
                                                        label: "10200",
                                                    },
                                                    {
                                                        value: 194000,
                                                        label: "194000",
                                                    },
                                                ]}
                                            />
                                        </Paper>
                                    </Collapse>
                                </FormControl>
                            </Item>
                        </Grid>
                        <Grid item xs={1}>
                            <Item sx={{ m: 1, width: 100 }}>
                                <FormControl
                                    sx={{ width: 100 }}
                                    className="bg-white"
                                >
                                    <Button
                                        onClick={() => {
                                            handleMenuChange("year");
                                        }}
                                        sx={{ width: 100, height: 56 }}
                                    >
                                        Year
                                    </Button>
                                    <Collapse
                                        in={yearOpen}
                                        unmountOnExit
                                        className="m-4"
                                    >
                                        <Paper
                                            elevation={6}
                                            className="min-w-60 p-1 min-h-28 flex justify-center content-center"
                                        >
                                            <Slider
                                                sx={{ mt: 6, width: 150 }}
                                                value={year}
                                                onChange={(e, data) => {
                                                    handleMenuValueChange(
                                                        e,
                                                        "year",
                                                        data
                                                    );
                                                }}
                                                valueLabelDisplay="on"
                                                min={1900}
                                                max={2022}
                                                marks={[
                                                    {
                                                        value: 1900,
                                                        label: "1900",
                                                    },
                                                    {
                                                        value: 2022,
                                                        label: "2022",
                                                    },
                                                ]}
                                            />
                                        </Paper>
                                    </Collapse>
                                </FormControl>
                            </Item>
                        </Grid>
                        <Grid item xs={1}>
                            <Item sx={{ m: 1, width: 100 }}>
                                <FormControl
                                    sx={{ width: 100 }}
                                    className="bg-white"
                                >
                                    <Button
                                        onClick={() => {
                                            handleMenuChange("mileage");
                                        }}
                                        sx={{ width: 100, height: 56 }}
                                    >
                                        Mileage
                                    </Button>
                                    <Collapse
                                        in={mileageOpen}
                                        unmountOnExit
                                        className="m-4"
                                    >
                                        <Paper
                                            elevation={6}
                                            className="min-w-60 p-1 min-h-28 flex justify-center content-center"
                                        >
                                            <Slider
                                                sx={{ mt: 6, width: 150 }}
                                                value={mileage}
                                                onChange={(e, data) => {
                                                    handleMenuValueChange(
                                                        e,
                                                        "mileage",
                                                        data
                                                    );
                                                }}
                                                valueLabelDisplay="on"
                                                min={0}
                                                max={10000000}
                                                marks={[
                                                    {
                                                        value: 0,
                                                        label: "0",
                                                    },
                                                    {
                                                        value: 10000000,
                                                        label: "10000000",
                                                    },
                                                ]}
                                            />
                                        </Paper>
                                    </Collapse>
                                </FormControl>
                            </Item>
                        </Grid>
                        <Grid item xs={1}>
                            <Item sx={{ m: 1, width: 100 }}>
                                <FormControl
                                    sx={{ width: 100 }}
                                    className="bg-white"
                                >
                                    <Button
                                        variant="contained"
                                        onClick={search}
                                        className="m-1 h-14"
                                    >
                                        <SearchIcon className="pr-2" /> Search
                                    </Button>
                                </FormControl>
                            </Item>
                        </Grid>
                    </Grid>
                </div>
            </div>
            <div id="page-content" className="mt-1">
            <Grid container columns={16}>
                    <Grid xs={8} sx={{ height: "full" }}>
                        <Item>
                            <div className="m-2 h-full">
                                {data && !isPending &&
                                    <CarMap
                                        cars={data}
                                        userLoc={[{lat: JSON.parse(apiOptions['body']).lat, lng: JSON.parse(apiOptions.body).long}]}
                                    />
                                }
                            </div>
                        </Item>
                    </Grid>
                    <Grid xs={8} sx={{ overflow: "auto", height: "full" }}>
                        <Grid container>
                            {isPending && 
                                <div>Loading</div>
                            }
                            {data && !isPending && data.map((car: carData) => (
                                    <Grid
                                        item
                                        xs={6}
                                        className="p-2"
                                        key={car.car_id}
                                    >
                                        <div
                                            onClick={() => {
                                                handleModal(car);
                                            }}
                                        >
                                            <Card elevation={4}>
                                                <CardHeader
                                                    title={car.model}
                                                    subheader={car.manufacturer}
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
                                                        Mileage: {
                                                            car.odometer
                                                        }{" "}
                                                        miles
                                                        <br />
                                                    </Typography>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </Grid>
                                ))}
                        </Grid>
                        {modalData && (
                            <Modal
                                open={modalOpen}
                                onClose={handleModal}
                                aria-labelledby="modal-modal-title"
                                aria-describedby="modal-modal-description"
                            >
                                <CarModal initialCar={modalData} />
                            </Modal>
                        )}
                    </Grid>
                </Grid>
            </div>
        </div>
    );
};

export default MainPage;
