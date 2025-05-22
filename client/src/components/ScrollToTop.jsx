import { useEffect } from "react";

const ScrollToTop = () => {
  useEffect(() => {
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "instant" }); // "instant" works better than "smooth" on reload
    }, 10); // delay just enough to override browser scroll restore
  }, []);

  return null;
};

export default ScrollToTop;
