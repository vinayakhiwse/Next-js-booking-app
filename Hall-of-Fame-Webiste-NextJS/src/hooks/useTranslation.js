import { useRouter } from "next/router";
import en from "../../public/locales/en.json";
import ar from "../../public/locales/ar.json";

function useTranslation() {
  const { locale } = useRouter();

  const t = (key) => {
    if (locale == "ar") {
      return ar[key];
    }
    if (locale == "en" || !locale) {
      return en[key];
    }
  };

  return { t };
}

export default useTranslation;
