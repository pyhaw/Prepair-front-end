"use client";

import { useEffect, useState } from "react";

const jobs = [
  { user: "Sarah", location: "Singapore", job: "Kitchen Sink Repair", time: "2 hours ago" },
  { user: "James", location: "North-East", job: "Roof Leak Fix", time: "1 day ago" },
  { user: "Maria", location: "West", job: "Electrical Wiring Check", time: "3 hours ago" },
];

const RecentJobs = () => {
  const [scrollIndex, setScrollIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setScrollIndex((prevIndex) => (prevIndex + 1) % jobs.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="mt-12 px-6 text-center">
      <h2 className="text-3xl font-bold text-gray-900">Recent Jobs Completed</h2>
      <div className="mt-6 bg-white p-6 shadow-md rounded-lg h-24 flex items-center justify-center">
        <p className="text-lg font-semibold text-gray-700">
          ✅ {jobs[scrollIndex].user} in {jobs[scrollIndex].location} just completed {jobs[scrollIndex].job} ({jobs[scrollIndex].time})
        </p>
      </div>
    </section>
  );
};

export default RecentJobs;
