import { getById } from "../utils/reuse.js";

export const setTheme = (theme) => {
  getById("theme").value = theme;

  //Change tailwind classes dynamically
  const changeTheme = (attribute, light, dark) => {
    document
      .querySelectorAll(attribute)
      .forEach((el) => el.classList.replace(light, dark));
  };

  if (theme === "light") {
    changeTheme(".bg-blue-700", "bg-blue-700", "bg-gray-500");
    changeTheme(".bg-blue-800", "bg-blue-800", "bg-gray-400");
    changeTheme(".bg-blue-600", "bg-blue-600", "bg-gray-100");
    changeTheme(".text-white", "text-white", "text-black");
    changeTheme(".bg-black", "bg-black", "bg-white");
  } else {
    changeTheme(".bg-blue-500", "bg-blue-500", "bg-gray-700");
    changeTheme(".bg-blue-400", "bg-blue-400", "bg-gray-800");
    changeTheme(".bg-blue-100", "bg-blue-100", "bg-gray-600");
    changeTheme(".text-black", "text-black", "text-white");
    changeTheme(".bg-white", "bg-white", "bg-black");
  }
};
