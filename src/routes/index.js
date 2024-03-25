const { Router } = require('express');
const ContaController = require('../controllers/ContaController');
const autentica = require('../middleware/autenticacao');
const TransacoesController = require('../controllers/TransacoesController');

const router = Router();

router
  .get('/contas', autentica, ContaController.buscaContas)
  .put('/contas/:numeroConta/usuario', ContaController.atualizaConta)
  .post('/contas', ContaController.cadastraConta)
  .delete('/contas/:numeroConta', ContaController.excluiConta)
  .post('/transacoes/depositar', TransacoesController.deposita)
  .post('/transacoes/sacar', TransacoesController.sacar)
  .post('/transacoes/transferir', TransacoesController.transferir)
  .get('/transacoes/extrato', ContaController.extrato)
  .get('/contas/saldo', ContaController.saldo)

module.exports = router;