export const textToSpeech = (language, transcription) => {
  window.SpeechRecognition = window.webkitSpeechRecognition;

  const recognition = new SpeechRecognition();
  recognition.interimResults = true;
  recognition.lang = language || "es-PE";

  recognition.addEventListener("result", (e) => {
    const transcript = Array.from(e.results)
      .map((result) => result[0])
      .map((result) => result.transcript)
      .join("");

    getById("convert_text").innerHTML = transcript;
    console.log(transcript);
  });

  recognition.start();
};
