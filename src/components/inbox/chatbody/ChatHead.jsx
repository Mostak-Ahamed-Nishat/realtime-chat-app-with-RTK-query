import { useSelector } from "react-redux";
import gravatarUrl from "gravatar-url";

export default function ChatHead({ messages }) {
  const { user } = useSelector((state) => state.auth);
  const { sender, receiver } = messages;
  const loggedInUserEmail = user.email;

  const partnerName =
    loggedInUserEmail !== sender.email ? sender.name : receiver.name;
  const partnerEmail =
    loggedInUserEmail !== sender.email ? sender.email : receiver.email;

  return (
    <div className="relative flex items-center p-3 border-b border-gray-300">
      <img
        className="object-cover w-10 h-10 rounded-full"
        src={gravatarUrl(partnerEmail, {
          size: 80,
        })}
        alt={partnerName}
      />
      <span className="block ml-2 font-bold text-gray-600">{partnerName}</span>
    </div>
  );
}
