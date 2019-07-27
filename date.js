//module.exports é um objeto javascript, e vc pode adicionar módulos únicos, como atributos do objeto
//exports faz a mesma coisa, surgiu pela frequencia de uso.
exports.getDate = ()=>{
const today = new Date();

  const dateFormat = {
    weekday: "long",
    day: "numeric",
    month: "long"
  };
  return today.toLocaleDateString("en-US",dateFormat);
};

exports.getDay = ()=>{
  const today = new Date();
  
    const dateFormat = {
      weekday: "long",
    };
  
  return today.toLocaleDateString("en-US",dateFormat);
};