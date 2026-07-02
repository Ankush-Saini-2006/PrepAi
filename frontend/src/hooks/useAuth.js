import { useSelector } from "react-redux";

/**
 * Convenience hook to access the auth slice state.
 */
const useAuth = () => {
  const {
    user,
    accessToken,
    isAuthenticated,
    loading,
    error,
    emailSent,
    verificationStatus,
    resetStatus,
  } = useSelector((state) => state.auth);

  return {
    user,
    accessToken,
    isAuthenticated,
    loading,
    error,
    emailSent,
    verificationStatus,
    resetStatus,
    isVerified: user?.isVerified ?? false,
  };
};

export default useAuth;
