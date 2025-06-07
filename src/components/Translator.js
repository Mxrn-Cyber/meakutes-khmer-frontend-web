// src/components/Translator.js
import { useEffect } from "react";

export const setLanguage = (langCode) => {
  const maxAttempts = 10;
  let attempt = 0;

  const attemptSetLanguage = () => {
    const select = document.querySelector(".goog-te-combo");
    if (select) {
      select.value = langCode;
      select.dispatchEvent(new Event("change"));
      console.log(`Language changed to: ${langCode}`);
    } else if (attempt < maxAttempts) {
      attempt++;
      console.warn(
        `Google Translate select element not found, retrying (${attempt}/${maxAttempts})...`
      );
      setTimeout(attemptSetLanguage, 100);
    } else {
      console.error(
        "Failed to initialize Google Translate after maximum attempts"
      );
    }
  };

  attemptSetLanguage();
};

const Translator = () => {
  useEffect(() => {
    const addGoogleTranslateScript = () => {
      // Skip if already loaded
      if (document.getElementById("google-translate-script")) return;

      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src =
        "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    };

    // Define the callback that the Google script expects
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
        },
        "google_translate_element"
      );
    };

    addGoogleTranslateScript();
  }, []);

  return;
};

export default Translator;
