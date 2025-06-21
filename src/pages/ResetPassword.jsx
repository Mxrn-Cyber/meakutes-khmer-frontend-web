import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Lock, Eye, EyeOff, CheckCircle } from "lucide-react"; // Added CheckCircle
import { auth, confirmPasswordReset } from "../firebase";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const oobCode = searchParams.get("oobCode");

  useEffect(() => {
    if (!oobCode) {
      setApiError(
        "Invalid or missing reset code. Please use the link from your email or request a new one."
      );
    }
  }, [oobCode]);

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
    setSuccessMessage("");
  };

  const validateForm = () => {
    const newErrors = {};
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
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (!oobCode) {
      setApiError("Invalid reset code. Please request a new reset link.");
      return;
    }

    setIsLoading(true);
    try {
      await confirmPasswordReset(auth, oobCode, formData.password);
      setSuccessMessage(
        "Password updated successfully! You will be redirected to the login page in a moment..."
      );
      setTimeout(() => {
        navigate("/login", {
          state: { message: "Password reset successful. Please sign in." },
        });
      }, 4000); // Increased to 4 seconds for better visibility
    } catch (error) {
      let errorMessage = "Failed to reset password. Please try again.";
      switch (error.code) {
        case "auth/invalid-action-code":
          errorMessage =
            "Invalid or expired reset code. Please request a new reset link.";
          break;
        case "auth/expired-action-code":
          errorMessage =
            "The reset link has expired. Please request a new one.";
          break;
        case "auth/weak-password":
          errorMessage =
            "The new password is too weak. Please choose a stronger password.";
          break;
        default:
          errorMessage = error.message || errorMessage;
      }
      setApiError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Create New Password
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Enter your new password below
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
          {successMessage && (
            <div className="mb-4 p-3 bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg flex items-center">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
              <p className="text-sm text-green-600 dark:text-green-400">
                {successMessage}
              </p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                class
                livescript="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter new password"
                  disabled={isLoading || successMessage}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  disabled={isLoading || successMessage}
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
                  className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                    errors.confirmPassword
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="Confirm new password"
                  disabled={isLoading || successMessage}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  disabled={isLoading || successMessage}
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

            <button
              type="submit"
              disabled={isLoading || successMessage}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Updating...
                </div>
              ) : (
                "Set New Password"
              )}
            </button>
          </form>
          {!successMessage && (
            <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
              <a
                href="/forgot-password"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Request a new reset link
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
