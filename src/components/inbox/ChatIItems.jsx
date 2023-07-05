import { useSelector } from "react-redux";
import ChatItem from "./ChatItem";
import { useGetConversationsQuery } from "../../features/conversations/conversationsApi";
import Error from "../ui/Error";
import moment from "moment";

export default function ChatItems() {
  const { user } = useSelector((state) => state.auth) || {};
  const { email } = user;

  const {
    data: conversations,
    isLoading,
    isError,
    error,
  } = useGetConversationsQuery(email);

  //decide what to render
  let content = null;

  if (isLoading) {
    content = <li className="m-2 text-center">Loading....</li>;
  } else if (!isLoading && isError) {
    content = <Error message={error} />;
  } else if (!isLoading && !isError && conversations.length === 0) {
    content = <li className="m-2 text-center">No Conversation Yet</li>;
  } else if (!isLoading && !isError && conversations.length > 0) {
    content = conversations.map((conversation) => {
      const { id, message, timestamp } = conversation;
      return (
        <li key={id}>
          <ChatItem
            avatar="https://cdn.pixabay.com/photo/2018/09/12/12/14/man-3672010__340.jpg"
            name="Rahim"
            lastMessage={message}
            lastTime={moment(timestamp).fromNow()}
          />
        </li>
      );
    });
  }

  return (
    <ul>
      {content}
    </ul>
  );
}
