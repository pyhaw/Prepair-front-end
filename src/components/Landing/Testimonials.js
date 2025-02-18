const testimonials = [
    { user: "@ZackeusChoo", text: "This platform is lit", joined: "December 2021" },
    { user: "@Chicken", text: "I'm so happy I could find my repairman", joined: "December 2021" },
    { user: "@Repairguy", text: "I wanna help others", joined: "December 2021" },
    { user: "@Repairgirl", text: "Wow this is so transparent!", joined: "December 2021" },
  ];
  
  const Testimonials = () => {
    return (
      <section id="testimonials" className="mt-12 px-6">
        <h2 className="text-3xl font-bold text-center text-gray-900">Trusted By Forward Thinkers</h2>
        <div className="mt-6 flex justify-center">
          <div className="flex overflow-x-auto space-x-4 w-full max-w-4xl justify-center">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 shadow-md rounded-lg min-w-[300px] text-center">
                <h3 className="text-lg font-semibold text-gray-900">{testimonial.user}</h3>
                <p className="text-gray-600 mt-2">{testimonial.text}</p>
                <span className="text-gray-400 text-sm mt-2 block">Joined {testimonial.joined}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };
  
  export default Testimonials;
  