import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const CaseTable = ({ cases }) => {
    const navigate = useNavigate();

    const handleRowClick = (caseID) => {
        if (caseID) {
            navigate(`/caseview/${caseID}`);
        }
    };
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
                <thead>
                    <tr className="bg-gray-100 border-b border-gray-200">
                        <th className="py-4 px-4 text-left text-gray-600 font-medium">Case Number</th>
                        <th className="py-4 px-4 text-left text-gray-600 font-medium">Image</th>
                        <th className="py-4 px-4 text-left text-gray-600 font-medium">Name</th>
                        <th className="py-4 px-4 text-left text-gray-600 font-medium">Missing Age</th>
                        <th className="py-4 px-4 text-left text-gray-600 font-medium">City</th>
                        <th className="py-4 px-4 text-left text-gray-600 font-medium">County</th>

                        <th className="py-4 px-4 text-left text-gray-600 font-medium">Race</th>
                        {/* <th className="py-4 px-4 text-left text-gray-600 font-medium">Probable Cause</th> */}
                        <th className="py-4 px-4 text-left text-gray-600 font-medium">Biological Sex</th>
                    </tr>
                </thead>
                <tbody>
                    {cases.map((caseData, index) => (
                        <tr
                            key={index}
                            className="border-b border-gray-200 cursor-pointer hover:bg-gray-100"
                            onClick={() => handleRowClick(caseData.caseNumber)} // Navigate on row click
                        >
                            <td className="py-4 px-4 text-gray-600">{caseData.caseNumber || "N/A"}</td>
                            <td className="py-4 px-4">
                                {caseData.victimImage ? (
                                    <img
                                        src={caseData.victimImage}
                                        alt={`${caseData.name || "N/A"}'s Image`}
                                        className="w-12 h-12 rounded-full object-cover border border-gray-300"
                                    />
                                ) : (
                                    <img
                                        src={"https://www.pngitem.com/pimgs/m/287-2876223_no-profile-picture-available-hd-png-download.png"}
                                        alt={`${caseData.name || "N/A"}'s profile`}
                                        className="w-12 h-12 rounded-full object-cover border border-gray-300"
                                    />
                                )}
                            </td>
                            <td className="py-4 px-4">{caseData.name || "N/A"}</td>
                            <td className="py-4 px-4">{caseData.age !== undefined ? caseData.age : "N/A"}</td>
                            <td className="py-4 px-4">{caseData.city || "N/A"}</td>
                            <td className="py-4 px-4">{caseData.county || "N/A"}</td>
                            {/* <td className="py-4 px-4">{caseData.cause || "N/A"}</td> */}
                            <td className="py-4 px-4">{caseData.race || "N/A"}</td>
                            {/* <td className="py-4 px-4">{caseData.probableCause || "N/A"}</td> */}
                            <td className="py-4 px-4">{caseData.biologicalSex || "N/A"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

// Prop types validation
CaseTable.propTypes = {
    cases: PropTypes.arrayOf(
        PropTypes.shape({
            caseNumber: PropTypes.string,
            name: PropTypes.string,
            age: PropTypes.number,
            city: PropTypes.string,
            county: PropTypes.string,
            cause: PropTypes.string,
            race: PropTypes.string,
            probableCause: PropTypes.string,
            biologicalSex: PropTypes.string,
            victimImage: PropTypes.string,
        })
    ).isRequired,
};

export default CaseTable;