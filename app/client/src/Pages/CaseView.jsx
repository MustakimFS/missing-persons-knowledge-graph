import Sidebar from "@/components/Sidebar";
import axios from "axios";
import { useParams, useNavigate } from 'react-router-dom';
import { Home, Loader } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

const CaseView = () => {
    const [victimData, setVictimData] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();

    const fetchCaseDetails = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/cases/${id}`);
            setVictimData(res.data);
        } catch (error) {
            console.error("Error fetching case details:", error);
        }
    };

    useEffect(() => {
        fetchCaseDetails();
    }, []);

    const dataCleaner = (url) => {
        if (!url) return "N/A";
        const segments = url.split('/');
        let lastSegment = segments[segments.length - 1];
        if (lastSegment.startsWith('MissingPersonReport#')) {
            lastSegment = lastSegment.replace('MissingPersonReport#', '');
        }
        return decodeURIComponent(lastSegment);
    };
    if (!victimData) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white p-6">
                <Loader className="animate-spin text-black" size={48} />
            </div>
        );
    }

    const {
        name: victimName,
        city: victimCity,
        county: victimCounty,
        age: victimMissingAge,
        case_number: victimCaseNumber,
        sex: victimSex,
        circumstance: victimCod,
        race: victimRace,
        dlc: victimDLC,
        namus_url: victimNamUS,
        image_url: victimImage,
        lat: latitude,
        lng: longitude,
    } = victimData;

    const handleViewMoreClick = () => {
        if (victimNamUS) {
            window.open(victimNamUS, '_blank');
        }
    };

    return (
        <div className="flex min-h-screen">
            <div className="hidden md:block">
                <Sidebar />
            </div>

            <div className="flex-1 p-6">
                <div className="mb-6">
                    <div className="flex items-center space-x-4 cursor-pointer" onClick={() => navigate('/')}>
                        <div className="flex items-center justify-center w-12 h-12 rounded-full border border-gray-300 cursor-pointer hover:bg-gray-100">
                            <Home className="text-gray-700" strokeWidth={1.5} />
                        </div>
                        <h1 className="text-4xl font-bold text-gray-800">Case Details</h1>
                    </div>
                </div>
                <div className="max-w-5xl mx-auto bg-white rounded-lg p-6 space-y-6 border border-gray-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex justify-center">
                            <img
                                src={victimImage || "https://www.pngitem.com/pimgs/m/287-2876223_no-profile-picture-available-hd-png-download.png"}
                                alt={victimName || "N/A"}
                                className="w-32 h-40 rounded-md object-cover border-2 border-gray-300"
                            />
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-3xl font-semibold text-black">{victimName || "N/A"}</h2>

                            <div className="border-t border-gray-300 mt-6"></div>
                            <div className="text-gray-600 space-y-2">
                                <h3 className="text-xl text-black font-bold">Case Information</h3>
                                <p><strong>Case Number:</strong> {victimCaseNumber || "N/A"}</p>
                                <p><strong>Date of Last Contact:</strong> {victimDLC || "N/A"}</p>
                                <p><strong>Location:</strong> {victimCity}, {victimCounty}</p>
                                <p><strong>Biological Sex:</strong> {victimSex || "N/A"}</p>
                                <p><strong>Race:</strong> {victimRace || "N/A"}</p>
                            </div>

                            <div className="border-t border-gray-300 mt-6"></div>
                            <div className="text-gray-600 space-y-2">
                                <h3 className="text-xl text-black font-bold">Demographics</h3>
                                <p><strong>Missing Age:</strong> {victimMissingAge || "N/A"} Years</p>
                                <p><strong>Current Age:</strong> {
                                    (() => {
                                        const missingYear = new Date(victimDLC).getFullYear();
                                        const currentYear = new Date().getFullYear();
                                        const diff = currentYear - missingYear;
                                        return diff >= 0 ? parseInt(victimMissingAge) + diff : victimMissingAge;
                                    })()
                                } Years</p>
                            </div>

                            <div className="border-t border-gray-300 mt-6"></div>
                            <div className="text-gray-600 space-y-2">
                                <h3 className="text-xl text-black font-bold">Circumstance of disappearance</h3>
                                <p>{victimCod || "N/A"}</p>
                            </div>

                            <div className="border-t border-gray-300 mt-6"></div>
                            <div className="text-gray-600 space-y-2">
                                <h3 className="text-xl text-black font-bold">Coordinates</h3>
                                <p><strong>Latitude:</strong> {latitude || "N/A"}</p>
                                <p><strong>Longitude:</strong> {longitude || "N/A"}</p>
                                <iframe src={`https://www.google.com/maps?q=${latitude},${longitude}&hl=en&z=14&output=embed`}></iframe>
                            </div>

                            <div className="border-t border-gray-300 mt-6"></div>
                            <Button variant="outline" onClick={handleViewMoreClick} className="w-full">
                                View More on NamUS
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default CaseView;