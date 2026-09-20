// Loads Google Identity Services once, for the Login/Signup pages' "Continue
// with Google" buttons. Replaces firebase's signInWithPopup(GoogleAuthProvider).
let scriptLoadingPromise = null;

export function loadGoogleScript() {
  if (typeof window !== "undefined" && window.google?.accounts?.id) {
    return Promise.resolve();
  }
  if (scriptLoadingPromise) return scriptLoadingPromise;

  scriptLoadingPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Google Identity Services"));
    document.head.appendChild(script);
  });
  return scriptLoadingPromise;
}
