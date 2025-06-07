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
