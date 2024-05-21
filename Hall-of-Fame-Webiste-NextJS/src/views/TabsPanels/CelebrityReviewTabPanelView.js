import Ratings from "@/components/common/Ratings";
import React, { useEffect, useState } from "react";
import Rating from "react-rating";
import { AiOutlineStar, AiTwotoneStar } from "react-icons/ai";
import { useSelector } from "react-redux";
import {
  collection,
  doc,
  getCountFromServer,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import { toast } from "react-toastify";
import { toastConfig } from "@/utils/toast.utils";
import CustomToastContainer from "@/components/common/CustomToastContainer";
import useTranslation from "@/hooks/useTranslation";

const CelebrityReviewTabPanelView = ({
  CelebrityRatingItem,
  celebrityId,
  total_review,
  ReviewAvg,
}) => {
  const [UserDetail, setUserDetail] = useState({});
  const [addReview, setAddReview] = useState("");
  const [rating, setRating] = useState(0);
  const [Error, setError] = useState("");
  const { AuthId } = useSelector((state) => state.AuthData);
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const FetchLoginUser = async () => {
    const docRef = doc(db, "User", AuthId);
    try {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserDetail(docSnap.data());
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.log("error of user fetching".error);
    }
  };

  // Add a new document with a generated id
  const handleSubmit = async () => {
    if (addReview.trim() == "") {
      setError("Review comment is required");
    } else {
      const collectionRef = collection(db, "User", celebrityId, "Review");
      const newReview = doc(collectionRef);
      try {
        setLoading(true);
        setDoc(newReview, {
          review: rating,
          notes: addReview,
          time: serverTimestamp(),
          user: doc(db, "User", AuthId),
          celebrity: doc(db, "User", celebrityId),
        }).then(async () => {
          const count = await getCountFromServer(collectionRef);
          const data = await getDocs(collectionRef);
          let totalAvg = 0;
          data.docs.map(async (doc) => {
            totalAvg += doc.data().review;
          });
          const AvgRef = doc(db, "User", celebrityId);
          await updateDoc(AvgRef, {
            total_review: count.data().count,
            review: Number((totalAvg / count.data().count).toFixed(1)),
          });
        });
        toast.success(`${t("Review Posted Successfully")}`);
      } catch (error) {
        toast.error(`${t("Failed to post review")}`);
      }
      setAddReview("");
      setRating(0);
      setError("");
    }
  };

  const handleRatingChange = (value) => {
    setRating(value);
  };
  const handleReviewChange = (e) => {
    setAddReview(e.target.value);
    setError("");
  };

  useEffect(() => {
    if (AuthId) {
      FetchLoginUser();
    }
  }, [CelebrityRatingItem]);



  return (
    <>
      {AuthId && (
        <>
          <div className="blog-comments">
            <h3 className="top-rat">
              {t("Ratings & Reviews")}
              <div className="ratings">
                <p>({total_review ? total_review : 0})</p>
                <Ratings total={ReviewAvg ? ReviewAvg : 0} />
              </div>
            </h3>
            <div className="user-name">
              <img
                src={
                  UserDetail?.photo_url
                    ? UserDetail?.photo_url
                    : "https://img.freepik.com/free-icon/user_318-159711.jpg"
                }
                alt="brandy-img"
              />
              <h3>
                {UserDetail?.display_name}
                <br />
                <Rating
                  initialRating={rating}
                  emptySymbol={<AiOutlineStar fontSize={20} fill="#cccccc" />}
                  fullSymbol={<AiTwotoneStar fontSize={20} fill="#ffc400" />}
                  fractions={2}
                  onChange={handleRatingChange}
                />
              </h3>
            </div>
            <div className="add-comment">
              <div className="input-style comment-container">
                <input
                  type="text"
                  placeholder={t("Your Review")}
                  className="ctm-input"
                  value={addReview}
                  onChange={handleReviewChange}
                />
                {Error && <div className="alert alert-danger">{Error}</div>}
              </div>
              <button
                type="button"
                tabIndex="0"
                className="btn btn-primary add-comment-btn"
                onClick={handleSubmit}
                disabled={loading}
              >
                {t("Add")}
              </button>
            </div>
          </div>{" "}
        </>
      )}

      {CelebrityRatingItem?.map((el, i) => (
        <div className="review-list-box mb-2" key={i}>
          <div className="ratings d-flex align-items-center">
            <div className="review-img">
              <img
                src={
                  el?.user?.photo_url
                    ? el?.user?.photo_url
                    : "https://img.freepik.com/free-icon/user_318-159711.jpg"
                }
                alt="img-fluid"
                className="img-fluid"
              />
            </div>
            <div className="review-detail-box w-100">
              <div className="d-flex align-items-center justify-content-between">
                <div className="title">
                  {el?.user?.display_name}
                  <br />
                  <Ratings total={el?.review} />
                </div>
                <div className="reviw-time">{el?.time}</div>
              </div>
            </div>
          </div>
          <div className="des clearfix">{el?.notes}</div>
        </div>
      ))}
      <CustomToastContainer />
    </>
  );
};

export default CelebrityReviewTabPanelView;
