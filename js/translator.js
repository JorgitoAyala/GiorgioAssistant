import { setLanguage } from "../config/language.js";
import { setTheme } from "../config/theme.js";
import { getById } from "../utils/reuse.js";

//LANGUAGE
const language = localStorage.getItem("language");
//THEME
const theme = localStorage.getItem("theme");

export const translator = () => {
  getById("content").innerHTML = `
      <section class="p-8 flex flex-col items-center gap-8 bg-white rounded-lg">
        <!--BIENVENIDA AL TRADUCTOR-->
        <div class="flex flex-col items-center gap-3">
          <h1 class="text-2xl font-bold">
            Te presentamos el traductor de Giorgio 🤖!!
          </h1>
          <p class="text-lg">
            Por el momento el traductor está disponible en dos idiomas: de Inglés a Español y de Español a Inglés, puedes cambiar la configuración del idioma en la parte superior 🤓.
          </p>
          <img class="rounded-lg" src="https://static.vecteezy.com/system/resources/previews/003/836/233/non_2x/translation-word-concepts-banner-foreign-language-interpretation-online-translator-presentation-website-isolated-lettering-typography-idea-with-linear-icons-outline-illustration-vector.jpg" alt="traductor" />
        </div>

        <!--COMIENZA A HABLAR-->
        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col gap-5">
            <h1 class="text-3xl text-center font-bold">
              Dime, ¿Que deseas traducir 🤖?
            </h1>
            <img class="rounded-lg"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdGaN_QJo55Krb4pWcxrhC4ag8fBdyTq7eg3Y0vxLELXpNzTCOyr5Wsuzm-YJbbhbjbhQ&usqp=CAU" alt="STT">
            <button class="px-10 py-2 bg-indigo-500 hover:bg-indigo-800 text-yellow-50 font-bold rounded-lg"
              id="btnTranslateVoice">
              🎙️ Hablar ahora
            </button>
          </div>
          <textarea class="h-full px-3 py-2 bg-blue-100 rounded-lg" name="text" id="convert_text" cols="30" rows="10"></textarea>
        </div>

        <!--CONTENIDO AUTOGENERADO-->
        <div class="w-full" id="nextContent"></div>
      </section>
  `;
  setTheme(theme);

  //Speech to Text
  btnTranslateVoice.addEventListener("click", function () {
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

    recognition.addEventListener("start", (e) => {
      btnTranslateVoice.innerText = "🎙️ Escuchando...";
    });

    recognition.addEventListener("end", (e) => {
      btnTranslateVoice.innerText = "🎙️ Volver a hablar...";

      const transcription = getById("convert_text").value;
      console.log(transcription);

      let sourceLanguage = language.substring(0, 2);
      let targetLanguage = language.substring(0, 2) === "en" ? "es" : "en";

      //FECTH CONNECTION
      const encodedParams = new URLSearchParams();
      encodedParams.append("source_language", sourceLanguage);
      encodedParams.append("target_language", targetLanguage);
      encodedParams.append("text", transcription);

      const options = {
        method: "POST",
        headers: {
          "content-type": "application/x-www-form-urlencoded",
          "X-RapidAPI-Key":
            "5460f76b32msh11739c2f12fc525p138f9cjsndd68263aee42",
          "X-RapidAPI-Host": "text-translator2.p.rapidapi.com",
        },
        body: encodedParams,
      };

      fetch("https://text-translator2.p.rapidapi.com/translate", options)
        .then((res) => res.json())
        .then((res) => {
          getById("nextContent").innerHTML = `
            <div class="flex justify-center items-center gap-5">
              <p class="text-xl">Giorgio está hablando 🤖:</p>
              <button
                class="px-5 py-2.5 right-2 bottom-2 bg-indigo-500 hover:bg-blue-800 text-yellow-50 font-bold rounded-full"
                type="button" id="controlAudio">
                🔊 Reproduciendo...
              </button>
            </div>
            <div class="mt-4 relative p-5 m-5 bg-blue-500 text-yellow-100 rounded-b-xl rounded-tr-xl">
              <div class="absolute -left-5 -top-5 px-3 py-4 border-4 border-white bg-blue-500 text-yellow-100 text-4xl rounded-full">
                🤖
              </div>
              <p class="ml-10 text-right">${res.data.translatedText}</p>
            </div>
          `;
          console.log(res);

          let speechVoice = new SpeechSynthesisUtterance();
          let state = false;

          speechVoice.lang = language === "es-PE" ? "en-US" : "es-PE";
          speechVoice.text = res.data.translatedText;
          speechSynthesis.speak(speechVoice);

          const btnConvertTTS = getById("controlAudio");
          const elStyle = btnConvertTTS.classList;

          btnConvertTTS.addEventListener("click", () => {
            if (state) {
              speechSynthesis.resume();
              elStyle.replace("bg-indigo-500", "bg-green-500");
              elStyle.replace("hover:bg-indigo-800", "hover:bg-green-800");
              elStyle.replace("bg-red-500", "bg-green-500");
              elStyle.replace("hover:bg-red-800", "hover:bg-green-800");
              btnConvertTTS.innerText = "🔊 Reproduciendo...";
              state = false;
            } else {
              speechSynthesis.pause();
              elStyle.replace("bg-indigo-500", "bg-red-500");
              elStyle.replace("hover:bg-indigo-800", "hover:bg-red-800");
              elStyle.replace("bg-green-500", "bg-red-500");
              elStyle.replace("hover:bg-green-800", "hover:bg-red-800");
              btnConvertTTS.innerText = "🔈 Pausado...";
              state = true;
            }
          });

          //CONTROL THE TIMING FROM THE PROCESS
          setInterval(() => {
            if (!speechSynthesis.speaking && !state) {
              btnConvertTTS.innerText = "Gracias por la atención 😄!";
              btnConvertTTS.disabled = true;
              state = true;
            }
          }, 100);
        })
        .catch((err) => console.error(err));
    });

    recognition.start();
  });
};
