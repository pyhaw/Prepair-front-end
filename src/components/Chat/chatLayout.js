// components/Chat/chatLayout.js
import ChatBar from "./chatBar";
import ChatSidebar from "./chatSidebar";
import ChatRoom from "./chatRoom";

export default function ChatLayout({ userId, selectedUser, setSelectedUser }) {
  return (
    <div className="flex pt-[105px] min-h-screen bg-white text-black">
      {/* Sidebar */}
      <div className="w-80 border-r border-gray-200 flex flex-col">
        {/* ❌ Removed ChatSidebarHeader here */}
        <ChatBar currentUserId={userId} setSelectedUser={setSelectedUser} />
        <ChatSidebar
          currentUserId={userId}
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
        />
      </div>

      {/* Chat Room */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <ChatRoom
            currentUserId={userId}
            targetUserId={selectedUser.id}
            username={selectedUser.name}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-white text-gray-500">
            <div className="text-5xl mb-4 text-orange-400">💬</div>
            <h2 className="text-xl font-medium mb-2">
              Select a conversation
            </h2>
            <p className="text-sm text-gray-600">
              Choose an existing chat or start a new one
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
