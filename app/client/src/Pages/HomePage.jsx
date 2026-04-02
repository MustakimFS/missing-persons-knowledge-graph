import Sidebar from "@/components/Sidebar";
import homeImage from "../images/homeImage.png";

const HomePage = () => {
    return (
        <div className="flex min-h-screen">
            <div className="md:block">
                <Sidebar />
            </div>
            <div className=" hidden sm:flex justify-end items-center m-l:auto m-r:auto p-20">
                <img
                    src={homeImage}
                    alt="Home Page Image"
                    className="w-52 h-auto"
                />
                <p className="font-semibold text-lg text-gray-700">Complete the fields to begin your search for missing individuals in the State of California.</p>
            </div>

        </div>
    );
};

export default HomePage;