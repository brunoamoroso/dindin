import Cookies from "js-cookie";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.slice(1));
    const token = hashParams.get("token");

    if (!token) {
      navigate("/", { replace: true });
      return;
    }

    Cookies.set("token", token);
    navigate("/dashboard", { replace: true });
  }, [navigate]);

  return null;
}
