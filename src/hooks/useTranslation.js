import { useState, useEffect } from "react";
import translations from "../locales/translations";

const useTranslation = () => {
  const [language, setLanguage] = useState(
    localStorage.getItem("selectedLanguageCode") || "en"
  );

  useEffect(() => {
    const handleLanguageChange = () => {
      setLanguage(localStorage.getItem("selectedLanguageCode") || "en");
    };
    window.addEventListener("storage", handleLanguageChange);
    return () => window.removeEventListener("storage", handleLanguageChange);
  }, []);

  return {
    t: (key) => translations[language]?.[key] || translations.en[key] || key,
    setLanguage: (langCode) => {
      setLanguage(langCode);
      localStorage.setItem("selectedLanguageCode", langCode);
    },
  };
};

export default useTranslation;
