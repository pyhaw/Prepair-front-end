import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const testimonials = [
  { user: "@ZackeusChoo", text: "This platform is lit", joined: "December 2021" },
  { user: "@Chicken", text: "I'm so happy I could find my repairman", joined: "December 2021" },
  { user: "@Repairguy", text: "I wanna help others", joined: "December 2021" },
  { user: "@Repairgirl", text: "Wow this is so transparent!", joined: "December 2021" },
];

const Testimonials = () => {
  return (
    <section id="testimonials" className="mt-16 px-6">
      <h2 className="text-3xl font-bold text-center text-gray-900">Trusted By Forward Thinkers</h2>
      <div className="mt-8 flex overflow-x-auto gap-4 py-2 px-1 scroll-snap-x snap-mandatory">
        {testimonials.map((t, idx) => (
          <Card
            key={idx}
            className="snap-center min-w-[300px] flex-shrink-0 p-6 text-center shadow-lg transition hover:shadow-xl"
          >
            <CardContent className="space-y-3">
              <Avatar className="mx-auto bg-orange-500 text-white">
                <AvatarFallback>{t.user.charAt(1).toUpperCase()}</AvatarFallback>
              </Avatar>
              <h3 className="text-lg font-semibold">{t.user}</h3>
              <p className="text-gray-600">{t.text}</p>
              <span className="text-sm text-gray-400 block">Joined {t.joined}</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
