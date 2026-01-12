import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

const BASE_URL = "https://dripg.onrender.com";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  // 🔐 Fetch user once on app load
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/user/me`,
          { withCredentials: true }
        );

        if (res.data?.success) {
          setUser(res.data.user);
        }
      } catch {
        // ❗ DO NOT close modal here
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  const triggerAuthModal = (action = null) => {
    setPendingAction(() => action);
    setShowAuthModal(true);
  };

  const handleLoginSuccess = async () => {
    if (pendingAction) {
      await pendingAction();
      setPendingAction(null);
    }
    setShowAuthModal(false); // ✅ close ONLY after success
  };

  const closeAuthModal = () => {
    setShowAuthModal(false);
    setPendingAction(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        showAuthModal,
        triggerAuthModal,
        handleLoginSuccess,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
