import { useSelector } from "react-redux";
import ChatItem from "./ChatItem";
import { useGetConversationsQuery } from "../../features/conversations/conversationsApi";
import Error from "../ui/Error";
import moment from "moment";
import getPartnerInfo from "../../utils/getPartnerInfo";
import gravatarUrl from "gravatar-url";
import { Link } from "react-router-dom";

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
    content = <Error message={error?.data} />;
  } else if (!isLoading && !isError && conversations.length === 0) {
    content = <li className="m-2 text-center">No Conversation Yet</li>;
  } else if (!isLoading && !isError && conversations.length > 0) {
    content = conversations.map((conversation) => {
      const { id, message, timestamp } = conversation;
      const { name, email: partnerEmail } = getPartnerInfo(
        conversation.users,
        email
      );
      return (
        <li key={id}>
          <Link to={`/inbox/${id}`}>
            <ChatItem
              avatar={gravatarUrl(partnerEmail, {
                size: 80,
              })}
              name={name}
              lastMessage={message}
              lastTime={moment(timestamp).fromNow()}
            />
          </Link>
        </li>
      );
    });
  }

  return <ul>{content}</ul>;
}
