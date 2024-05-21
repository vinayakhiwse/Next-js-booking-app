import "@/styles/globals.css";
import "@/styles/carouselTicker.css";
import Head from "next/head";
import Layout from "@/components/layouts";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { store, persistor } from "@/redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import { useEffect } from "react";
import { fetchDataFromFirebase } from "@/utils/firebaseAPI";
import useTranslation from "@/hooks/useTranslation";

export default function App({ Component, pageProps }) {
  const { t } = useTranslation();

  useEffect(() => {
    fetchDataFromFirebase();
  }, []);

  const getLayout = Component.getLayout ?? ((page) => <Layout>{page}</Layout>);

  return (
    <>
      <Head>
        <title>{t("Hall Of Fame")}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          {getLayout(<Component {...pageProps} />)}
        </PersistGate>
      </Provider>
    </>
  );
}
