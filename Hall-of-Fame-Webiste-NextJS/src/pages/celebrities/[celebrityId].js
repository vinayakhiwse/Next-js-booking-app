import Ratings from "@/components/common/Ratings";
import CelebrityServiceTabPanelView from "@/views/TabsPanels/CelebrityServiceTabPanelView";
import React, { useEffect, useState } from "react";
import { Tab, Nav } from "react-bootstrap";
import CelebrityReviewTabPanelView from "@/views/TabsPanels/CelebrityReviewTabPanelView";
import { useRouter } from "next/router";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import moment from "moment";
import useTranslation from "@/hooks/useTranslation";
import { Rings } from "react-loader-spinner";
import { useSelector } from "react-redux";

const CelebrityDetail = () => {
  const [activeTab, setActiveTab] = useState("servicetab");
  const [celebrityDetail, setCelebrityDetail] = useState({});
  const [CelebrityService, setCelebrityService] = useState([]);
  const [CelebrityRating, setCelebrityRating] = useState([]);
  const [loading, setLoading] = useState(false);
  const { AuthId } = useSelector((state) => state.AuthData);
  const {
    query: { celebrityId },
    push,
  } = useRouter();

  const { t } = useTranslation();

  const FetchCelebrityDetail = async () => {
    try {
      const docRef = doc(db, "User", celebrityId);
      const unsubscribe = onSnapshot(docRef, (querySnapshot) => {
        if (querySnapshot.exists()) {
          setCelebrityDetail(querySnapshot.data());
        } else {
          console.log("No such document!");
        }
      });
      return unsubscribe;
    } catch (error) {
      console.log(error);
    }
  };

  const FetchCelebrityServiceDetail = async () => {
    try {
      const docRef = doc(db, "User", celebrityId);
      setLoading(true);
      const querySnapshot = await getDocs(
        query(collection(db, "Service"), where("celebrity_user", "==", docRef))
      );
      querySnapshot.docs.map(async (doc) => {
        try {
          const docData = doc.data();
          if (docData.celebrity_user) {
            docData.celebrity_user = (
              await getDoc(docData.celebrity_user)
            ).data();
          }
          setCelebrityService((prev) => [
            ...prev,
            {
              id: doc.id,
              name: docData?.name,
              name_ar: docData?.name_ar,
              display_name: docData?.celebrity_user.display_name,
              price: docData?.price,
              image: docData?.image,
              discount: docData?.discount,
            },
          ]);
        } catch (error) {
          console.log(error);
        }
      });
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const FetchCelebrityRatingDetail = () => {
    try {
      const docReference = collection(db, "User", celebrityId, "Review");
      onSnapshot(docReference, (reviewSnapshot) => {
        const ReviewArray = [];
        reviewSnapshot.docs.map(async (doc) => {
          const docData = doc.data();
          if (docData.user) {
            docData.user = (await getDoc(docData.user)).data();
          }

          ReviewArray.push({
            ...docData,
            notes: docData?.notes,
            review: docData?.review,
            display_name: docData?.user?.display_name,
            photo_url: docData?.user?.photo_url,
            time: moment.unix(docData?.time?.seconds).fromNow(),
          });
        });
        setCelebrityRating(ReviewArray);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreateChat = async () => {
    try {
      const newChat = doc(collection(db, "chats"));
      await setDoc(newChat, {
        last_message: "",
        last_message_seen_by: [doc(db, "User", AuthId)],
        last_message_sent_by: doc(db, "User", AuthId),
        last_message_time: serverTimestamp(),
        user_a: doc(db, "User", AuthId),
        user_b: doc(db, "User", celebrityId),
        users: [doc(db, "User", AuthId), doc(db, "User", celebrityId)],
      });
      setTimeout(() => {
        push("/dashboard/conversation");
      }, [500]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (celebrityId) {
      FetchCelebrityDetail();
      FetchCelebrityServiceDetail();
      FetchCelebrityRatingDetail();
    }
  }, []);

  return (
    <>
      {loading ? (
        <Rings
          height="120"
          width="120"
          color="#C2C0D5"
          radius="6"
          wrapperStyle={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          wrapperClass=""
          visible={loading}
          ariaLabel="rings-loading"
        />
      ) : (
        <>
          <section className="sec-m-tb">
            <div className="container">
              <div className="row">
                <div className="col-lg-12">
                  <div className="celebrity-detail-cont">
                    <div className="celebrity-serv">
                      <div className="details-img">
                        <img
                          src={celebrityDetail.photo_url}
                          className="celebrity-img"
                          alt="service"
                        />
                      </div>

                      <div className="celeb-serv-det w-100">
                        <div className="name-msg">
                          <div className="right-name">
                            <h2>{celebrityDetail.display_name} </h2>
                          </div>
                          {AuthId ? (
                            <div className="filters-btn">
                              <button
                                onClick={handleCreateChat}
                                className="btn btn-primary w-100"
                                tabIndex="0"
                              >
                                {t("Message Now")}
                              </button>
                            </div>
                          ) : null}
                        </div>

                        <Ratings
                          total={
                            celebrityDetail.review ? celebrityDetail.review : 0
                          }
                        />
                        <div className="contct">
                          <i className="fas fa-phone-alt f-icon "></i>
                          <p>
                            {t("Phone")}:
                            <a className="fixed" href="tel:+911234567890">
                              {celebrityDetail.phone_number}
                            </a>
                          </p>
                        </div>
                        <div className="contct">
                          <i className="fas fa-envelope f-icon"></i>
                          <p>
                            {t("Email")}:
                            <a href="mailto:ev.empiric@gmail.com">
                              {celebrityDetail.email}
                            </a>
                          </p>
                        </div>
                        {celebrityDetail.address ? (
                          <div className="contct">
                            <i className="fas fa-map-marker-alt f-icon"></i>
                            <p>
                              {t("Address")}: {celebrityDetail.address}
                            </p>
                          </div>
                        ) : null}

                        <div className="about">
                          <h3>
                            {celebrityDetail.About ? `${t("About")}` : ""}
                          </h3>
                          <p>
                            {celebrityDetail.About
                              ? celebrityDetail?.About
                              : ""}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="celeb-detail-tabs">
                      <div className="order-page-tabs">
                        <Tab.Container
                          activeKey={activeTab}
                          onSelect={(key) => setActiveTab(key)}
                        >
                          <Nav
                            className="nav-pills mb-5"
                            id="pills-tab"
                            role="tablist"
                          >
                            <Nav.Item className="custom-tab">
                              <Nav.Link
                                eventKey="servicetab"
                                className={
                                  activeTab === "servicetab"
                                    ? "nav-link active"
                                    : "nav-link"
                                }
                              >
                                {t("Services")}
                              </Nav.Link>
                            </Nav.Item>
                            <Nav.Item className="custom-tab">
                              <Nav.Link
                                eventKey="rating"
                                className={
                                  activeTab === "rating"
                                    ? "nav-link active"
                                    : "nav-link"
                                }
                              >
                                {t("Ratings")}
                              </Nav.Link>
                            </Nav.Item>
                          </Nav>
                          <Tab.Content>
                            <Tab.Pane eventKey="servicetab">
                              {CelebrityService &&
                                CelebrityService.map((val) => (
                                  <CelebrityServiceTabPanelView
                                    CelebrityServiceItem={val}
                                  />
                                ))}
                              {CelebrityService?.length === 0 && (
                                <div className="alert alert-danger">
                                  {t("No record found")}
                                </div>
                              )}
                              {/* Pagination */}
                            </Tab.Pane>
                            <Tab.Pane eventKey="rating">
                              <CelebrityReviewTabPanelView
                                CelebrityRatingItem={CelebrityRating}
                                celebrityId={celebrityId}
                                total_review={celebrityDetail?.total_review}
                                ReviewAvg={celebrityDetail?.review}
                              />
                            </Tab.Pane>
                          </Tab.Content>
                        </Tab.Container>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
};

export default CelebrityDetail;
