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
const PORT = 3000;

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

//rota raiz
app.post("/", upload.single('img'), async (req, res, next) => {
  //inicia tentativa
  try {
    //recebe imagem
    const image = req.file;
    //se nao houver imagem
    if (!image)
        next(new Error("There is no image"));
    //usa a varredura na imagem recebida
    const text = await textScraping(image.buffer);
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
