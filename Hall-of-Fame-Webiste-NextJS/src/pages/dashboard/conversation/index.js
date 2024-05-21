import DashboardLayout from "@/components/layouts/DashboardLayout";
import { db } from "@/config/firebaseConfig";
import useTranslation from "@/hooks/useTranslation";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { useSelector } from "react-redux";

const Conversation = () => {
  const { t } = useTranslation();
  const [ChatInput, setChatInput] = useState("");
  const [SupplierList, setSupplierList] = useState([]);
  const [Messages, setMessages] = useState([]);
  const { AuthId } = useSelector((state) => state.AuthData);
  const [currentUser, setCurrentUser] = useState(null);
  const chatContainerRef = useRef(null);
  const [chatId, setChatId] = useState("");

  const FetchChatData = async () => {
    const userRef = doc(db, "User", AuthId);
    const querySnapshot = await getDocs(
      query(collection(db, "chats"), where("user_a", "==", userRef))
    );
    querySnapshot.docs.map(async (doc) => {
      const docData = doc.data();
      if (docData.user_b) {
        docData.user_b = (await getDoc(docData.user_b)).data();
      }
      setSupplierList((prev) => [
        ...prev,
        {
          id: doc.id,
          uid: docData?.user_b?.uid,
          display_name: docData?.user_b?.display_name,
          photo_url: docData?.user_b?.photo_url,
          last_message_time: moment
            .unix(docData?.last_message_time.seconds)
            .fromNow(),
        },
      ]);
    });
  };

  useEffect(() => {
    FetchChatData();
  }, []);

  const handleChat = (ChatID) => {
    setChatId(ChatID);
    const ChatRef = doc(db, "chats", ChatID);
    const QueryMessages = query(
      collection(db, "chat_messages"),
      where("chat", "==", ChatRef),
      orderBy("timestamp")
    );
    const unsubscribe = onSnapshot(QueryMessages, (snapshot) => {
      let Msg = [];
      snapshot.docs.map(async (doc) => {
        const docData = doc.data();
        Msg.push({
          id: doc.id,
          uid: docData?.user?.id,
          message: docData?.text,
          time: moment.unix(docData?.timestamp?.seconds).fromNow(),
        });
      });
      setMessages(Msg);
    });
    return () => unsubscribe();
  };

  const handleSendMessages = async () => {
    if (ChatInput.trim() === "") {
      return;
    } else {
      const userRef = doc(db, "User", AuthId);
      const chatDocRef = doc(db, "chats", chatId);
      const messageData = {
        text: ChatInput,
        timestamp: serverTimestamp(),
        user: userRef,
        chat: chatDocRef,
      };
      try {
        await addDoc(collection(db, "chat_messages"), messageData);
        setChatInput("");
        chatContainerRef.current.scrollTop =
          chatContainerRef.current.scrollHeight;
      } catch (error) {
        console.error("Error sending message: ", error);
      }
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && ChatInput.trim() !== "") {
      handleSendMessages();
    }
  };

  const findObjectById = (ChatID) => {
    const foundSupplier = SupplierList.find(
      (supplier) => supplier.id === ChatID
    );

    if (foundSupplier) {
      setCurrentUser(foundSupplier);
    } else {
      setCurrentUser(null);
    }
  };

  useEffect(() => {
    findObjectById(chatId);
  }, [chatId]);

  return (
    <div className="row mx-0">
      <div className="col-md-12 mt-3 mt-md-0 px-0">
        <div className="message-content d-lg-flex">
          <div className="w-43">
            <div className="contacts d-lg-block">
              {/* {conversations.length > 0 ? ( */}
              <div className="contacts-area">
                <div className="chat-clear-inline">
                  <h2 className="tittle-name">{t("Messages")}</h2>
                  <span variant="link" className="clear-tittle">
                    {t("Clear All")}
                  </span>
                </div>
                <div className="messengers">
                  {SupplierList &&
                    SupplierList?.map((chat) => (
                      <div
                        className={`contact-item d-block active`}
                        onClick={() => handleChat(chat.id)}
                        key={chat.id}
                      >
                        <div className="media d-flex align-items-center">
                          <div className="image-mt">
                            <div className="image">
                              <img
                                className="img-fluid"
                                src={chat.photo_url}
                                alt="Profile"
                              />
                            </div>
                          </div>
                          <div className="media-body">
                            <div className="d-flex w-100 justify-content-between">
                              <div className="left-side">
                                <h6 className="mb-0">{chat.display_name}</h6>
                              </div>
                              <div className="right-side">
                                <a>
                                  <div className="circle-cross-chat">
                                    <i className="fa fa-times"></i>
                                  </div>
                                </a>
                                <small className="time">
                                  {chat.last_message_time}
                                </small>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
              {/* ) : (
                showConversation && (
                  <div className="w-100">
                    <div>No Conversations</div>
                  </div>
                )
              )} */}
            </div>
          </div>

          <div className="messages font-dosis font-16 hdn w-100">
            <div className="messages-content">
              <div
                className={`${
                  Messages.length === 0
                    ? "d-flex justify-content-center align-items-center"
                    : ""
                } messages-area`}
                ref={chatContainerRef}
              >
                {Messages.map((message) => (
                  <div>
                    <div
                      className={`${
                        message.uid === AuthId ? "msg-2" : "msg-3"
                      } mb-1`}
                      key={message.id}
                    >
                      {/* <a data-lightbox="trade-photo">
                        <img className="img-fluid" alt="" />
                      </a> */}
                      <p>{message.message}</p>
                      <p className="time">{message?.time}</p>
                    </div>
                    <div className="clearfix"></div>
                  </div>
                ))}
                {Messages.length === 0 && (
                  <div className="messages-area">
                    <p className="start-chat">{t("Start chatting now!")}</p>
                  </div>
                )}
              </div>

              <div className="msg-form d-flex align-items-center">
                {/* <div className="input-file">
                  <input
                    type="file"
                    name="input-file-preview"
                    accept="image/*"
                  />
                  <img src="/assets/pin.png" alt="Upload" />
                </div> */}
                <div className="position-relative msg-form-mt w-100">
                  <textarea
                    rows="2"
                    cols="30"
                    name="content"
                    className="form-control p-1"
                    placeholder={t("Write message...")}
                    value={ChatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                </div>
                <button
                  className="btn btn-primary border-0 right-white"
                  type="button"
                  onClick={handleSendMessages}
                >
                  <FaArrowRight fontSize={20} />
                </button>
              </div>
              {currentUser && (
                <div className="top-info">
                  <div className="product-info d-flex align-items-center">
                    <div className="body w-100">
                      <div className="product-info-chat-2nd d-flex align-items-center justify-content-between">
                        <div className="image-mt">
                          <div className="image">
                            <img
                              className="img-fluid"
                              src={currentUser?.photo_url}
                              alt="Profile"
                            />
                          </div>
                        </div>
                        <div className="media-body">
                          <div className="d-flex w-100 justify-content-between">
                            <div className="left-side">
                              <h6 className="text-truncate mb-0">
                                {currentUser?.display_name}
                              </h6>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ConversationPage = () => (
  <DashboardLayout>
    <Conversation />
  </DashboardLayout>
);

export default ConversationPage;
