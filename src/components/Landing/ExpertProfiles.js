const experts = [
    { name: "Jeremy Tan Pua Heng", location: "North-East", experience: "8 years", serviceArea: "Central, North, East" },
    { name: "Alex Lim", location: "West", experience: "5 years", serviceArea: "West, North" },
    { name: "Sarah Wong", location: "Central", experience: "10 years", serviceArea: "Central, East" },
  ];
  
  const ExpertProfiles = () => {
    return (
      <section id="experts" className="mt-12 px-6">
        <h2 className="text-3xl font-bold text-center text-gray-900">Repair Experts At Your Service</h2>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {experts.map((expert, index) => (
            <div key={index} className="bg-white p-6 shadow-md rounded-lg text-center">
              <h3 className="text-lg font-semibold text-gray-900">Profile</h3>
              <p className="text-gray-700 font-semibold">{expert.name}</p>
              <p className="text-gray-600">Location: {expert.location}</p>
              <p className="text-gray-600">Experience: {expert.experience}</p>
              <p className="text-gray-600">Service Area: {expert.serviceArea}</p>
            </div>
          ))}
        </div>
      </section>
    );
  };
  
  export default ExpertProfiles;
  