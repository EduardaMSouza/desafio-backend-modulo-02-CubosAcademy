const banco = require('../config/bancodedados');


class ContaController {
  static buscaContas(req, res, next) {
    try{
      const numeroContaDeContas = banco.contas.length;
      if(numeroContaDeContas === 0) {
        res.status(200).json({ mensagem: "Nenhuma conta encontrada" });
      }else{
        res.status(200).json({
          mensagem: `${numeroContaDeContas} contas encontradas`,
          Contas: banco.contas
        });

      }
    }catch(err){
      console.log(err.message);
    }
  }
  static cadastraConta(req, res, next) {
    try{
      const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;
      const emailRepedito = banco.contas.find((conta) => conta.usuario.email === email);
      const cpfRepetido = banco.contas.find((conta) => conta.usuario.cpf === cpf);
      if(!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
        res.status(400).json({ erro: "Dados obrigatórios não informados" });
      }else if(emailRepedito || cpfRepetido){
        res.status(400).json({ erro: "Já existe uma conta com esse CPF ou e-mail" });
      }
      else{
        const novaConta = {
          numero: String(banco.contas.length + 1),
          saldo: 0,
          usuario: {
            nome,
            cpf,
            data_nascimento,
            telefone,
            email,
            senha
          }
        };
        banco.contas.push(novaConta);
        res.status(201).send();
      }
    }catch(err){
      console.log(err.message);
    }
  }
  static atualizaConta(req, res, next) {
    try{
      const { numeroConta } = req.params;
      const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;
      const conta = banco.contas.find((conta) => conta.numero === String(numeroConta));
      const emailRepedito = banco.contas.find((conta) => conta.usuario.email === email);
      const cpfRepetido = banco.contas.find((conta) => conta.usuario.cpf === cpf);
      if(!conta) {
        res.status(404).json({ erro: "Conta não encontrada" });
      }else if(!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
        res.status(400).json({ erro: "Dados obrigatórios não informados" });
      }else if(emailRepedito || cpfRepetido){
        res.status(400).json({ erro: "Já existe uma conta com esse CPF ou e-mail" });
      }else{
        banco.contas[numeroConta-1].usuario.nome = nome;
        banco.contas[numeroConta-1].usuario.cpf = cpf;
        banco.contas[numeroConta-1].usuario.data_nascimento = data_nascimento;
        banco.contas[numeroConta-1].usuario.telefone = telefone;
        banco.contas[numeroConta-1].usuario.email = email;
        banco.contas[numeroConta-1].usuario.senha = senha;
        res.status(204).send();
      }
    }catch(err){
      console.log(err.message);
    }
  }
    static excluiConta(req, res, next) {
    try{
      const { numeroConta } = req.params;
      const conta = banco.contas.find((conta) => conta.numero === String(numeroConta));
      if(!conta) {
        res.status(400).json({ erro: "Conta não encontrada" });
      }else if(banco.contas[numeroConta-1].saldo !== 0) {
        res.status(400).json({ erro: "Conta não pode ser excluída porque ainda possui saldo" });
      }
      else{
        banco.contas.splice(numeroConta-1, 1);
        res.status(204).send();
      }
    }catch(err){
      console.log(err.message);
    }
  }
  static saldo(req, res, next) {
    try{
      const { numero_conta, senha } = req.query;
      const conta = banco.contas.find((conta) => conta.numero === String(numero_conta));
      if(!numero_conta || !senha) {
        res.status(400).json({ erro: "Informe todos os campos necessarios" });
      }else if(!conta) {
        res.status(404).json({ erro: "Conta não encontrada" });
      }else if(senha !== banco.contas[numero_conta-1].usuario.senha) {
        res.status(400).json({ erro: "Senha incorreta" });
      }else{
        res.status(200).json({ saldo: banco.contas[numero_conta-1].saldo });
      }
    }catch(err){
      console.log(err.message);
    }
  }
  static extrato(req, res, next) {
    try{
      const { numero_conta, senha } = req.query;
      const conta = banco.contas.find((conta) => conta.numero === String(numero_conta));
      if(!numero_conta || !senha) {
        res.status(400).json({ erro: "Informe todos os campos necessarios" });
      }else if(!conta) {
        res.status(404).json({ erro: "Conta não encontrada" });
      }else if(senha !== banco.contas[numero_conta-1].usuario.senha) {
        res.status(400).json({ erro: "Senha incorreta" });
      }else{
        const extrato = {
          depositos: banco.depositos.filter((deposito) => deposito.numero_conta === String(numero_conta)) || [],
          saques: banco.saques.filter((saque) => saque.numero_conta === String(numero_conta)) || [],
          transferenciasEnviadas: banco.transferencias.filter((transferencia) => transferencia.numero_conta_origem === String(numero_conta)) || [],
          transferenciasRecebidas: banco.transferencias.filter((transferencia) => transferencia.numero_conta_destino === String(numero_conta)) || []
        };
        res.status(200).json({Extrato: extrato});
      }
    }catch(err){
      console.log(err.message);
    }
  }
}


module.exports = ContaController;