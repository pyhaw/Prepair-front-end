const features = [
    { title: "AI-Powered Advisory", description: "Smart recommendations for your repair needs." },
    { title: "Easy Access to Professionals", description: "Connect with trusted contractors instantly." },
    { title: "Transparent", description: "Clear pricing with no hidden costs." },
    { title: "Effective", description: "Efficient solutions tailored to your home." },
  ];
  
  const FeatureSection = () => {
    return (
      <section id="features" className="mt-12 px-6">
        <h2 className="text-3xl font-bold text-center text-gray-900">Why Choose Prepair?</h2>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="bg-orange-500 text-white p-6 rounded-lg text-center shadow-md">
              <h3 className="text-xl font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
    );
  };
  
  export default FeatureSection;
  