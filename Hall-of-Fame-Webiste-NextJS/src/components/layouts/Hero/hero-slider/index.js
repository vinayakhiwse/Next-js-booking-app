import { db } from "@/config/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Marquee from "react-fast-marquee";

const HeroSlider = () => {
  const [CelebrityUrl, setCelebrityUrl] = useState([]);
  const { locale } = useRouter();

  const FetchCelebrityUrl = async () => {
    const querySnapshot = await getDocs(
      query(collection(db, "User"), where("user_types", "==", "Celebrity"))
    );

    const newCelebrityUrl = [];
    let currentObject = null;

    querySnapshot.docs.forEach((doc) => {
      const docData = doc.data();

      if (currentObject === null || currentObject.img.length === 4) {
        // Create a new object when the current one is null or has 4 images
        currentObject = { img: [] };
        newCelebrityUrl.push(currentObject);
      }

      // Add the photo_url to the current object
      if (!currentObject.img.includes(docData?.photo_url)) {
        currentObject.img.push(docData?.photo_url);
      }
    });

    setCelebrityUrl(newCelebrityUrl);
  };

  useEffect(() => {
    FetchCelebrityUrl();
  }, []);

  return (
    <>
      <Marquee
        className="MarqueeCss"
        direction={locale == "en" ? "left" : "right"}
        autoFill
      >
        {CelebrityUrl &&
          CelebrityUrl?.map((el, i) => (
            <div
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
              }}
            >
              <div
                style={
                  locale == "en"
                    ? {
                        width: "50%",
                        marginRight: "1rem",
                      }
                    : {
                        width: "50%",
                        marginLeft: "1rem",
                      }
                }
              >
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "200px",
                    margin: "5rem auto 2rem auto",
                    borderRadius: "30rem 30rem 1rem 1rem",
                  }}
                >
                  <img
                    src={
                      el.img[0]
                        ? el?.img[0]
                        : "https://img.freepik.com/free-icon/user_318-159711.jpg"
                    }
                    style={{
                      width: "100%",
                      height: "200px",
                      borderRadius: "30rem 30rem 1rem 1rem",
                    }}
                  />
                </div>
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "200px",
                    margin: "1rem auto auto auto",
                    borderRadius: "1rem",
                  }}
                >
                  <img
                    src={
                      el.img[1]
                        ? el?.img[1]
                        : "https://img.freepik.com/free-icon/user_318-159711.jpg"
                    }
                    style={{
                      width: "100%",
                      height: "200px",
                      borderRadius: "1rem",
                    }}
                  />
                </div>
              </div>
              <div
                style={
                  locale == "en"
                    ? {
                        width: "50%",
                        marginRight: "2rem",
                      }
                    : {
                        width: "50%",
                        marginLeft: "1rem",
                      }
                }
              >
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "200px",
                    margin: "1rem auto 2rem auto",
                    borderRadius: "1rem",
                  }}
                >
                  <img
                    src={
                      el.img[2]
                        ? el?.img[2]
                        : "https://img.freepik.com/free-icon/user_318-159711.jpg"
                    }
                    style={{
                      width: "100%",
                      height: "200px",
                      borderRadius: "1rem",
                    }}
                  />
                </div>
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "200px",
                    margin: "1rem auto auto auto",
                    borderRadius: "1rem 1rem 30rem 30rem",
                  }}
                >
                  <img
                    src={
                      el.img[3]
                        ? el?.img[3]
                        : "https://img.freepik.com/free-icon/user_318-159711.jpg"
                    }
                    style={{
                      width: "100%",
                      height: "200px",
                      borderRadius: "1rem 1rem 30rem 30rem",
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
      </Marquee>
    </>
  );
};

export default HeroSlider;
