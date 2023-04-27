import { getById } from "./utils/reuse.js";
import { setTheme } from "./config/theme.js";
import { setLanguage } from "./config/language.js";
import { mainPage } from "./data/firstContent.js";
import { translator } from "./js/translator.js";
import { assistant } from "./js/assistant.js";
import { playground } from "./js/playground.js";

//BASIC CONFIGURATIONS
//LANGUAGE
const language = localStorage.getItem("language");
setLanguage(language || "es-PE");
//THEME
const theme = localStorage.getItem("theme");
setTheme(theme || "light");

//SETTINGS
getById("btnSaveSettings").addEventListener("click", () => {
  //LANGUAGE
  const language = getById("language").value;
  localStorage.setItem("language", language);
  //THEME
  const theme = getById("theme").value;
  localStorage.setItem("theme", theme);

  location.reload();
});

getById("assistantOption").addEventListener("click", assistant);

getById("playgroundOption").addEventListener("click", playground);

getById("translatorOption").addEventListener("click", translator);
