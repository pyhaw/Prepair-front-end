import { useRouter } from "next/navigation";
import Image from "next/image";

export default function UserCard({ user, selected, currentUserId, onClick }) {
  const router = useRouter();
  const statusColors = {
    online: "bg-green-500",
    away: "bg-yellow-500",
    offline: "bg-gray-500",
  };

  const statusOptions = ["online", "away", "offline"];
  const status = statusOptions[Math.floor(Math.random() * statusOptions.length)];

  const handleClick = () => {
    onClick(user);
    router.push(`/chatPage?me=${currentUserId}&partner=${user.id}`);
  };

  const isValidUrl =
    typeof user.avatar === "string" &&
    (user.avatar.startsWith("http://") || user.avatar.startsWith("https://"));

  return (
    <div
      onClick={handleClick}
      className={`flex items-center p-4 cursor-pointer transition ${
        selected ? "bg-orange-200" : "hover:bg-orange-600 border-t border-gray-200"
      }`}
    >
      <div className="relative mr-3">
        {isValidUrl ? (
          <Image
            src={user.avatar}
            alt="Profile"
            width={48}
            height={48}
            className="rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 flex items-center justify-center bg-orange-600 text-white rounded-full text-xl font-semibold">
            {user.name.charAt(0)}
          </div>
        )}
        <span
          className={`absolute bottom-0 right-0 w-3 h-3 ${statusColors[status]} rounded-full border-2 border-orange-600`}
        ></span>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between">
          <h3 className="font-medium truncate text-black">{user.name}</h3>
          <span className="text-xs text-gray-700">
            {user.lastActive
              ? new Date(user.lastActive).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : ""}
          </span>
        </div>
        <p className="truncate text-sm text-gray-700">{user.lastMessage}</p>
      </div>
    </div>
  );
}
