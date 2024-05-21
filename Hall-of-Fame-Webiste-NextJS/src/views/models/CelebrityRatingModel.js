import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { AiOutlineStar, AiTwotoneStar } from "react-icons/ai";
import Rating from "react-rating";
import { CgCloseO } from "react-icons/cg";
import { collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import { toast } from "react-toastify";
import { toastConfig } from "@/utils/toast.utils";
import CustomToastContainer from "@/components/common/CustomToastContainer";
import useTranslation from "@/hooks/useTranslation";

const CelebrityRatingModel = ({ setRatingModel, RatingModel, celebrityId }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState(null);
  const { t } = useTranslation();
  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const handleReviewRatingSubmit = (e) => {
    e.preventDefault();
    const newRatingReviewRef = doc(
      collection(db, "User", celebrityId, "Review")
    );

    setDoc(newRatingReviewRef, {
      review: rating,
      notes: review,
      time: serverTimestamp(),
      user: doc(db, "User", "KzBXmBVa7RSnyCGqkY2wuaL3Oqf1"),
    }).then(() => {
      toast.success(`${t("Review Posted Successfully")}`, toastConfig.success);
    });
  };

  return (
    <>
      <Modal show={RatingModel} centered>
        <h2
          style={{
            fontSize: "30px",
            color: "#575757",
            fontWeight: "600",
          }}
          className="d-flex justify-content-between align-items-center"
        >
          {t("Review Rating")}
          <CgCloseO onClick={() => setRatingModel(false)} />
        </h2>
        <form
          className="d-flex flex-column gap-4 text-center mt-2"
          onSubmit={handleReviewRatingSubmit}
        >
          <Rating
            initialRating={rating}
            emptySymbol={<AiOutlineStar fontSize={27} fill="#cccccc" />}
            fullSymbol={<AiTwotoneStar fontSize={27} fill="#ffc400" />}
            fractions={2}
            onChange={handleRatingChange}
          />
          <div className="add-comment">
            <div className="input-style comment-container">
              <input
                type="text"
                placeholder={t("Your Review")}
                className="ctm-input"
                value={review}
                onChange={(e) => setReview(e.target.value)}
              />
            </div>
          </div>
          <Button type="submit" className="btn btn-primary add-comment-btn">
            {t("Submit")}
          </Button>
        </form>
      </Modal>
      <CustomToastContainer />
    </>
  );
};

export default CelebrityRatingModel;
