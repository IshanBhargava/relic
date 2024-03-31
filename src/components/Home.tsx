import { useEffect, useState } from "react";
import data from "../data/data.json";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import SearchIcon from '@mui/icons-material/Search';

interface manu_model {
    manufacturer: string;
    models: string[];
}

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
    const [manmodel, setManmodel] = useState<manu_model[]>([]);
    const [selectedManufacturer, setSelectedManufacturer] = useState<string[]>([]);
    const [selectedModel, setSelectedModel] = useState<string[]>([]);
    const [availableModel, setAvailableModel] = useState<string[]>([]);

    useEffect(() => {
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

        manmodel.filter(item => sm.includes(item.manufacturer))
        .map(item => {
            item.models.forEach(item => am.push(item));
            return item;
        });
        setAvailableModel(am);
    }

    const handleModelChange = (event: any) => {
        const {
            target: { value },
        } = event;
        setSelectedModel(
            typeof value === "string" ? value.split(",") : value
        );
    };

    const test = () => {
        // console.log(selectedManufacturer);
        // console.log(selectedModel);
        navigator.geolocation.getCurrentPosition((position) => {
            console.log('Lat')
            console.log(position.coords.latitude)
            console.log('Long')
            console.log(position.coords.longitude)
        });
    };

    return (
        <div id="home" className="flex flex-col h-5/6">
            <div
                id="content"
                className="text-white flex justify-center items-center"
            >
                <div className="m-10">
                    <Card>
                        <CardContent className="bg-[#e4ede9] h-34">
                            <FormControl
                                id="make-select"
                                sx={{ m: 1, width: 300 }}
                                className="bg-white"
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
                            <FormControl id="model-select" sx={{ m: 1, width: 300 }} className="bg-white">
                                <InputLabel id="model-chip-label">
                                    Make
                                </InputLabel>
                                <Select
                                    id="make-chip"
                                    multiple
                                    value={selectedModel}
                                    disabled={selectedManufacturer.length === 0}
                                    onChange={handleModelChange}
                                    input={
                                        <OutlinedInput
                                            id="select-multiple-model-chip"
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
                                    {
                                        availableModel.map((model) => (
                                            <MenuItem key={model} value={model}>
                                                {model}
                                            </MenuItem>
                                        ))
                                    }
                                </Select>
                            </FormControl>
                            <FormControl id="model-select" sx={{ m: 1}}>
                                <Button onClick={test} variant="contained" className="m-1 h-14">
                                    <SearchIcon className="pr-2"/> Search
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
