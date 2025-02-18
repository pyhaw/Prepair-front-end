const HeroSection = () => {
    return (
      <section className="pt-32 text-center px-6">
        <h2 className="text-4xl font-bold text-gray-900">Fix it Fast with Prepair</h2>
        <p className="mt-4 text-lg text-gray-600">
          Prepair connects homeowners with professional contractors for transparent, efficient, and affordable repairs.
        </p>
        <button className="mt-6 bg-orange-500 text-white py-3 px-6 rounded-lg text-lg hover:bg-orange-600 transition">
          Get Started
        </button>
        <div className="mt-8 flex justify-center">
          <img
            src="https://source.unsplash.com/600x300/?home,repair"
            alt="Home Repair"
            className="rounded-lg shadow-md w-full max-w-lg"
          />
        </div>
      </section>
    );
  };
  
  export default HeroSection;
  