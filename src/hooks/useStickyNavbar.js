import { useEffect } from "react";

export const useStickyNavbar = (heroNavRef, heroSectionRef, stickyNavRef) => {
  useEffect(() => {
    const heroNav = heroNavRef.current;
    const heroSection = heroSectionRef.current;
    const stickyNav = stickyNavRef.current;

    if (heroNav && heroSection && stickyNav) {
      const clone = heroNav.cloneNode(true);
      clone.classList.add("sticky-version");
      stickyNav.appendChild(clone);

      const handleScroll = () => {
        const heroBottom =
          heroSection.getBoundingClientRect().bottom + window.scrollY;

        if (window.scrollY >= heroBottom) {
          heroNav.classList.add("hidden");
          clone.classList.add("active");
        } else {
          heroNav.classList.remove("hidden");
          clone.classList.remove("active");
        }
      };

      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [heroNavRef, heroSectionRef, stickyNavRef]);
};
