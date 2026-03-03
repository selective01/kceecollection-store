import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_URL;

// Map category name to route path
const CATEGORY_ROUTES = {
  Bags: "/bags",
  Caps: "/caps",
  ClubJersey: "/club-jersey",
  DesignerShirts: "/designer-shirts",
  Hoodies: "/hoodies",
  Jeans: "/jeans",
  JeanShorts: "/jean-shorts",
  Joggers: "/joggers",
  Perfume: "/perfume",
  Polo: "/polo",
  RetroJersey: "/retro-jersey",
  Shoes: "/shoes",
  Shorts: "/shorts",
  Sleeveless: "/sleeveless",
  Slippers: "/slippers",
  Sneakers: "/sneakers",
  TShirts: "/tshirts",
  Watches: "/watches",
};

export const useHeroSearch = () => {
  const searchWrapperRef = useRef(null);
  const searchInputRef = useRef(null);
  const voiceIconRef = useRef(null);
  const searchToggleIconRef = useRef(null);
  const dropdownRef = useRef(null);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searching, setSearching] = useState(false);

  const navigate = useNavigate();

  // Debounced search
  const searchProducts = useCallback(async (q) => {
    if (!q.trim()) { setResults([]); setShowDropdown(false); return; }
    try {
      setSearching(true);
      const res = await fetch(`${BASE_URL}/api/products`);
      const data = await res.json();
      const filtered = data.filter((p) =>
        p.name.toLowerCase().includes(q.toLowerCase()) ||
        (p.description || "").toLowerCase().includes(q.toLowerCase()) ||
        (p.category || "").toLowerCase().includes(q.toLowerCase())
      ).slice(0, 6); // max 6 results
      setResults(filtered);
      setShowDropdown(filtered.length > 0);
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setSearching(false);
    }
  }, []);

  // Debounce input
  useEffect(() => {
    const timer = setTimeout(() => {
      searchProducts(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query, searchProducts]);

  // Handle result click
  const handleResultClick = (product) => {
    const route = CATEGORY_ROUTES[product.category] || "/";
    setShowDropdown(false);
    setQuery("");
    if (searchInputRef.current) searchInputRef.current.value = "";
    navigate(route);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target) &&
        searchInputRef.current && !searchInputRef.current.contains(e.target)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const searchWrapper = searchWrapperRef.current;
    const searchInput = searchInputRef.current;
    const voiceIcon = voiceIconRef.current;
    const searchToggleIcon = searchToggleIconRef.current;

    const handleToggleClick = () => {
      searchWrapper?.classList.add("active");
      searchInput?.classList.add("active");
      searchInput?.focus();
    };

    const handleInputBlur = () => {
      if (window.innerWidth <= 600) {
        setTimeout(() => {
          searchWrapper?.classList.remove("active");
          searchInput?.classList.remove("active");
        }, 200); // delay so click on result registers first
      }
    };

    const handleInputChange = (e) => {
      setQuery(e.target.value);
    };

    searchToggleIcon?.addEventListener("click", handleToggleClick);
    searchInput?.addEventListener("blur", handleInputBlur);
    searchInput?.addEventListener("input", handleInputChange);

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    let recognition;
    const handleVoiceClick = () => {
      if (!recognition) return;
      recognition.start();
      voiceIcon?.classList.add("listening");
    };

    if (SpeechRecognition) {
      recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.continuous = false;

      voiceIcon?.addEventListener("click", handleVoiceClick);

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (searchInput) {
          searchInput.value = transcript;
          setQuery(transcript);
          searchInput.focus();
        }
      };

      recognition.onend = () => voiceIcon?.classList.remove("listening");
      recognition.onerror = () => voiceIcon?.classList.remove("listening");
    }

    return () => {
      searchToggleIcon?.removeEventListener("click", handleToggleClick);
      searchInput?.removeEventListener("blur", handleInputBlur);
      searchInput?.removeEventListener("input", handleInputChange);
      voiceIcon?.removeEventListener("click", handleVoiceClick);
      if (recognition) {
        recognition.onresult = null;
        recognition.onend = null;
        recognition.onerror = null;
      }
    };
  }, []);

  return {
    searchWrapperRef,
    searchInputRef,
    voiceIconRef,
    searchToggleIconRef,
    dropdownRef,
    results,
    showDropdown,
    searching,
    handleResultClick,
  };
};
