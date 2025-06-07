import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Chrome,
  Facebook,
  Phone,
} from "lucide-react";
import {
  auth,
  db,
  doc,
  setDoc,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  updateProfile,
} from "../firebase";

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [apiError, setApiError] = useState("");
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
    setApiError("");
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\+?[\d\s-()]+$/.test(formData.phone)) {
      newErrors.phone = "Phone number is invalid";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password =
        "Password must contain uppercase, lowercase, and number";
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (!agreeToTerms)
      newErrors.terms = "You must agree to the terms and conditions";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (!isOnline) {
      setApiError("You are offline. Please check your connection.");
      return;
    }

    setIsLoading(true);
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      console.log("Email signup successful:", user.uid);

      await updateProfile(user, {
        displayName: `${formData.firstName} ${formData.lastName}`,
      });

      const userDocData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        createdAt: new Date(),
        updatedAt: new Date(),
        signupMethod: "email",
      };

      try {
        await setDoc(doc(db, "users", user.uid), userDocData);
        console.log("User document created in Firestore:", userDocData);
      } catch (firestoreError) {
        console.error(
          "Firestore Error:",
          firestoreError.code,
          firestoreError.message
        );
        if (firestoreError.code === "unavailable") {
          setApiError(
            "You are offline. User data will sync when you reconnect."
          );
        } else if (firestoreError.code === "permission-denied") {
          setApiError(
            "Profile created, but permissions error occurred. Please contact support."
          );
        } else {
          setApiError(
            "Profile created, but some data may not be saved. Please update your profile later."
          );
        }
      }

      navigate("/home", {
        state: { message: "Account created successfully! Welcome!" },
      });
    } catch (error) {
      console.error("Email Signup Error:", error.code, error.message);
      switch (error.code) {
        case "auth/email-already-in-use":
          setApiError("This email is already registered. Please use another.");
          break;
        case "auth/invalid-email":
          setApiError("Invalid email address.");
          break;
        case "auth/weak-password":
          setApiError("Password is too weak.");
          break;
        case "auth/invalid-api-key":
          setApiError(
            "Invalid API key. Please check your Firebase configuration."
          );
          break;
        case "auth/network-request-failed":
          setApiError("Network error. Please check your connection.");
          break;
        case "auth/too-many-requests":
          setApiError("Too many attempts. Please try again later.");
          break;
        default:
          setApiError(error.message || "Signup failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignUp = async (providerName) => {
    if (!isOnline) {
      setApiError("You are offline. Please check your connection.");
      return;
    }

    setIsLoading(true);
    try {
      let provider;
      if (providerName === "google") {
        provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: "select_account" });
      } else if (providerName === "facebook") {
        provider = new FacebookAuthProvider();
        provider.setCustomParameters({
          prompt: "select_account",
          display: "popup",
        });
      }
      console.log(`Attempting ${providerName} signup...`);
      const result = await signInWithPopup(auth, provider);
      console.log(`${providerName} signup result:`, result);

      const user = result.user;
      const userDocData = {
        firstName: user.displayName?.split(" ")[0] || "",
        lastName: user.displayName?.split(" ").slice(1).join(" ") || "",
        email: user.email || "",
        phone: "",
        createdAt: new Date(),
        updatedAt: new Date(),
        signupMethod: providerName,
      };

      try {
        await setDoc(doc(db, "users", user.uid), userDocData);
        console.log("Social signup user document created:", userDocData);
      } catch (firestoreError) {
        console.error(
          `${providerName} Firestore Error:`,
          firestoreError.code,
          firestoreError.message
        );
        if (firestoreError.code === "unavailable") {
          setApiError(
            "You are offline. User data will sync when you reconnect."
          );
        } else if (firestoreError.code === "permission-denied") {
          setApiError(
            "Signed up successfully, but permissions error occurred. Please contact support."
          );
        } else {
          setApiError(
            "Signed up successfully, but some data may not be saved. Please update your profile."
          );
        }
      }

      navigate("/home", {
        state: { message: `${providerName} signup successful!` },
      });
    } catch (error) {
      console.error(`${providerName} Signup Error:`, error.code, error.message);
      switch (error.code) {
        case "auth/popup-closed-by-user":
          setApiError("Sign-up was cancelled. Please try again.");
          break;
        case "auth/popup-blocked":
          setApiError("Popup was blocked. Please allow popups and try again.");
          break;
        case "auth/account-exists-with-different-credential":
          setApiError(
            "An account already exists with this email but different credentials. Try signing in or linking accounts."
          );
          break;
        case "auth/network-request-failed":
          setApiError("Network error. Please check your connection.");
          break;
        case "auth/invalid-credential":
          setApiError(
            "Invalid credentials. Please check your provider settings."
          );
          break;
        case "auth/too-many-requests":
          setApiError("Too many attempts. Please try again later.");
          break;
        case "auth/cancelled-popup-request":
          setApiError("Popup request was cancelled. Please try again.");
          break;
        default:
          setApiError(
            error.message || `${providerName} signup failed. Please try again.`
          );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Create Account
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Join us and start your journey today
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
          {apiError && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">
                {apiError}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  First Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                      errors.firstName ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="First name"
                  />
                </div>
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.firstName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Last Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                      errors.lastName ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Last name"
                  />
                </div>
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.lastName}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                    errors.phone ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter your phone number"
                />
              </div>
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.phone}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                      errors.password ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.password}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                      errors.confirmPassword
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="Confirm password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="flex items-start">
                <input
                  type="checkbox"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  className="mt-1 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">
                  I agree to the{" "}
                  <Link
                    to="/terms"
                    className="text-purple-600 hover:text-purple-800 dark:text-purple-400"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    to="/privacy"
                    className="text-purple-600 hover:text-purple-800 dark:text-purple-400"
                  >
                    Privacy Policy
                  </Link>
                </span>
              </label>
              {errors.terms && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.terms}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || !isOnline}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating Account...
                </div>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="my-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  Or sign up with
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => handleSocialSignUp("google")}
              disabled={isLoading || !isOnline}
              className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Chrome className="w-5 h-5 text-red-500 mr-3" />
              <span className="text-gray-700 dark:text-gray-300 font-semibold">
                Sign up with Google
              </span>
            </button>

            {/* <button
              onClick={() => handleSocialSignUp("facebook")}
              disabled={isLoading || !isOnline}
              className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Facebook className="w-5 h-5 text-blue-600 mr-3" />
              <span className="text-gray-700 dark:text-gray-300 font-semibold">
                Sign up with Facebook
              </span>
            </button> */}
          </div>

          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-300">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 font-semibold"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
