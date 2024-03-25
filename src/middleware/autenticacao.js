const banco = require('../config/bancodedados');

module.exports = (req, res, next) => {
    const { senha_banco } = req.query;
if(!senha_banco) {
    res.status(400).json({ erro: "Senha do banco não informada" });
}else if(senha_banco !== banco.banco.senha) {
  res.status(400).json({ erro: "Senha do banco incorreta" });
}else{
    next();
}
}
