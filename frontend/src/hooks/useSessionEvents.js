import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { setAccessToken, clearError } from "../features/auth/authSlice";
import { logoutUser } from "../features/auth/authSlice";

/**
 * Listens for custom window events emitted by the Axios interceptor:
 *  - "prepai:token-refreshed"  → update the access token in Redux
 *  - "prepai:session-expired"  → force logout + redirect to login
 *
 * Mount this once at the top-level (inside <AuthProvider /> or App).
 */
const useSessionEvents = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const onTokenRefreshed = (e) => {
      dispatch(setAccessToken(e.detail));
    };

    const onSessionExpired = () => {
      dispatch(logoutUser());
      toast.error("Your session has expired. Please log in again.");
      navigate("/login", { replace: true });
    };

    window.addEventListener("prepai:token-refreshed", onTokenRefreshed);
    window.addEventListener("prepai:session-expired", onSessionExpired);

    return () => {
      window.removeEventListener("prepai:token-refreshed", onTokenRefreshed);
      window.removeEventListener("prepai:session-expired", onSessionExpired);
    };
  }, [dispatch, navigate]);
};

export default useSessionEvents;
