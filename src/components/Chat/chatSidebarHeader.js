// components/Chat/ChatSidebarHeader.jsx
export default function ChatSidebarHeader({ username, userId }) {
    return (
      <div className="p-4 border-b border-gray-200 bg-orange-100">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center mr-3">
            {username.charAt(0)}
          </div>
          <div>
            <h3 className="font-medium">{username}</h3>
            <p className="text-xs text-gray-600">ID: {userId}</p>
          </div>
        </div>
      </div>
    );
  }
  