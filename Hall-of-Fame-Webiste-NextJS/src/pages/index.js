import CategoryCard from "@/views/cards/CategoryCard";
import AppDownloadBanner from "@/views/AppDownloadBanner";
import Link from "next/link";
import ServiceCard from "@/views/cards/ServiceCard";
import CelebritiesCard from "@/views/cards/CelebritiesCard";
import Slider from "react-slick";
import { createRef, useEffect, useState } from "react";
import {
  Celebritiessettings,
  Servicessettings,
} from "@/utils/slider_setting.utils";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/config/firebaseConfig";
import useTranslation from "@/hooks/useTranslation";
import { Rings } from "react-loader-spinner";

export default function Home() {
  const CelebritiessliderRef = createRef();
  const ServicesliderRef = createRef();
  const [categoryData, setcategoryData] = useState([]);
  const [ServiceData, setServiceData] = useState([]);
  const [CelebrityData, setCelebrityData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const fetchCategoryData = async () => {
    const querySnapshot = await getDocs(collection(db, "Category"));
    const data = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      docId: doc.id,
    }));
    setcategoryData(data);
  };

  const fetchServiceData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Service"));
      querySnapshot.docs.map(async (doc) => {
        const dataDoc = doc.data();
        if (dataDoc.celebrity_user) {
          dataDoc.celebrity_user = (
            await getDoc(dataDoc?.celebrity_user)
          ).data();
        }
        setServiceData((prev) => [
          ...prev,
          {
            docId: doc.id,
            price: dataDoc?.price,
            name: dataDoc?.name,
            discount: dataDoc?.discount,
            name_ar: dataDoc?.name_ar,
            display_name: dataDoc?.celebrity_user?.display_name,
            image: dataDoc?.image,
          },
        ]);
      });
    } catch (error) {
      console.log("Fetching service detail", error);
    }
  };

  const fetchCelebrityData = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(
        query(collection(db, "User"), where("user_types", "==", "Celebrity"))
      );
      querySnapshot.docs.map(async (doc) => {
        const docData = doc.data();

        if (docData.city) {
          docData.city = (await getDoc(docData.city)).data();
        }
        if (docData.category) {
          docData.category = (await getDoc(docData.category)).data();
        }
        setCelebrityData((prev) => [
          ...prev,
          {
            id: doc.id,
            city: docData?.city,
            category: docData?.category,
            display_name: docData?.display_name,
            last_name: docData?.last_name,
            photo_url: docData?.photo_url,
            review: docData?.review,
          },
        ]);
        setLoading(false);
      });
    } catch (error) {
      console.log("fetching celebrity details", error);
    }
  };

  useEffect(() => {
    fetchCategoryData();
    fetchServiceData();
    fetchCelebrityData();
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
          <section className="category sec-m-tb  content-data">
            <div className="container px-0 mx-auto">
              <div className="row mx-auto justify-content-center">
                <div className="col-lg-12 px-0">
                  <p className="custom-title text-center">
                    {t("Select the category you are booking for")}
                  </p>
                </div>
                {categoryData.slice(0, 4).map((val, i) => (
                  <div className="col-lg-3 col-md-6" key={i}>
                    <CategoryCard categoryItem={val} />
                  </div>
                ))}
                <div className="col-lg-12">
                  <Link href="/categories" className="btn btn-primary">
                    {t("view all")}
                  </Link>
                </div>
              </div>
            </div>
          </section>
          <section className="bookings pt-5 pb-5">
            <div className="container">
              <div className="row">
                <div className="col-lg-12">
                  <p className="custom-title text-center">
                    {t("Book celebrities for your events")}
                  </p>
                </div>
                <div className="col-lg-12">
                  <Slider
                    {...Celebritiessettings(CelebritiessliderRef)}
                    ref={CelebritiessliderRef}
                  >
                    {CelebrityData.map((val, i) => (
                      <div className="mb-5" key={i}>
                        <CelebritiesCard CelebrityItem={val} />
                      </div>
                    ))}
                  </Slider>
                </div>
              </div>
            </div>
          </section>

          <section className="services">
            <div className="container">
              <div className="row">
                <div className="col-lg-12">
                  <p className="custom-title text-center">
                    {t("Choose the service you are booking for")}
                  </p>
                </div>
                <div className="col-lg-12">
                  <Slider
                    {...Servicessettings(ServicesliderRef)}
                    ref={ServicesliderRef}
                  >
                    {ServiceData?.map((val, i) => (
                      <div className="mb-5">
                        <ServiceCard key={i} Serviceitem={val} />
                      </div>
                    ))}
                  </Slider>
                </div>
              </div>
            </div>
          </section>
          <AppDownloadBanner />
        </>
      )}
    </>
  );
}
