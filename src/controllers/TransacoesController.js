const banco = require("../config/bancodedados");
const { format } = require("date-fns");


class TransacoesController {
  static deposita(req, res, next) {
    try{
      const { valor, numero_conta } = req.body;
      const conta = banco.contas.find((conta) => conta.numero === String(numero_conta));
      if(!valor || !numero_conta) {
        res.status(400).json({ erro: "Valor ou conta não informados" });
      }else if(!conta) {
        res.status(404).json({ erro: "Conta não encontrada" });
      }else if(valor <= 0){
        res.status(400).json({ erro: "Valor inválido" });
      }else{
        const data = new Date();
        banco.contas[numero_conta-1].saldo += valor;
        banco.depositos.push({
          data: formataData(),
          numero_conta: String(numero_conta),
          valor
        });
        res.status(204).send();
      }
    }catch(err){
      console.log(err.message);
    }
  }
  static async sacar(req, res, next) {
    try{
      const { valor, senha, numero_conta } = req.body;
      const conta = banco.contas.find((conta) => conta.numero === String(numero_conta));
      if(!valor || !senha || !numero_conta){
        res.status(400).json({ erro: "Valor ou senha não informados" });
      }else if(!conta) {
        res.status(404).json({ erro: "Conta não encontrada" });
      }else if(banco.contas[numero_conta-1].usuario.senha !== senha){
        res.status(400).json({ erro: "Senha incorreta" });
      }else if(valor <= 0){
        res.status(400).json({ erro: "Valor inválido" });
      }else if(valor > banco.contas[numero_conta-1].saldo){
        res.status(400).json({ erro: "Saldo insuficiente" });
      }else{
        banco.contas[numero_conta-1].saldo -= valor;
        banco.saques.push({
          data: formataData(),
          numero_conta: String(numero_conta),
          valor
        });
        res.status(204).send();
      }
    }catch(err){
      console.log(err.message);
    }
  }

  static transferir(req, res, next) {
    try{
      const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body;
      const contaOrigem = banco.contas.find((conta) => conta.numero === String(numero_conta_origem));
      const contaDestino = banco.contas.find((conta) => conta.numero === String(numero_conta_destino));
      if(!valor || !senha || !numero_conta_origem || !numero_conta_destino){
        res.status(400).json({ erro: "Informe todos os campos necessarios" });
      }else if(!contaOrigem || !contaDestino) {
        res.status(404).json({ erro: "Informe contas validas" });
      }else if(banco.contas[numero_conta_origem-1].usuario.senha !== senha){
        res.status(400).json({ erro: "Senha incorreta" });
      }else if(valor <= 0){
        res.status(400).json({ erro: "Valor inválido" });
      }else if(valor > banco.contas[numero_conta_origem-1].saldo){
        res.status(400).json({ erro: "Saldo insuficiente" });
      }else{
        banco.contas[numero_conta_origem-1].saldo -= valor;
        banco.contas[numero_conta_destino-1].saldo += valor;
        banco.transferencias.push({
          data: formataData(),
          numero_conta_origem: String(numero_conta_origem),
          numero_conta_destino: String(numero_conta_destino),
          valor
        });
        res.status(204).send();
      }
    }catch(err) {
      console.log(err.message);
    }
  }

}

function formataData() {
  return format(new Date(), "dd/MM/yyyy HH:mm:ss");
}


module.exports = TransacoesController;