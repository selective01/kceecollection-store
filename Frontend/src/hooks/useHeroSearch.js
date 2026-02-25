import { useEffect, useRef } from "react";

export const useHeroSearch = () => {
  const searchWrapperRef = useRef(null);
  const searchInputRef = useRef(null);
  const voiceIconRef = useRef(null);
  const searchToggleIconRef = useRef(null);

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
        searchWrapper?.classList.remove("active");
        searchInput?.classList.remove("active");
      }
    };

    searchToggleIcon?.addEventListener("click", handleToggleClick);
    searchInput?.addEventListener("blur", handleInputBlur);

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
        if (searchInput) {
          searchInput.value = event.results[0][0].transcript;
          searchInput.focus();
        }
      };

      recognition.onend = () => {
        voiceIcon?.classList.remove("listening");
      };

      recognition.onerror = () => {
        voiceIcon?.classList.remove("listening");
      };
    }

    return () => {
      // Cleanup listeners
      searchToggleIcon?.removeEventListener("click", handleToggleClick);
      searchInput?.removeEventListener("blur", handleInputBlur);
      voiceIcon?.removeEventListener("click", handleVoiceClick);
      if (recognition) {
        recognition.onresult = null;
        recognition.onend = null;
        recognition.onerror = null;
      }
    };
  }, []);

  return { searchWrapperRef, searchInputRef, voiceIconRef, searchToggleIconRef };
};
