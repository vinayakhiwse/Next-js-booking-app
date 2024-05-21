// firebaseAPI.js
import { store } from "@/redux/store";
import { getStaticData } from "./firebaseutils";
import {
  setArticlesData,
  setFaqData,
  setImagesData,
  setStaticData,
} from "@/redux/reducers/staticData";
import moment from "moment";

const fetchSitedata = async () => {
  try {
    getStaticData("AppInfo").then((appinfo) => {
      store.dispatch(setStaticData(appinfo[0]));
    });
  } catch (error) {
    console.error("Error fetching articles from Firebase:", error);
  }
};

const fetchFAQs = async () => {
  try {
    getStaticData("FAQ").then((allfaqs) => {
      store.dispatch(setFaqData(allfaqs));
    });
  } catch (error) {
    console.error("Error fetching FAQs from Firebase:", error);
  }
};

const fetchArticles = async () => {
  try {
    getStaticData("Articles").then((allarticles) => {
      for (let i = 0; i < allarticles.length; i++) {
        allarticles[i].date = moment(allarticles[i].date.toDate()).format(
          "MMM DD,YYYY"
        );
      }
      store.dispatch(setArticlesData(allarticles));
    });
  } catch (error) {
    console.error("Error fetching articles from Firebase:", error);
  }
};

const fetchImagesdata = async () => {
  try {
    getStaticData("ImageGallery").then((imageDoc) => {
      store.dispatch(setImagesData(imageDoc[0]?.images));
    });
  } catch (error) {
    console.error("Error fetching articles from Firebase:", error);
  }
};

// Fetch data from Firebase
const fetchDataFromFirebase = async () => {
  await fetchSitedata();
  await fetchFAQs();
  await fetchArticles();
  await fetchImagesdata();
};

export { fetchDataFromFirebase };
