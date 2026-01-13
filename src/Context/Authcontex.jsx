import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

const BASE_URL = "https://dripg.onrender.com";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  // 🔐 Fetch user on app load if token exists
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return setUser(null);

      try {
        const res = await axios.get(`${BASE_URL}/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data?.success) {
          setUser(res.data.user);
        } else {
          localStorage.removeItem("token");
          setUser(null);
        }
      } catch {
        localStorage.removeItem("token");
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  // 🔔 Open auth modal and optionally store pending action
  const triggerAuthModal = (action = null) => {
    setPendingAction(() => action);
    setShowAuthModal(true);
  };

  // ✅ Handle login/signup success
  const handleLoginSuccess = async (token, userData) => {
    if (token) localStorage.setItem("token", token); // store token
    if (userData) setUser(userData); // update user in context

    if (pendingAction) {
      await pendingAction(); // retry any pending action
      setPendingAction(null);
    }

    setShowAuthModal(false); // close modal
  };

  // ❌ Close modal manually without doing pending action
  const closeAuthModal = () => {
    setShowAuthModal(false);
    setPendingAction(null);
  };

  // ✅ Logout helper
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
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
        pendingAction,
        setPendingAction,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
