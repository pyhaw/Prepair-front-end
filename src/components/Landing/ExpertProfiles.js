"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const experts = [
  {
    name: "Zackeus",
    role: "Electrician",
    image: "/placeholder-avatar.png",
    skills: "Wiring, diagnostics",
    rating: "⭐ 4.9",
  },
  {
    name: "Sean",
    role: "Plumber",
    image: "/placeholder-avatar.png",
    skills: "Pipes, leaks, toilet fix",
    rating: "⭐ 4.8",
  },
];

export default function ExpertProfiles() {
  return (
    <section className="py-16 px-4 bg-white">
      <h2 className="text-3xl font-semibold text-center mb-10 text-orange-600">
        Repair Experts At Your Service
      </h2>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {experts.map((expert, idx) => (
          <Card key={idx} className="hover:shadow-md transition">
            <CardHeader className="flex items-center space-x-4">
              <Avatar className="w-14 h-14">
                <AvatarImage src={expert.image} alt={expert.name} />
                <AvatarFallback>{expert.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">{expert.name}</CardTitle>
                <p className="text-sm text-gray-500">{expert.role}</p>
              </div>
            </CardHeader>
            <CardContent className="text-sm text-gray-700">
              <p><strong>Skills:</strong> {expert.skills}</p>
              <p><strong>Rating:</strong> {expert.rating}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
