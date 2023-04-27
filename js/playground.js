import { setLanguage } from "../config/language.js";
import { setTheme } from "../config/theme.js";
import { getById } from "../utils/reuse.js";

//LANGUAGE
const language = localStorage.getItem("language");
//THEME
const theme = localStorage.getItem("theme");

export const playground = () => {
  getById("content").innerHTML = `
      <!--SPEECH TO TEXT-->
      <section class="p-8 flex items-center gap-8 bg-white rounded-lg">
        <div class="w-1/2 flex flex-col items-center gap-5">
          <button class="w-full px-10 py-2 bg-sky-400 hover:bg-sky-600 text-yellow-50 font-bold rounded-lg"
            id="repeat">
            Que 🤖 lo repita
          </button>
          <textarea class="w-full px-3 py-2 bg-blue-100 rounded-lg" name="text" id="convert_text" cols="30"
            rows="10"></textarea>
        </div>
        <div class="w-1/2 flex flex-col gap-5">
          <h1 class="text-3xl text-center font-bold">
            Convertidor de voz a texto
          </h1>
          <img class="rounded-lg"
            src="https://nordicapis.com/wp-content/uploads/5-Best-Speech-to-Text-APIs-2-e1615383933700.png" alt="STT">
          <button class="px-10 py-2 bg-indigo-500 hover:bg-indigo-800 text-yellow-50 font-bold rounded-lg"
            id="btnRecordVoice">
            Speech to Text
          </button>
        </div>
      </section>

      <!--TEXT TO SPEECH-->
      <section class="p-8 flex items-center gap-8 bg-white rounded-lg">
        <div class="w-1/2 flex flex-col gap-5">
          <h1 class="text-3xl text-center font-bold">
            Convertidor de texto a voz
          </h1>
          <img class="rounded-lg" src="https://miro.medium.com/max/700/1*yDgVdq8--I5pUyGodlzswg.jpeg" alt="TTS">
          <button class="px-10 py-2 bg-indigo-500 hover:bg-indigo-800 text-yellow-50 font-bold rounded-lg" id="btnConvertTTS">
            Text to Speech
          </button>
        </div>
        <div class="w-1/2 flex flex-col items-center gap-5">
          <div class="w-full flex items-center justify-around gap-5 text-4xl font-bold">
            <h1>🤖 Giorgio</h1>
            <span class="px-3 py-2 bg-blue-100 rounded-full" id="voiceIconTTS">🔈</span>
          </div>
          <textarea class="w-full px-3 py-2 bg-blue-100 rounded-lg" name="text" id="inputText" cols="30"
            rows="10"></textarea>
        </div>
      </section>
  `;
  setTheme(theme);

  //Speech to Text
  btnRecordVoice.addEventListener("click", function () {
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
  });

  //Repetir el texto
  getById("repeat").addEventListener("click", () => {
    let textoSTT = getById("convert_text").value;
    getById("inputText").value = textoSTT;
    console.log(textoSTT);
  });

  //Text to Speech
  let btnConvertTTS = getById("btnConvertTTS");
  let voiceIconTTS = getById("voiceIconTTS");
  let speechInputTTS = getById("inputText");
  let state = true;
  let speechOnChange;

  speechInputTTS.addEventListener("change", function () {
    speechOnChange = this.value;
    speechSynthesis.cancel();
    btnConvertTTS.innerText = "Text to Speech";
    voiceIconTTS.innerText = "🔈";
  });

  btnConvertTTS.addEventListener("click", function () {
    const elStyle = btnConvertTTS.classList;

    if (!speechSynthesis.speaking || speechSynthesis.pause()) {
      speechOnChange = speechInputTTS.value;
      var speechVoice = new SpeechSynthesisUtterance();
      //var voices = speechSynthesis.getVoices();
      //console.log(voices);
      //speechVoice.voice = voices[1];
      speechVoice.text = speechOnChange;
      speechVoice.lang = language || "es-PE";
      speechSynthesis.speak(speechVoice);
    }

    if (state) {
      speechSynthesis.resume();
      //Style
      elStyle.replace("bg-indigo-500", "bg-green-500");
      elStyle.replace("hover:bg-indigo-800", "hover:bg-green-800");
      elStyle.replace("bg-red-500", "bg-green-500");
      elStyle.replace("hover:bg-red-800", "hover:bg-green-800");
      //Text
      btnConvertTTS.innerText = "Reproduciendo..";
      voiceIconTTS.innerText = "🔊";
      state = false;
    } else {
      speechSynthesis.pause();
      //Style
      elStyle.replace("bg-green-500", "bg-red-500");
      elStyle.replace("hover:bg-green-800", "hover:bg-red-800");
      //Text
      btnConvertTTS.innerText = "Pausado..";
      voiceIconTTS.innerText = "🔈";
      state = true;
    }

    setInterval(() => {
      if (!speechSynthesis.speaking && !state) {
        //Style
        elStyle.replace("bg-indigo-500", "bg-green-500");
        elStyle.replace("hover:bg-indigo-800", "hover:bg-green-800");
        //Text
        btnConvertTTS.innerText = "Text to Speech";
        voiceIconTTS.innerText = "🔈";
        state = true;
      }
    }, 100);
  });
};
