import { useState } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { raceValues, ageRange, cityCounties, biologicalSex, codDropdown } from "../data/data";
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
    const navigate = useNavigate();
    const [selectedName, setSelectedName] = useState("");
    const [selectedCaseID, setSelectedCaseID] = useState("");
    const [selectedRace, setSelectedRace] = useState([]);
    const [selectedSex, setSelectedSex] = useState("");
    const [selectedAgeRanges, setSelectedAgeRanges] = useState([]);
    const [selectedCounty, setSelectedCounty] = useState("");
    const [selectedCity, setSelectedCity] = useState("");
    const [selectedCOD, setSelectedCOD] = useState("");
    const [filteredCities, setFilteredCities] = useState([]);

    const handleCountyChange = (county) => {
        setSelectedCounty(county);
        const cities = cityCounties[0][county] || [];
        setFilteredCities(cities);
        setSelectedCity(""); // Resets city selection when county changes
    };

    const handleRaceChange = (race) => {
        setSelectedRace((prev) =>
            prev.includes(race)
                ? prev.filter((item) => item !== race)
                : [...prev, race]
        );
    };
    const handleAgeRangeChange = (key) => {
        setSelectedAgeRanges((prev) =>
            prev.includes(key)
                ? prev.filter((item) => item !== key)
                : [...prev, key]
        );
    };

    const handleSexChange = (sex) => {
        setSelectedSex(sex);
    };


    const handleSearch = () => {
        const searchData = {
            name: selectedName,
            caseID: selectedCaseID,
            race: selectedRace,
            ageRange: selectedAgeRanges.map((key) => ageRange[key]),
            isOfAge: selectedAgeRanges.map((key) => ageRange[key]),
            county: selectedCounty,
            city: selectedCity,
            cod: selectedCOD,
            sex: selectedSex,
        };
        navigate('/cases', { state: { searchData } });
    };

    return (
        <aside className="h-screen sticky top-0">
            <nav className="h-full flex flex-col bg-white border-r shadow-sm overflow-y-auto sticky">
                <div className="flex justify-between items-center">
                    <img
                        src="https://aci.az.gov/sites/default/files/media/ASU-logo.png"
                        className="w-24 cursor-pointer"
                        alt="logo"
                        onClick={() => navigate('/')}
                    />
                </div>
                <div className="p-2">
                    <p className="font-bold text-xl p-2">Missing Persons Tracker</p>
                    <Input
                        type="text"
                        placeholder="Search by Name..."
                        value={selectedName}
                        onChange={(e) => setSelectedName(e.target.value)}
                        className="w-full p-2 rounded-lg bg-white border border-gray-200 mb-5"
                    />
                    <div className="flex items-center my-4">
                        <hr className="flex-grow border-gray-300" />
                        <span className="mx-2 text-gray-500 font-medium">or</span>
                        <hr className="flex-grow border-gray-300" />
                    </div>
                    <Input
                        type="text"
                        placeholder="Search by Case ID..."
                        value={selectedCaseID}
                        onChange={(e) => setSelectedCaseID(e.target.value)}
                        className="w-full p-2 rounded-lg bg-white border border-gray-200"
                    />
                </div>
                <div className="p-4">
                    <p className="font-bold text-xl mb-2">Biological Sex</p>
                    <div className="grid grid-cols-2 gap-2">
                        {biologicalSex.map((sexOption, index) => (
                            <label
                                key={index}
                                className="flex items-center space-x-2 text-sm text-black"
                            >
                                <input
                                    type="radio"
                                    name="biologicalSex"
                                    className="h-4 w-4 rounded border-gray-300"
                                    checked={selectedSex === sexOption}
                                    onChange={() => handleSexChange(sexOption)}
                                />
                                <span>{sexOption}</span>
                            </label>
                        ))}
                    </div>
                </div>
                <div className="p-4">
                    <p className="font-bold text-xl mb-2">Race</p>
                    <div className="grid grid-cols-2 gap-2">
                        {raceValues.map((raceValueOption, index) => (
                            <label
                                key={index}
                                className="flex items-center space-x-2 text-sm text-black"
                            >
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300"
                                    checked={selectedRace.includes(raceValueOption)}
                                    onChange={() => handleRaceChange(raceValueOption)}
                                />
                                <span>{raceValueOption}</span>
                            </label>
                        ))}
                    </div>
                </div>
                <div className="p-4">
                    <p className="font-bold text-xl mb-2">Missing Age Range</p>
                    <div className="grid grid-cols-2 gap-2">
                        {Object.keys(ageRange).map((key, index) => (
                            <label key={index} className="flex items-center space-x-2 text-sm text-black">
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300"
                                    checked={selectedAgeRanges.includes(key)}
                                    onChange={() => handleAgeRangeChange(key)}
                                />
                                <span>{key}</span>
                            </label>
                        ))}
                    </div>
                </div>
                <div className="p-4">
                    <p className="font-bold text-xl mb-2">County</p>
                    <Select onValueChange={handleCountyChange}>
                        <SelectTrigger className="w-full p-2 rounded-lg border border-gray-200">
                            <SelectValue placeholder="Select a County" />
                        </SelectTrigger>
                        <SelectContent>
                            {Object.keys(cityCounties[0]).map((county, index) => (
                                <SelectItem key={index} value={county}>
                                    {county}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="p-4">
                    <p className="font-bold text-xl mb-2">City</p>
                    <Select onValueChange={(value) => setSelectedCity(value)}>
                        <SelectTrigger className="w-full p-2 rounded-lg border border-gray-200">
                            <SelectValue placeholder="Select a City" />
                        </SelectTrigger>
                        <SelectContent>
                            {filteredCities.length > 0 ? (
                                filteredCities.map((city, index) => (
                                    <SelectItem key={index} value={city}>
                                        {city}
                                    </SelectItem>
                                ))
                            ) : (
                                <SelectItem disabled value="noCitiesAvailable">
                                    No cities available
                                </SelectItem>
                            )}
                        </SelectContent>
                    </Select>
                </div>

                <div className="p-4">
                    <p className="font-bold text-xl mb-2">Cause of Disappearance</p>
                    <Select onValueChange={(value) => setSelectedCOD(value)}>
                        <SelectTrigger className="w-full p-2 rounded-lg border border-gray-200">
                            <SelectValue placeholder="Select a Cause" />
                        </SelectTrigger>
                        <SelectContent>
                            {codDropdown.map((cause, index) => (
                                <SelectItem key={index} value={cause}>
                                    {cause}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <div className="flex items-center my-4">
                        <hr className="flex-grow border-gray-300" />
                        <span className="mx-2 text-gray-500 font-medium">or</span>
                        <hr className="flex-grow border-gray-300" />
                    </div>
                    <Input
                        type="text"
                        placeholder="Search by keyword..."
                        value={selectedCOD}
                        onChange={(e) => setSelectedCOD(e.target.value)}
                        className="w-full p-2 rounded-lg bg-white border border-gray-200"
                    />
                </div>
                <div className="p-4 flex justify-center">
                    <Button variant="outline" className="w-64 font-semibold" onClick={handleSearch}>
                        <span className="font-bold">Search</span>
                    </Button>
                </div>
            </nav>
        </aside>
    );
};

export default Sidebar;