import CustomToastContainer from "@/components/common/CustomToastContainer";
import { db } from "@/config/firebaseConfig";
import useTranslation from "@/hooks/useTranslation";
import {
  collection,
  doc,
  getCountFromServer,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { ThreeDots } from "react-loader-spinner";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const ArticleDetail = () => {
  const {
    query: { articleId },
    push,
    locale,
  } = useRouter();
  const { articles } = useSelector((state) => state.SiteData);
  const [articleDetail, setArticleDetail] = useState(null);
  const [ArticalUser, setArticleUser] = useState(null);
  const [ArticleComment, setArticleComment] = useState([]);
  const [comment, setComment] = useState(null);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const { AuthId } = useSelector((state) => state.AuthData);
  const FetchLoginUser = async () => {
    try {
      const docRef = doc(db, "User", AuthId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setArticleUser(docSnap.data());
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.log("fetching user detail", error);
    }
  };

  // Add a new document with a generated id
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comment.trim() == "") {
      return;
      ``;
      0;
    } else {
      setLoading(true);
      const newReview = doc(collection(db, "Comments"));
      try {
        setDoc(newReview, {
          articles: doc(db, "Articles", articleId),
          notes: comment,
          time: serverTimestamp(),
          user: doc(db, "User", AuthId),
        }).then(async () => {
          const docRef = doc(db, "Articles", articleId);
          const querySnapshot = query(
            collection(db, "Comments"),
            where("articles", "==", docRef)
          );
          const count = await getCountFromServer(querySnapshot);
          const CommentRef = doc(db, "Articles", articleId);
          await updateDoc(CommentRef, {
            comments: count.data().count,
          });
        });
        setComment("");
        toast.success(`${t("Comment Posted Successfully")}`);
        setLoading(false);
      } catch (error) {
        toast.error(`${t("Failed to post comment")}`);
        setLoading(false);
      }
    }
  };

  const handleComment = (e) => {
    setComment(e.target.value);
  };

  const FetchArticalDetail = async () => {
    const docRef = doc(db, "Articles", articleId);
    const querySnapshot = query(
      collection(db, "Comments"),
      where("articles", "==", docRef)
    );

    onSnapshot(querySnapshot, (Snapshot) => {
      const CommentArray = [];
      Snapshot.docs.map(async (doc) => {
        const docData = doc.data();
        if (docData.user) {
          docData.user = (await getDoc(docData.user)).data();
        }
        CommentArray.push({
          ...docData,
          text: docData?.notes,
          display_name: docData?.user?.display_name,
          photo_url: docData?.user?.photo_url,
          comment_time: moment.unix(docData?.time?.seconds).fromNow(),
        });
        setArticleComment(CommentArray);
      });
    });
  };

  useEffect(() => {
    if (AuthId) {
      FetchLoginUser();
    }
    FetchArticalDetail();
  }, []);

  useEffect(() => {
    if (articles && articleId) {
      const detail = articles.find((element) => element.docid == articleId);
      if (detail) {
        setArticleDetail(detail);
      } else {
        push("/infopages/articles");
      }
    }
  }, [articleId, articles]);

  return (
    <>
      <section className="sec-m-tb">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="blog-detail-container">
                <div className="blog-details">
                  <img
                    src={
                      articleDetail?.image
                        ? articleDetail?.image
                        : "https://img.freepik.com/free-icon/user_318-159711.jpg"
                    }
                    alt="blog-Image"
                  />
                  <div className="details">
                    <h2>
                      {locale == "en"
                        ? articleDetail?.name.en
                        : articleDetail?.name.ar}
                    </h2>
                    <div className="blog-detail">
                      <p>
                        <span className="date">
                          <i className="far fa-calendar-alt"></i>
                          {articleDetail?.date}
                        </span>
                        <span className="comments">
                          <i className="far fa-comment"></i>
                          {ArticleComment?.length} {t("Comments")}
                        </span>
                        <span className="written">
                          <i className="far fa-user"></i>
                          {t("Written by")}
                          {"  "}
                          <span>
                            {locale == "en"
                              ? articleDetail?.authorName.en
                              : articleDetail?.authorName.ar}
                          </span>
                        </span>
                      </p>
                    </div>
                    <div className="div-22">
                      <p className="blog-txt1">
                        {locale == "en"
                          ? articleDetail?.description?.en
                          : articleDetail?.description?.ar}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="blog-comments mt-5">
                  <h3>
                    {" "}
                    {ArticleComment?.length} {t("Comments")}
                  </h3>

                  {/* Add Comment if user id authenticated */}

                  {AuthId && (
                    <>
                      <div className="user-name">
                        <img
                          src={
                            ArticalUser?.photo_url
                              ? ArticalUser?.photo_url
                              : "https://img.freepik.com/free-icon/user_318-159711.jpg"
                          }
                          alt="User Profile"
                        />
                        <h3>{ArticalUser?.display_name}</h3>
                      </div>
                      <form id="comment-form" onSubmit={handleSubmit}>
                        <div className="add-comment">
                          <div className="input-style comment-container">
                            <input
                              type="text"
                              className="ctm-input"
                              placeholder={t("Your Comment")}
                              required
                              name="comment"
                              value={comment}
                              onChange={handleComment}
                            />
                          </div>
                          <button
                            type="submit"
                            className="btn btn-primary add-comment-btn"
                            tabIndex="0"
                            disabled={loading}
                          >
                            {loading ? (
                              <ThreeDots
                                height="80"
                                width="80"
                                radius="9"
                                color="white"
                                ariaLabel="three-dots-loading"
                                wrapperStyle={{}}
                                wrapperClassName=""
                                visible={true}
                              />
                            ) : (
                              `${t("Add")}`
                            )}
                          </button>
                        </div>
                        <div className="comment-error">
                          {/* Error Message */}
                        </div>
                      </form>
                    </>
                  )}
                </div>
                {ArticleComment &&
                  ArticleComment?.map((el, i) => (
                    <div className="review-list-box mb-2" key={i}>
                      <div className="ratings d-flex align-items-center">
                        <div className="review-img">
                          <img
                            src={
                              el?.photo_url
                                ? el?.photo_url
                                : "https://img.freepik.com/free-icon/user_318-159711.jpg"
                            }
                            className="img-fluid"
                            alt="img"
                          />
                        </div>
                        <div className="review-detail-box w-100">
                          <div className="d-flex align-items-center justify-content-between">
                            <div className="title">{el?.display_name}</div>
                            <div className="reviw-time">{el?.comment_time}</div>
                          </div>
                        </div>
                      </div>
                      <div className="des clearfix">{el?.text}</div>
                    </div>
                  ))}
                {ArticleComment?.length === 0 && (
                  <div className="alert alert-danger">
                    {t("No record found")}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      <CustomToastContainer />
    </>
  );
};

export default ArticleDetail;
