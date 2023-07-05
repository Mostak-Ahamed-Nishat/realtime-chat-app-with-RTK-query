// import Blank from "./Blank";
import { useGetMessagesQuery } from "../../../features/messages/messagesApi";
import Error from "../../ui/Error";
import ChatHead from "./ChatHead";
import Messages from "./Messages";
import Options from "./Options";
import { useParams } from "react-router-dom";

export default function ChatBody() {
  //get the id from url otherwise it will vanish when reloading
  const { id } = useParams();
  const { data: messages, isLoading, isError, error } = useGetMessagesQuery(id);

  //decide what to render
  let content = null;

  if (isLoading) {
    content = <div>Loading Messages...</div>;
  } else if (!isLoading && isError) {
    content = <Error message={error?.data} />;
  } else if (!isLoading && !isError && messages.length === 0) {
    content = <div className="m-2 text-center">Start your conversations</div>;
  } else if (!isLoading && !isError && messages.length > 0) {
    // eslint-disable-next-line no-unused-vars
    content = (
      <>
        <ChatHead messages={messages[0]} />
        <Messages messages={messages} />
        <Options />
      </>
    );
  }

  return (
    <div className="w-full lg:col-span-2 lg:block">
      <div className="w-full grid conversation-row-grid">{content}</div>
    </div>
  );
}

{
  /* <ChatHead
          avatar="https://cdn.pixabay.com/photo/2018/01/15/07/51/woman-3083383__340.jpg"
          name="Akash Ahmed"
        />
        <Messages />
        <Options /> */
}
