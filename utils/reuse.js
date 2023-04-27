//ELEMENT BY ID
export const getById = (id) => document.getElementById(id);

//REFORMAT STRING FOR AI
export const reformatString = (string) => {
  //Todo a minúsculas
  let lowerCase = string.toLowerCase();
  //Eliminar carácteres especiales
  let noSpecial = lowerCase.replace(/[.,\/#!¡¿?$%\^&\*;:{}=\-_`~()]/g, "");
  //Eliminar acentos
  let noStress = noSpecial.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return noStress;
};
