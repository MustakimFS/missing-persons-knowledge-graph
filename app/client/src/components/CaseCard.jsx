import PropTypes from "prop-types";
import { MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CaseCard = ({ caseNumber, name, city, county, race, biologicalSex, victimImage, age }) => {
    const navigate = useNavigate();

    const handleCardClick = () => {
        if (caseNumber) {
            navigate(`/caseview/${caseNumber}`);
        }
    };
    return (
        <div className="bg-white p-6 px-10 rounded-lg shadow-sm border border-gray-200 w-full max-w-md mx-auto mb-6 hover:shadow-md cursor-pointer" onClick={handleCardClick} >
            <div className="flex items-center space-x-4">
                {victimImage ? (
                    <img
                        src={victimImage}
                        alt={`${name || "N/A"}'s profile`}
                        className="w-16 h-16 rounded-full object-cover border border-gray-300"
                    />
                ) : (
                    <img
                        src={"https://www.pngitem.com/pimgs/m/287-2876223_no-profile-picture-available-hd-png-download.png"}
                        alt={`${name || "N/A"}'s Image`}
                        className="w-16 h-16 rounded-full object-cover border border-gray-300"
                    />
                )}

                <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-800">{name || "N/A"}</h3>
                    <p className="text-sm text-gray-500">Case Number: {caseNumber || "N/A"}</p>
                    <div className="flex items-center mt-1 text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                        <span>{`${city || "N/A"}, ${county || "N/A"}`}</span>
                    </div>
                    <p className="text-sm text-gray-600">Missing Age: {age || "N/A"}</p>
                </div>
            </div>

            <div className="mt-4 space-y-2">
                <p className="text-gray-700">
                    <span className="font-medium">Race:</span> {race || "N/A"}
                </p>
                <p className="text-gray-700">
                    <span className="font-medium">Biological Sex:</span> {biologicalSex || "N/A"}
                </p>
            </div>
        </div>
    );
};

// Prop types validation
CaseCard.propTypes = {
    caseNumber: PropTypes.string,
    name: PropTypes.string,
    city: PropTypes.string,
    county: PropTypes.string,
    cause: PropTypes.string,
    race: PropTypes.string,
    probableCause: PropTypes.string,
    biologicalSex: PropTypes.string,
    victimImage: PropTypes.string,
    age: PropTypes.number,
};

export default CaseCard;