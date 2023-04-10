/*Componentes default */
const express = require("express");
const multer = require("multer");
const cors = require("cors");
/*Componentes custom*/
const textScraping = require("./textScraping");
//inicia o express
const app = express();
// configuracao do multer
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 1024 * 1024 * 10,
  },
})
//porta do servidor
const PORT = 3002;

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

//rota raiz
app.post("/", upload.single('img'), async (req, res, next) => {
  //marca o inicio da execucao
  const initialTime = new Date().getTime();

  //inicia tentativa
  try {
    //declara a imagem
    var image = "";
    //se recebeu url como query params
    if(req.query.url) {
      //recebe imagem
      image = req.query.url;
    }else {
      //recebe imagem
      image = req.file.buffer;
    }
    //se nao houver imagem
    if (!image)
      next(new Error("There is no image"));
    //usa a varredura na imagem recebida
    const text = await textScraping(image);

    //armazena dados comparativos
    store_comparative_result(initialTime, text)

    //retorna 200 com a resposta da requisicao de varredura no corpo
    res.status(200).send(text);
    } catch (error) { //se houve erro
      //exibe o erro
      console.error(error);
      next(error);
    }
})

// server
app.listen(PORT, () => {
  //mensagem exibida ao iniciar o servidor
  console.log(`Server running on http://localhost:${PORT}/`);
});

//desc: gerencia o armazenamento do resultado para fins de comparacaao
//parasm: (time) tempo inicial, (string) resultado da conversao
//return: nenhum
function store_comparative_result(initialTime, result_translate){
  //instancia do fileSync
  const fs = require('fs');

  //caminho para salvar resultados
  const path = "./results";
  //se o caminho do diretorio nao existir
  if(!fs.existsSync(path)){
    //cria o diretorio
    fs.mkdirSync(path);
  }

  //junta o tempo gasto com o resultado da conversao
  const array_data = {
    'tempo_gasto': (new Date().getTime() - initialTime) / 1000,
    'resultado': result_translate
  };

  //salva em arquivo
  fs.writeFileSync(`${path}/google-node-api`, JSON.stringify(array_data)); //armazena resultado

}
