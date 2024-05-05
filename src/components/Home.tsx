import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import data from "../data/data.json";
import {manu_model} from "../interface/ManuModel"

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import SearchIcon from "@mui/icons-material/Search";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

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

const Home = () => {
    const navigate = useNavigate();
    const [manmodel, setManmodel] = useState<manu_model[]>([]);
    const [selectedManufacturer, setSelectedManufacturer] = useState<string[]>([]);
    const [selectedModel, setSelectedModel] = useState<string[]>([]);
    const [availableModel, setAvailableModel] = useState<string[]>([]);
    const [lat, setLat] = useState(0);
    const [long, setLong] = useState(0);
    const [distance, setDistance] = useState<string>("");

    const dist_range = ["50", "100", "150"];

    useEffect(() => {
        setManmodel(data["manumodel"]);

        navigator.geolocation.getCurrentPosition((position) => {
            setLat(position.coords.latitude);
            setLong(position.coords.longitude);
        });
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

    const handleModelChange = (event: any, data: any) => {
        setSelectedModel(typeof data === "string" ? data.split(",") : data)
    };

    const submit = () => {
        if (
            selectedManufacturer.length !== 0 &&
            lat !== 0 &&
            long !== 0 &&
            distance.length !== 0
        ) {
            const options = {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    manufacturer: selectedManufacturer,
                    model: selectedModel,
                    dist_range: distance,
                    lat: lat,
                    long: long,
                }),
            };
            navigate('/searched', {state: options})
        } else {
            alert(
                "Please fill all the values and allow location if you haven't"
            );
        }
    };

    return (
        <div id="home" className="flex flex-col h-5/6">
            <div id="content" className="flex justify-center items-center">
                <div className="m-40">
                    <Card>
                        <CardContent className="bg-[#e4ede9] h-34 flex flex-row">
                            <FormControl
                                required
                                id="make-select"
                                sx={{ m: 1, width: 300 }}
                                className="bg-white"
                            >
                                <InputLabel id="make-chip-label">
                                    Make
                                </InputLabel>
                                <Select
                                    id="make-chip"
                                    value={selectedManufacturer}
                                    onChange={handleChange}
                                    input={
                                        <OutlinedInput
                                            id="select-multiple-manufacturer-chip"
                                            label="Chip"
                                        />
                                    }
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
                                id="model-autocomplete"
                                disabled={selectedManufacturer.length === 0}
                                onChange={(event, data): any => {
                                    handleModelChange(event, data)
                                }}
                                sx={{ m: 1, width: 300 }}
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
                            <FormControl
                                required
                                id="distance-select"
                                sx={{ m: 1, width: 300 }}
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
                            <FormControl id="model-select" sx={{ m: 1 }}>
                                <Button
                                    onClick={submit}
                                    variant="contained"
                                    className="m-1 h-14"
                                >
                                    <SearchIcon className="pr-2" /> Search
                                </Button>
                            </FormControl>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Home;
