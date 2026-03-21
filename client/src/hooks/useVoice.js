import { useState } from "react";
import toast from "react-hot-toast";

const useVoice = () => {
  const [transcript, setTranscript] = useState("");
  const [listening, setListening] = useState(false);

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Speech recognition is not supported in this browser.");
      return;
    }
    
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;

    recognition.onerror = (event) => {
      toast.error(`Microphone error: ${event.error}`);
      setListening(false);
    };

    recognition.onstart = () => setListening(true);

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
    };

    recognition.onend = () => setListening(false);

    recognition.start();
  };

  const resetTranscript = () => setTranscript("");

  return { transcript, listening, startListening, resetTranscript };
};

export default useVoice;