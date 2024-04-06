import { useEffect, useState } from "react";
// import useFetch from "../hooks/UseFetch";
import { useLocation } from "react-router-dom";
import CarMap from "./CarMap";

import { searchData } from "./dummyData";
import data from "../data/data.json";

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
    Typography
} from "@mui/material";
import styled from "@emotion/styled";

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

const modalStyle = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    // p: 4,
};

const MainPage = () => {
    // const location = useLocation();
    // const receivedOptions = location.state;
    // const { data, isPending, error } = useFetch("http://127.0.0.1:5000/getcars", receivedOptions);

    const opt = {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: '{"manufacturer":["gmc"],"model":[],"dist_range":"50","lat":41.6252514,"long":-71.0089784}',
    };

    const [manmodel, setManmodel] = useState<manu_model[]>([]);
    const [selectedManufacturer, setSelectedManufacturer] = useState<string[]>(
        []
    );
    const [selectedModel, setSelectedModel] = useState<string[]>([]);
    const [availableModel, setAvailableModel] = useState<string[]>([]);
    const [distance, setDistance] = useState<string>("");
    const [price, setPrice] = useState<number[]>([0, 100]);
    const [year, setYear] = useState<number[]>([1999, 2022]);
    const [mileage, setMileage] = useState<number[]>([0, 100000]);

    const [priceOpen, setPriceOpen] = useState(false);
    const [yearOpen, setYearOpen] = useState(false);
    const [mileageOpen, setMileageOpen] = useState(false);

    const [modalOpen, setModalOpen] = useState(false);

    const dist_range = ["50", "100", "150"];

    useEffect(() => {
        // console.log(JSON.parse(opt.body));
        setManmodel(data["manumodel"]);
    }, []);

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

    const handleModelChange = (event: any) => {
        const {
            target: { value },
        } = event;
        setSelectedModel(typeof value === "string" ? value.split(",") : value);
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

    const [modalData, setModalData] = useState<any>();
    const handleModal = (car: any) => {
        setModalOpen(!modalOpen);
        setModalData(car);
    };

    return (
        <div id="main" className="flex flex-col">
            <div id="filterMenu" className="border-b-2 max-h-20">
                <div className="flex flex-row">
                    <FormControl
                        id="make-select"
                        sx={{ m: 1, width: 100 }}
                        className="bg-white"
                    >
                        <InputLabel id="make-chip-label">Make</InputLabel>
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
                                        <Chip key={value} label={value} />
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
                    <Autocomplete
                        freeSolo
                        multiple
                        disableClearable
                        id="model-autocomplete"
                        disabled={selectedManufacturer.length === 0}
                        onChange={handleModelChange}
                        sx={{ m: 1, width: 100 }}
                        className="bg-white"
                        options={availableModel.map((model) => model)}
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
                    <FormControl
                        id="distance-select"
                        sx={{ m: 1, width: 110 }}
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
                            onChange={(event: SelectChangeEvent) => {
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
                    <FormControl
                        sx={{ m: 1, width: 110, height: 50 }}
                        className="bg-white"
                    >
                        <Button
                            onClick={() => {
                                handleMenuChange("price");
                            }}
                            className="border-2"
                        >
                            Price
                        </Button>
                        <Collapse in={priceOpen} unmountOnExit className="m-4">
                            <Paper elevation={6} className="min-w-52">
                                <Slider
                                    sx={{ m: 1, width: 150 }}
                                    value={price}
                                    onChange={(e, data) => {
                                        handleMenuValueChange(e, "price", data);
                                    }}
                                    valueLabelDisplay="on"
                                    min={0}
                                    max={100}
                                    marks={[
                                        {
                                            value: 0,
                                            label: "0",
                                        },
                                        {
                                            value: 100,
                                            label: "100",
                                        },
                                    ]}
                                />
                            </Paper>
                        </Collapse>
                    </FormControl>
                    <FormControl
                        sx={{ m: 1, width: 110, height: 50 }}
                        className="bg-white"
                    >
                        <Button
                            onClick={() => {
                                handleMenuChange("year");
                            }}
                            className="border-2"
                        >
                            Year
                        </Button>
                        <Collapse in={yearOpen} unmountOnExit className="m-4">
                            <Paper elevation={6} className="min-w-52">
                                <Slider
                                    sx={{ m: 1, width: 150 }}
                                    value={year}
                                    onChange={(e, data) => {
                                        handleMenuValueChange(e, "year", data);
                                    }}
                                    valueLabelDisplay="on"
                                    min={1999}
                                    max={2022}
                                    marks={[
                                        {
                                            value: 1999,
                                            label: "1999",
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
                    <FormControl
                        sx={{ m: 1, width: 110, height: 50 }}
                        className="bg-white"
                    >
                        <Button
                            onClick={() => {
                                handleMenuChange("mileage");
                            }}
                            className="border-2"
                        >
                            Mileage
                        </Button>
                        <Collapse
                            in={mileageOpen}
                            unmountOnExit
                            className="m-4"
                        >
                            <Paper elevation={6} className="min-w-52">
                                <Slider
                                    sx={{ m: 1, width: 150 }}
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
                                    max={100000}
                                    marks={[
                                        {
                                            value: 0,
                                            label: "0",
                                        },
                                        {
                                            value: 100000,
                                            label: "100000",
                                        },
                                    ]}
                                />
                            </Paper>
                        </Collapse>
                    </FormControl>
                </div>
            </div>
            <div id="page-content" className="mt-1">
                <Grid container columns={16}>
                    <Grid
                        xs={8}
                        className="border-2 pr-2 border-black"
                        sx={{ height: "full" }}
                    >
                        <Item>
                            <CarMap carData={searchData}/>
                        </Item>
                    </Grid>
                    <Grid
                        xs={8}
                        sx={{ overflow: "auto", height: "full" }}
                        className="border-2 pl-1 border-rose-600"
                    >
                        <Grid container>
                            {searchData.map((car) => (
                                <Grid item xs={6} className="p-2" key={car.car_id}>
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
                                                    Condition: {car.conditions}
                                                    <br />
                                                    Cylinders: {car.cylinders}
                                                    <br />
                                                    Transmission: {car.drive}
                                                    <br />
                                                    Mileage: {car.odometer}{" "}
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
                                <Card sx={modalStyle} elevation={10}>
                                    <CardHeader
                                        title={modalData.model}
                                        subheader={modalData.manufacturer}
                                    />
                                    <CardContent>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            Condition: {modalData.conditions}
                                            <br />
                                            Cylinders: {modalData.cylinders}
                                            <br />
                                            Transmission: {modalData.drive}
                                            <br />
                                            Mileage: {modalData.odometer} miles
                                            <br />
                                            Year: {modalData.year}
                                            <br />
                                            Price: {"$"}
                                            {modalData.price}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Modal>
                        )}
                    </Grid>
                </Grid>
            </div>
        </div>
    );
};

export default MainPage;