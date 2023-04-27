import { getById } from "../utils/reuse.js";

export const setLanguage = (language) => {
  getById("language").value = language;
};
