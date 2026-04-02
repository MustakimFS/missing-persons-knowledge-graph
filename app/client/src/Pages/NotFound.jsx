import notFound from "../images/notFound.jpg";
import { MapPin } from "lucide-react";

export default function NotFound() {
    return (
        <div className="grid place-items-center min-h-screen w-full px-4">
            <div className="text-center max-w-4xl w-full">
                <img
                    src={notFound}
                    alt="Home Page Image"
                    className="w-56 h-auto mx-auto lg:w-96"
                />

                <p className="text-black font-bold p-5 text-lg sm:text-2xl">
                    Looks like the page you are looking for is not here.
                </p>
                <p className="text-gray-800 text-sm sm:text-base text-left sm:text-center font-semibold">
                    If you believe there has been an error, please don&apos;t hesitate to contact our team. <br /> We will promptly assist you.
                </p>

                <div className="mt-4">
                    <p className="font-bold text-gray-700 text-lg">Team Members:</p>
                    <div className="space-y-3 text-left sm:text-lg">
                        <p><strong>Ayush Desai</strong> - <a href="mailto:adesai63@asu.edu" className="text-blue-500 hover:underline">adesai63@asu.edu</a></p>
                        <p><strong>Suparno Roy Chowdhury</strong> - <a href="mailto:srchowd3@asu.edu" className="text-blue-500 hover:underline">srchowd3@asu.edu</a></p>
                        <p><strong>Mrunal Kapure</strong> - <a href="mailto:mkapure@asu.edu" className="text-blue-500 hover:underline">mkapure@asu.edu</a></p>
                        <p><strong>Mustakim Shikalgar</strong> - <a href="mailto:mshikalg@asu.edu" className="text-blue-500 hover:underline">mshikalg@asu.edu</a></p>
                        <p><strong>Ramchander Venugopal</strong> - <a href="mailto:rvenugo7@asu.edu" className="text-blue-500 hover:underline">rvenugo7@asu.edu</a></p>
                    </div>
                    <p className="text-black mt-6 font-semibold text-sm sm:text-base flex items-center justify-center">
                        <MapPin className="mr-2" /> Arizona State University, Tempe, USA 🇺🇸
                    </p>
                </div>
            </div>
        </div>
    );
}