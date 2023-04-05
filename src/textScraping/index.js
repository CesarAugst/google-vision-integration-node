const path = require('path');
const vision = require("@google-cloud/vision");

const client = new vision.ImageAnnotatorClient({
  keyFilename: path.resolve('src', 'config', 'keys.json'),
})

/**
 *
 * Receive two Strings and returns the greater one.
 *
 * @param {String} text1
 * @param {String} text2
 * @returns The greater String
 */
function greaterString(text1, text2){
  //se o text1 for maior ou igual ao text2
  if (text1.length > text2.length || text1.length == text2.length) {
    //retorna text1
    return text1;
  } else {
    //retorn text2
    return text2;
  }
}

//desc: recebe uma imagem e faz requisicao para conversao de duas formas e compara quao obteve melhor resultado
//params: (img) imagem
//return: (stirng) texto da conversao
async function textScraping(image){
  //inicia tentativa
  try {
    //texto simples
    const text1 = await client.textDetection(image);
    //texto complexo (varredura mais intensa)
    const text2 = await client.documentTextDetection(image);
    //espera pelas duas requisicoes
    Promise.all([text1,text2]);
    //primeirp resultado removendo espacos e quebras de linhas
    const result1 = text1[0].fullTextAnnotation.text.replace(/ /g, "").replace(/\n/g, "");
    //segundo resultado removendo espacoes e quebras de linhas
    const result2 = text2[0].fullTextAnnotation.text.replace(/ /g, "").replace(/\n/g, "");
    //retorna a que tiver mais informacoes (string maior)
    return greaterString(result1, result2);
  } catch (error) { //caso houver erro
    //exibe o erro no console
    console.error(error);
    //lanca excessao
    throw error;
  }
}
//exporta a funcao
module.exports = textScraping;
