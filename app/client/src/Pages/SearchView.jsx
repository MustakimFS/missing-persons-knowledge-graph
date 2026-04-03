import CaseCard from "@/components/CaseCard";
import CaseTable from "@/components/CaseTable";
import Sidebar from "@/components/Sidebar";
import axios from "axios";
import { useState, useEffect } from "react";
import { ArrowLeft, Loader } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Brain, ChevronUp, House, TableProperties, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";

const ITEMS_PER_PAGE = 20;

const SearchView = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const [useAI, setUseAI] = useState(false);
    const [cases, setCases] = useState(null);
    const [aiSummary, setAiSummary] = useState(null);
    const [toggleView, setToggleView] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    const handleDataSummary = async () => {
        setUseAI((prevState) => !prevState);
        if (!useAI && cases) {
            try {
                const res = await axios.post("http://localhost:8080/case/summary", cases);
                setAiSummary(res.data.summary);
            } catch (error) {
                console.error("Error fetching AI summary:", error);
                setAiSummary("Failed to generate AI summary.", error);
            }
        }
    };

    const toggleCaseView = () => {
        setToggleView((prevState) => !prevState);
    };

    // Extract search data
    const { searchData } = state || {};
    const victimName = searchData?.name || '';
    const county_of_origin = searchData?.county || '';
    const city_of_origin = searchData?.city || '';
    const missing_age = searchData?.ageRange || [];
    const cod = searchData?.cod || '';
    const Bio_Sex = searchData?.sex || '';
    const caseID = searchData?.caseID || '';
    const Race_Ethnicity = searchData?.race || '';
    const isOfAge = searchData?.isOfAge || [];

    // Data Cleaner
    const cleanData = (data) => ({
        id: data.id,
        caseNumber: data.case_number,
        name: data.name || "N/A",
        age: data.age,
        city: data.city,
        county: data.county,
        cause: data.circumstance || "N/A",
        race: data.race || "N/A",
        biologicalSex: data.sex,
        victimImage: data.image_url || null,
        namusUrl: data.namus_url,
        lat: data.lat,
        lng: data.lng,
    });

    // Fetch all cases based on the parameters
    const fetchCases = async () => {
        if (!searchData) return;
        try {
            const params = new URLSearchParams();
            if (victimName) params.append("name", victimName);
            if (city_of_origin) params.append("city", city_of_origin);
            if (county_of_origin) params.append("county", county_of_origin);
            if (Bio_Sex) params.append("sex", Bio_Sex);

            // Race is an array — just use the first selected value
            if (Race_Ethnicity?.length > 0) params.append("race", Race_Ethnicity[0]);

            // Age range is array of [min,max] pairs — find overall min and max
            if (missing_age?.length > 0) {
                const allAges = missing_age.flat();
                params.append("min_age", Math.min(...allAges));
                params.append("max_age", Math.max(...allAges));
            }

            params.append("limit", 500);

            const res = await axios.get(`${import.meta.env.VITE_API_URL}/cases?${params.toString()}`);
            const result = res.data.cases.map(cleanData);
            setCases(result);
        } catch (error) {
            console.error("Error fetching cases:", error);
            setCases([]);
        }
    };

    useEffect(() => {
        fetchCases();
        setUseAI(false);
        setAiSummary(null);
    }, [state]);

    // Pagination logic
    const totalPages = cases ? Math.ceil(cases.length / ITEMS_PER_PAGE) : 1;

    const paginatedCases = cases
        ? cases.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
        : [];

    const goToPage = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    if (cases === null) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white p-6">
                <Loader className="animate-spin text-black" size={48} />
            </div>
        );
    }

    return (
        <div className="flex min-h-screen">
            <div className="hidden md:block">
                <Sidebar />
            </div>

            {/* Mobile View */}
            <div className="flex-1 p-4 md:hidden space-y-6">
                <p className="p-2 text-3xl font-bold">
                    Search Results ({cases?.length || 0})
                </p>
                <div className="flex justify-between items-center mt-2">
                    <div
                        className="flex items-center justify-center w-12 h-12 rounded-full border border-gray-300 cursor-pointer hover:bg-gray-100"
                        onClick={() => navigate("/")}
                    >
                        <ArrowLeft className="text-gray-700" strokeWidth={1.5} />
                    </div>

                    <div
                        className="flex items-center justify-center w-12 h-12 rounded-full border border-gray-300 cursor-pointer hover:bg-gray-100"
                        onClick={handleDataSummary}
                    >
                        {useAI ? (
                            <ChevronUp className="text-gray-700" strokeWidth={1.5} />
                        ) : (
                            <Brain className="text-gray-700" strokeWidth={1.5} />
                        )}
                    </div>
                </div>

                {useAI && (
                    <div className="p-4 mb-5 bg-white border border-gray-200 rounded-lg">
                        <p className="font-bold">Data Summary:</p>
                        <p>{aiSummary || "Generating summary..."}</p>
                    </div>
                )}

                <div>
                    {paginatedCases.map((caseItem, index) => (
                        <CaseCard key={index} {...caseItem} />
                    ))}
                </div>

                {/* Pagination Controls */}
                <div className="flex justify-center items-center space-x-4 mt-6">
                    <Button
                        variant="outline"
                        className={`w-28 font-semibold ${currentPage === 1 ? 'cursor-not-allowed opacity-50' : ''}`}
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </Button>
                    <span className="text-lg text-gray-700">{` ${currentPage} of ${totalPages}`}</span>
                    <Button
                        variant="outline"
                        className={`w-28 font-semibold ${currentPage === totalPages ? 'cursor-not-allowed opacity-50' : ''}`}
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </Button>
                </div>
            </div>

            {/* PC View */}
            <div className="hidden md:flex-1 md:p-4 md:block">
                <div className="p-4">
                    <p className="text-4xl font-bold">
                        Search Results ({cases?.length || 0})
                    </p>
                    <div className="mt-4 flex items-center space-x-4">
                        <div
                            className="flex items-center justify-center w-12 h-12 rounded-full border border-gray-300 cursor-pointer hover:bg-gray-100"
                            onClick={() => navigate("/")}
                        >
                            <House className="text-gray-700" strokeWidth={1.5} />
                        </div>
                        <div
                            className="flex items-center justify-center w-12 h-12 rounded-full border border-gray-300 cursor-pointer hover:bg-gray-100"
                            onClick={toggleCaseView}
                        >
                            {toggleView ? (
                                <TableProperties className="text-blue-500" strokeWidth={1.5} />
                            ) : (
                                <CreditCard className="text-blue-500" strokeWidth={1.5} />
                            )}
                        </div>
                        <div
                            className="flex items-center justify-center w-12 h-12 rounded-full border border-gray-300 cursor-pointer hover:bg-gray-100"
                            onClick={handleDataSummary}
                        >
                            {useAI ? (
                                <ChevronUp className="text-gray-700" strokeWidth={1.5} />
                            ) : (
                                <Brain className="text-gray-700" strokeWidth={1.5} />
                            )}
                        </div>
                    </div>
                </div>

                {useAI && (
                    <div className="p-4 mb-5 bg-white border border-gray-200 rounded-lg">
                        <p className="font-bold">Data Summary:</p>
                        <p>{aiSummary || "Generating summary..."}</p>
                    </div>
                )}

                <div>
                    {toggleView ? (
                        <CaseTable cases={paginatedCases} />
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {paginatedCases.map((caseItem, index) => (
                                <div key={index} className="max-w-[500px] w-full mx-auto">
                                    <CaseCard {...caseItem} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Pagination UI */}
                <div className="flex justify-center items-center space-x-4 mt-6">
                    <Button
                        variant="outline"
                        className={`w-28 font-semibold ${currentPage === 1 ? 'cursor-not-allowed opacity-50' : ''}`}
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </Button>
                    <span className="text-md text-gray-700 font-semibold">{`${currentPage} of ${totalPages}`}</span>
                    <Button
                        variant="outline"
                        className={`w-28 font-semibold ${currentPage === totalPages ? 'cursor-not-allowed opacity-50' : ''}`}
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default SearchView;