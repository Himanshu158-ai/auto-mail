import { useState } from "react";

const useVoice = () => {
  const [transcript, setTranscript] = useState("");
  const [listening, setListening] = useState(false);

  const startListening = () => {
    const recognition = new window.SpeechRecognition() || 
                        new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;

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