import { setLanguage } from "../config/language.js";
import { setTheme } from "../config/theme.js";
import { arrQuestions } from "../data/questions.js";
import { getById, reformatString } from "../utils/reuse.js";

//LANGUAGE
const language = localStorage.getItem("language");
//THEME
const theme = localStorage.getItem("theme");

export const assistant = () => {
  getById("content").innerHTML = `
      <section class="p-8 flex flex-col items-center gap-8 bg-white rounded-lg">
        <h1 class="text-2xl font-bold">
          ¿Quieres saber más?, Pregúntale a Giorgio 🤖!!
        </h1>
        <img class="rounded-lg" src="https://www.ucss.edu.pe/images/fi/facultad-ingenieria-fi-ucss.jpg" alt="facultadIngenieria" />
        <div class="w-full relative">
          <button
            class="absolute px-3 py-2.5 right-2 bottom-2 bg-blue-500 hover:bg-blue-800 text-yellow-50 font-bold rounded-full"
            type="button" id="recordAudio">
            🎙️
          </button>
          <input class="w-full px-5 py-4 text-blue-900 font-bold border border-gray-500 rounded-3xl" type="text" id="convertText"
            placeholder="Preguntale a Giorgio..." />
        </div>
        <div id="nextContent"></div>
      </section>
  `;
  setTheme(theme);

  //MAIN VARIABLES
  const recordAudio = getById("recordAudio");

  recordAudio.addEventListener("click", () => {
    window.SpeechRecognition = window.webkitSpeechRecognition;

    const recognition = new SpeechRecognition();
    recognition.interimResults = true;
    recognition.lang = "es-PE";

    recognition.addEventListener("result", (e) => {
      const transcript = Array.from(e.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join("");

      getById("convertText").value = transcript;
      console.log(transcript);
    });

    recognition.addEventListener("start", (e) => {
      recordAudio.innerText = "🎙️ Escuchando...";
    });

    recognition.addEventListener("end", (e) => {
      recordAudio.innerText = "🎙️";

      let transcription = getById("convertText").value;
      let filtro = reformatString(transcription);
      console.log(filtro);

      let quest = arrQuestions.filter((el) => {
        for (let i = 0; i < el.keywords.length; i++) {
          if (filtro.includes(el.keywords[i])) return true;
        }
      });

      let speechVoice = new SpeechSynthesisUtterance();
      speechVoice.lang = language || "es-PE";
      let state = false;

      const noResults = (message) => {
        speechVoice.text = message;
        getById("nextContent").innerHTML = `
          <div class="px-5 py-2 bg-indigo-500 font-medium rounded-full">Lo sentimos, no hay respuesta para esa pregunta o enunciado 😥.</div>
        `;
        speechSynthesis.speak(speechVoice);
      };

      if (quest[0]) {
        let career = quest[0].choices.filter((el) => filtro.includes(el.name));
        if (career[0]) {
          speechVoice.text = career[0].res;
          speechSynthesis.speak(speechVoice);

          //GENERATE LIVE CONTENT
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
              <div
                class="absolute -left-5 -top-5 px-3 py-4 border-4 border-white bg-blue-500 text-yellow-100 text-4xl rounded-full">
                🤖
              </div>
              <p class="ml-10 text-right">${career[0].res}</p>
            </div>
            <div class="flex flex-col gap-4">
              <p class="text-xl font-bold">Algunas imagenes referenciales:</p>
              <div class="grid grid-cols-3 gap-4">
                <div class="col-span-2 row-span-2">
                  <img class="rounded-lg object-cover w-full h-full" src="${career[0].images[0]}" alt="image1" />
                </div>
                <div>
                  <img class="rounded-lg object-cover w-full h-full" src="${career[0].images[1]}" alt="image2" />
                </div>
                <div>
                  <img class="rounded-lg object-cover w-full h-full" src="${career[0].images[2]}" alt="image3" />
                </div>
              </div>
            </div>
          `;

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
              career[0].links.forEach((link) => window.open(link, "_blank"));
              btnConvertTTS.innerText = "Gracias por la atención 😄!";
              btnConvertTTS.disabled = true;
              state = true;
            }
          }, 100);
        } else {
          noResults(
            "Lamentablemente no hay resultados para esa pregunta, porfavor prueba con otra relacionada a la facultad de ingeniería."
          );
        }
      } else {
        noResults(
          "No hay resultados para lo que dices, porfavor trata de ser más específico al formular la pregunta o prueba con otra relacionada a la facultad de ingeniería."
        );
      }
    });

    recognition.start();
  });
};
