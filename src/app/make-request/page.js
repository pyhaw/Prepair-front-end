"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function MakeRequest() {
  return (
    <div>
        <Navbar />
        <div className="max-w-4xl mx-auto mt-32 p-6">
            <h2 className="text-4xl font-bold flex items-center">
            <span className="mr-2">🔧</span> New Repair Request
            </h2>

            {/* Upload Media */}
            <div className="mt-4">
                <label className="block font-semibold mb-1">Upload Media</label>
                <div className="border-2 border-dashed p-6 rounded-md bg-gray-100 text-center relative">
                    <input 
                    type="file" 
                    accept="image/png, image/jpeg, image/heic, video/mp4, video/quicktime" 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                    id="fileUpload"
                    />
                    <label htmlFor="fileUpload" className="cursor-pointer block">
                    Click to Upload (Accepted: JPG, PNG, HEIC, MP4, MOV)
                    </label>
                </div>

                <button className="mt-2 bg-orange-500 text-white px-4 py-2 rounded"
                    onClick={() => document.getElementById("fileUpload").click()}>
                    Upload
                </button>
            </div>

            {/* Select Repair Category */}
            <div className="mt-4">
            <label className="block font-semibold mb-1">Select Repair Category</label>
            <select className="w-full border p-2 rounded">
                <option>Select</option>
            </select>
            </div>

            {/* Issue Description */}
            <div className="mt-4">
            <label className="block font-semibold mb-1">Issue Description</label>
            <textarea className="w-full border p-2 rounded h-24" placeholder="Describe your issue"></textarea>
            </div>

            {/* Select Location */}
            <div className="mt-4">
                <label className="block font-semibold mb-1">Select Location</label>
                <select className="w-full border p-2 rounded">
                    <option value="" disabled selected>Select</option>
                    <option value="central">Central</option>
                    <option value="north">North</option>
                    <option value="northeast">North-East</option>
                    <option value="east">East</option>
                    <option value="west">West</option>
                </select>
            </div>

            {/* Urgency Level */}
            <div className="mt-4">
                <label className="block font-semibold mb-1">Urgency Level</label>
                <select className="w-full border p-2 rounded">
                    <option value="" disabled selected>Select</option>
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                </select>
            </div>

            {/* Select Date */}
            <div className="mt-4">
            <label className="block font-semibold mb-1">Select Date</label>
            <input type="date" className="w-full border p-2 rounded" />
            </div>

            {/* Budget Range */}
            <div className="mt-4">
            <label className="block font-semibold mb-1">Budget Range</label>
            <div className="flex space-x-2">
                <input type="text" className="border p-2 rounded w-1/2" placeholder="Min. $" />
                <input type="text" className="border p-2 rounded w-1/2" placeholder="Max. $" />
            </div>
            </div>

            {/* Notification Toggle */}
            <div className="mt-4 flex items-center space-x-2">
            <input type="checkbox" className="h-5 w-5 text-orange-500" />
            <label>Notify me when a bid is received</label>
            </div>

            {/* Submit Button */}
            <div className="mt-6">
            <button className="bg-orange-500 text-white px-6 py-3 rounded w-full">
                Submit
            </button>
            </div>
        </div>

        <Footer />
    </div>
  );
}


