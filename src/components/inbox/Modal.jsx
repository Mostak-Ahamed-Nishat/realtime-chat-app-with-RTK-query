import { useEffect, useState } from "react";
import isValidateEmail from "../../utils/isValidEmail";
import {
  conversationsApi,
  useAddConversationMutation,
  useEditConversationMutation,
} from "../../features/conversations/conversationsApi";
import { useGetUserQuery } from "../../features/users/usersSlice";
import Error from "../ui/Error";
import { useDispatch, useSelector } from "react-redux";

export default function Modal({ open, control }) {
  const [to, setTo] = useState("");
  const [message, setMessage] = useState("");
  const [userCheck, setUserCheck] = useState(false);
  const [conversation, setConversation] = useState(undefined);
  const [responseError, setResponseError] = useState("");

  //get own properties

  const { user: loggedInUser } = useSelector((state) => state.auth) || {};
  const { email: myEmail } = loggedInUser || {};

  const [addConversation, { isSuccess: isAddConversationSuccess }] =
    useAddConversationMutation();
  const [editConversation, { isSuccess: isEditConversationSuccess }] =
    useEditConversationMutation();

  //Dispatch
  const dispatch = useDispatch();

  //get user is in the db or not
  //in the component load useGetUserQuery will call at that time we don't have any email so after email verification we have to call this
  const {
    data: participant,
    isLoading,
    isError,
    error,
  } = useGetUserQuery(to, {
    skip: !userCheck,
  });

  //As used skip so it stopped the request we will get the result on next state through useEffect
  useEffect(() => {
    if (participant?.length > 0 && participant[0].email !== myEmail) {
      //Check conversation existence
      //another way to hit the api like useGetUserQuery we can get it through useEffect and dispatch
      dispatch(
        conversationsApi.endpoints.getConversation.initiate({
          userEmail: myEmail,
          participantEmail: to,
        })
      )
        .unwrap()
        .then((data) => {
          setConversation(data);
        })
        .catch((error) => setResponseError(error));
    }
  }, [dispatch, myEmail, participant, to]);

  //handle debounce
  const debounce = (cb, delay = 0) => {
    let timeOutId;
    return (...args) => {
      clearTimeout(timeOutId);
      timeOutId = setTimeout(() => {
        cb(...args);
      }, delay);
    };
  };

  const checkEmail = (value) => {
    console.log("Calling checkEmail");
    setTo(value);
    if (isValidateEmail(value)) {
      setUserCheck(true);
    }
  };

  const handleSearch = debounce(checkEmail, 50);

  //On Submit check if there already exists conversation add to the conversation or create a new conversation
  const submitHandler = (e) => {
    e.preventDefault();
    if (conversation?.length > 0) {
      //Edit conversation
      editConversation({
        id: conversation[0]?.id,
        sender:myEmail,
        data: {
          participants: `${participant[0]?.email}-${myEmail}`,
          users: [loggedInUser, participant[0]],
          message,
          timestamp: new Date().getTime(),
        },
      });
    } else if (conversation?.length === 0) {
      //Add new conversation
      addConversation({
        sender:myEmail,
        data: {
          participants: `${participant[0]?.email}-${myEmail}`,
          users: [loggedInUser, participant[0]],
          message,
          timestamp: new Date().getTime(),
        },
      });
    }
  };

  //Close modal if conversation add or edit

  useEffect(() => {
    control();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAddConversationSuccess, isEditConversationSuccess]);

  return (
    open && (
      <>
        <div
          onClick={control}
          className="fixed w-full h-full inset-0 z-10 bg-black/50 cursor-pointer"
        ></div>
        <div className="rounded w-[400px] lg:w-[600px] space-y-8 bg-white p-10 absolute top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Send message
          </h2>
          <form className="mt-8 space-y-6" onSubmit={(e) => submitHandler(e)}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="to" className="sr-only">
                  To
                </label>
                <input
                  id="to"
                  name="to"
                  type="email"
                  value={to}
                  onChange={(e) => {
                    handleSearch(e.target.value);
                  }}
                  //   setTo(e.target.value)
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 sm:text-sm"
                  placeholder="Send to"
                />
              </div>
              <div>
                <label htmlFor="message" className="sr-only">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  type="message"
                  value={message}
                  required
                  onChange={(e) => setMessage(e.target.value)}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 sm:text-sm"
                  placeholder="Message"
                />
              </div>
            </div>

            <div>
              <button
                disabled={
                  conversation === undefined || participant[0].email === myEmail
                }
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
              >
                Send Message
              </button>
            </div>
            {participant?.length === 0 && (
              <Error message="User does not exits" />
            )}

            {/* if user try to send message own */}
            {participant?.length > 0 && participant[0].email === myEmail && (
              <Error message="You can't send message to yourself" />
            )}
          </form>
        </div>
      </>
    )
  );
}
