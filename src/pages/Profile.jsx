import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  auth,
  db,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  storage,
  ref,
  uploadBytes,
  getDownloadURL,
  updateProfile,
  updateEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "../firebase";
import {
  User,
  Mail,
  Phone,
  Upload,
  Camera,
  Edit3,
  Save,
  X,
  Eye,
  EyeOff,
  Lock,
} from "lucide-react";

const Profile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    displayName: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    photoURL: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

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

  useEffect(() => {
    const fetchUserData = async () => {
      const unsubscribe = auth.onAuthStateChanged(async (user) => {
        if (!user) {
          // Navigate to login page instead of profile
          navigate("/profile"); // or whatever your login route is
          return;
        }

        try {
          const initialUserData = {
            displayName: user.displayName || "",
            firstName: "",
            lastName: "",
            email: user.email || "",
            phone: "",
            photoURL:
              user.photoURL || "https://via.placeholder.com/150?text=No+Photo",
          };

          setUserData(initialUserData);

          if (!isOnline) {
            setApiError("You are offline. Some data may not be available.");
            setIsLoading(false);
            return;
          }

          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const firestoreData = userDoc.data();
            const updatedUserData = {
              displayName:
                user.displayName ||
                `${firestoreData.firstName || ""} ${
                  firestoreData.lastName || ""
                }`.trim() ||
                "Not set",
              firstName: firestoreData.firstName || "",
              lastName: firestoreData.lastName || "",
              email: user.email || "",
              phone: firestoreData.phone || "",
              photoURL:
                user.photoURL ||
                "https://via.placeholder.com/150?text=No+Photo",
            };
            setUserData(updatedUserData);
          }
        } catch (error) {
          setApiError(`Failed to fetch user data: ${error.message}`);
        } finally {
          setIsLoading(false);
        }
      });

      return () => unsubscribe();
    };

    fetchUserData();
  }, [navigate, isOnline]);

  const handleEditToggle = () => {
    if (editMode) {
      setEditData({});
      setEditMode(false);
      setApiError("");
      setSuccessMessage("");
    } else {
      setEditData({ ...userData });
      setEditMode(true);
      setApiError("");
      setSuccessMessage("");
    }
  };

  const handleInputChange = (field, value) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateEditData = () => {
    const errors = [];
    if (!editData.firstName?.trim()) errors.push("First name is required");
    if (!editData.lastName?.trim()) errors.push("Last name is required");
    if (!editData.email?.trim()) errors.push("Email is required");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editData.email))
      errors.push("Please enter a valid email address");
    if (editData.phone && !/^[\d\s\-\+\(\)]+$/.test(editData.phone))
      errors.push("Please enter a valid phone number");
    return errors;
  };

  const handleSaveProfile = async () => {
    if (!auth.currentUser) {
      setApiError("You must be logged in to update your profile.");
      return;
    }
    if (!isOnline) {
      setApiError("Cannot update profile while offline.");
      return;
    }
    const errors = validateEditData();
    if (errors.length > 0) {
      setApiError(errors.join(", "));
      return;
    }
    setIsUpdating(true);
    setApiError("");
    setSuccessMessage("");
    try {
      const userId = auth.currentUser.uid;
      const userDocRef = doc(db, "users", userId);
      const firestoreData = {
        firstName: editData.firstName.trim(),
        lastName: editData.lastName.trim(),
        phone: editData.phone?.trim() || "",
        updatedAt: new Date().toISOString(),
      };
      await setDoc(userDocRef, firestoreData, { merge: true });
      const displayName = `${editData.firstName.trim()} ${editData.lastName.trim()}`;
      await updateProfile(auth.currentUser, { displayName });
      if (editData.email !== userData.email)
        await updateEmail(auth.currentUser, editData.email);
      const updatedUserData = { ...editData, displayName };
      setUserData(updatedUserData);
      setEditMode(false);
      setEditData({});
      setSuccessMessage("Profile updated successfully!");
    } catch (error) {
      let errorMessage = "Failed to update profile.";
      switch (error.code) {
        case "auth/requires-recent-login":
          errorMessage = "Please re-authenticate to update your email.";
          break;
        case "auth/email-already-in-use":
          errorMessage = "This email is already in use by another account.";
          break;
        case "auth/invalid-email":
          errorMessage = "Please enter a valid email address.";
          break;
        default:
          errorMessage = error.message || errorMessage;
      }
      setApiError(errorMessage);
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!auth.currentUser) {
      setApiError("You must be logged in to change your password.");
      return;
    }
    if (!isOnline) {
      setApiError("Cannot change password while offline.");
      return;
    }
    const { currentPassword, newPassword, confirmPassword } = passwordData;
    if (!currentPassword || !newPassword || !confirmPassword) {
      setApiError("All password fields are required.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setApiError("New passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      setApiError("New password must be at least 6 characters long.");
      return;
    }
    setIsUpdating(true);
    setApiError("");
    try {
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        currentPassword
      );
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updatePassword(auth.currentUser, newPassword);
      setSuccessMessage("Password updated successfully!");
      setShowPasswordForm(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      let errorMessage = "Failed to change password.";
      switch (error.code) {
        case "auth/wrong-password":
          errorMessage = "Current password is incorrect.";
          break;
        case "auth/weak-password":
          errorMessage = "New password is too weak.";
          break;
        default:
          errorMessage = error.message || errorMessage;
      }
      setApiError(errorMessage);
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setApiError("Please select a valid image file.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setApiError("File size must be less than 5MB.");
        return;
      }
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setPhotoPreview(e.target.result);
      reader.readAsDataURL(file);
      setApiError("");
      setSuccessMessage("");
    }
  };

  const handlePhotoUpload = async () => {
    if (!photoFile) {
      setApiError("Please select a photo to upload.");
      return;
    }
    if (!isOnline) {
      setApiError("Cannot upload photo while offline.");
      return;
    }
    if (!auth.currentUser) {
      setApiError("You must be logged in to upload a photo.");
      return;
    }
    setIsUploading(true);
    setApiError("");
    setSuccessMessage("");
    try {
      const timestamp = Date.now();
      const fileName = `profile_photo_${timestamp}_${photoFile.name}`;
      const storageRef = ref(
        storage,
        `profile_photos/${auth.currentUser.uid}/${fileName}`
      );
      const metadata = {
        contentType: photoFile.type,
        customMetadata: {
          uploadedBy: auth.currentUser.uid,
          uploadedAt: new Date().toISOString(),
        },
      };
      await uploadBytes(storageRef, photoFile, metadata);
      const photoURL = await getDownloadURL(storageRef);
      await updateProfile(auth.currentUser, { photoURL });
      setUserData((prev) => ({ ...prev, photoURL }));
      setSuccessMessage("Profile photo updated successfully!");
      setPhotoFile(null);
      setPhotoPreview(null);
      const fileInput = document.getElementById("photo-upload");
      if (fileInput) fileInput.value = "";
    } catch (error) {
      let errorMessage = "Failed to upload photo.";
      setApiError(error.message || errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Your Profile
            </h1>
            <button
              onClick={handleEditToggle}
              className="flex items-center px-3 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors"
            >
              {editMode ? (
                <>
                  <X className="w-4 h-4 mr-1" />
                  Cancel
                </>
              ) : (
                <>
                  <Edit3 className="w-4 h-4 mr-1" />
                  Edit
                </>
              )}
            </button>
          </div>

          {/* Error Message */}
          {apiError && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">
                {apiError}
              </p>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="mb-4 p-3 bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg">
              <p className="text-sm text-green-600 dark:text-green-400">
                {successMessage}
              </p>
            </div>
          )}

          {/* Profile Photo Section */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <img
                src={photoPreview || userData.photoURL}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-4 border-blue-600 dark:border-blue-400"
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/150?text=No+Photo";
                }}
              />
              {isUploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                </div>
              )}
              <div className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-1">
                <Camera className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>

          {/* User Information */}
          <div className="space-y-4 mb-6">
            {editMode ? (
              // Edit Mode
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      First Name *
                    </label>
                    <input
                      type="text"
                      value={editData.firstName || ""}
                      onChange={(e) =>
                        handleInputChange("firstName", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="First name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      value={editData.lastName || ""}
                      onChange={(e) =>
                        handleInputChange("lastName", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="Last name"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={editData.email || ""}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Email address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={editData.phone || ""}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Phone number"
                  />
                </div>
                <button
                  onClick={handleSaveProfile}
                  disabled={isUpdating || !isOnline}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-2 px-4 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdating ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Saving...
                    </div>
                  ) : (
                    <>
                      <Save className="w-4 h-4 inline mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
              </>
            ) : (
              // View Mode
              <>
                <div className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-gray-400" />
                  <p className="text-gray-700 dark:text-gray-300">
                    <span className="font-medium">Name:</span>{" "}
                    {userData.displayName || "Not set"}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <p className="text-gray-700 dark:text-gray-300">
                    <span className="font-medium">Email:</span>{" "}
                    {userData.email || "Not set"}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <p className="text-gray-700 dark:text-gray-300">
                    <span className="font-medium">Phone:</span>{" "}
                    {userData.phone || "Not set"}
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Password Change Section */}
          {!editMode && (
            <div className="border-t border-gray-200 dark:border-gray-600 pt-6 mb-6">
              <button
                onClick={() => setShowPasswordForm(!showPasswordForm)}
                className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <Lock className="w-4 h-4 mr-2" />
                Change Password
              </button>

              {showPasswordForm && (
                <div className="mt-4 space-y-3">
                  <div className="relative">
                    <input
                      type={showPasswords.current ? "text" : "password"}
                      placeholder="Current Password"
                      value={passwordData.currentPassword}
                      onChange={(e) =>
                        setPasswordData((prev) => ({
                          ...prev,
                          currentPassword: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPasswords((prev) => ({
                          ...prev,
                          current: !prev.current,
                        }))
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.current ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPasswords.new ? "text" : "password"}
                      placeholder="New Password"
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData((prev) => ({
                          ...prev,
                          newPassword: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPasswords((prev) => ({
                          ...prev,
                          new: !prev.new,
                        }))
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.new ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPasswords.confirm ? "text" : "password"}
                      placeholder="Confirm New Password"
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        setPasswordData((prev) => ({
                          ...prev,
                          confirmPassword: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPasswords((prev) => ({
                          ...prev,
                          confirm: !prev.confirm,
                        }))
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.confirm ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={handlePasswordChange}
                      disabled={isUpdating || !isOnline}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 text-white py-2 px-4 rounded-lg font-medium hover:from-purple-700 hover:to-purple-800 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isUpdating ? "Updating..." : "Update Password"}
                    </button>
                    <button
                      onClick={() => {
                        setShowPasswordForm(false);
                        setPasswordData({
                          currentPassword: "",
                          newPassword: "",
                          confirmPassword: "",
                        });
                      }}
                      className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Photo Upload Section */}
          {!editMode && (
            <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                <Upload className="w-4 h-4 inline mr-2" />
                Update Profile Photo
              </label>

              <div className="space-y-3">
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-gray-700 dark:file:text-gray-300"
                />

                {photoFile && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Selected: {photoFile.name} (
                    {(photoFile.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}

                <button
                  onClick={handlePhotoUpload}
                  disabled={isUploading || !photoFile || !isOnline}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Uploading...
                    </div>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 inline mr-2" />
                      Upload Photo
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
