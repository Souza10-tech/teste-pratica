/**
 * @jest-environment jsdom
 */

const fs = require('fs')
const path = require('path')

const html = fs.readFileSync(path.resolve(__dirname, './index.html'), 'utf8')

describe('Suíte de Testes Práticos de Petshop', () => {
  let app

  beforeEach(() => {
    document.documentElement.innerHTML = html.toString()
    jest.resetModules()
    app = require('./app.js')

    jest.spyOn(window, 'alert').mockImplementation(() => {})

    app.clientes.length = 0
    app.pets.length = 0
    app.produtos.length = 0
    app.carrinho.length = 0

    window.criarCliente = app.criarCliente
    window.cadastrarPet = app.cadastrarPet
    window.criarProduto = app.criarProduto
    window.adicionarCarrinho = app.adicionarCarrinho
    window.removerCarrinho = app.removerCarrinho
    window.finalizarCompra = app.finalizarCompra
    window.nextSlide = app.nextSlide
    window.prevSlide = app.prevSlide
  })

  // 1. CLIENTES
  test('1. Deve criar cliente com dados válidos', () => {
    document.getElementById('clienteNome').value = 'Carlos Silva'
    document.getElementById('clienteEmail').value = 'carlos@test.com'
    app.criarCliente()
    expect(app.clientes).toHaveLength(1)
    expect(app.clientes[0].nome).toBe('Carlos Silva')
  })

  test('2. Não deve criar cliente com nome vazio', () => {
    document.getElementById('clienteNome').value = ''
    document.getElementById('clienteEmail').value = 'carlos@test.com'
    app.criarCliente()
    expect(app.clientes).toHaveLength(0)
    expect(window.alert).toHaveBeenCalledWith('Nome inválido')
  })

  test('3. Deve validar email do cliente', () => {
    document.getElementById('clienteNome').value = 'Ana Souza'
    document.getElementById('clienteEmail').value = 'ana@dominio.com'
    app.criarCliente()
    expect(app.clientes[0].email).toBe('ana@dominio.com')
  })

  test('4. Não deve criar cliente com email inválido', () => {
    document.getElementById('clienteNome').value = 'Ana Souza'
    document.getElementById('clienteEmail').value = 'emailinvalido'
    app.criarCliente()
    expect(app.clientes).toHaveLength(0)
    expect(window.alert).toHaveBeenCalledWith('Email inválido')
  })

  test('5. Deve registrar se cliente é VIP', () => {
    document.getElementById('clienteNome').value = 'Beatriz VIP'
    document.getElementById('clienteEmail').value = 'beatriz@vip.com'
    document.getElementById('clienteVip').checked = true
    app.criarCliente()
    expect(app.clientes[0].vip).toBe(true)
  })

  // 2. PETS
  test('6. Deve cadastrar pet com sucesso', () => {
    document.getElementById('petNome').value = 'Rex'
    document.getElementById('petTipo').value = 'Cachorro'
    document.getElementById('petIdade').value = '3'
    app.cadastrarPet()
    expect(app.pets).toHaveLength(1)
    expect(app.pets[0].nome).toBe('Rex')
  })

  test('7. Não deve cadastrar pet sem nome', () => {
    document.getElementById('petNome').value = ''
    document.getElementById('petTipo').value = 'Cachorro'
    document.getElementById('petIdade').value = '3'
    app.cadastrarPet()
    expect(app.pets).toHaveLength(0)
    expect(window.alert).toHaveBeenCalledWith('Pet precisa de nome')
  })

  test('8. Não deve cadastrar pet sem tipo', () => {
    document.getElementById('petNome').value = 'Mimi'
    document.getElementById('petTipo').value = ''
    document.getElementById('petIdade').value = '2'
    app.cadastrarPet()
    expect(app.pets).toHaveLength(0)
    expect(window.alert).toHaveBeenCalledWith('Pet precisa de tipo')
  })

  test('9. Não deve cadastrar pet com idade inválida', () => {
    document.getElementById('petNome').value = 'Thor'
    document.getElementById('petTipo').value = 'Cachorro'
    document.getElementById('petIdade').value = 'abc'
    app.cadastrarPet()
    expect(app.pets).toHaveLength(0)
    expect(window.alert).toHaveBeenCalledWith('Idade inválida')
  })

  // 3. PRODUTOS
  test('10. Deve criar produto com sucesso', () => {
    document.getElementById('produtoNome').value = 'Ração 10kg'
    document.getElementById('produtoPreco').value = '50'
    app.criarProduto()
    expect(app.produtos).toHaveLength(1)
    expect(app.produtos[0].nome).toBe('Ração 10kg')
  })

  test('11. Não deve criar produto com preço zero', () => {
    document.getElementById('produtoNome').value = 'Brinquedo'
    document.getElementById('produtoPreco').value = '0'
    app.criarProduto()
    expect(app.produtos).toHaveLength(0)
    expect(window.alert).toHaveBeenCalledWith('Preço inválido')
  })

  test('12. Não deve criar produto com preço negativo', () => {
    document.getElementById('produtoNome').value = 'Shampoo'
    document.getElementById('produtoPreco').value = '-15'
    app.criarProduto()
    expect(app.produtos).toHaveLength(0)
    expect(window.alert).toHaveBeenCalledWith('Preço inválido')
  })

  test('13. Deve cadastrar produto e atualizar lista na tela', () => {
    document.getElementById('produtoNome').value = 'Coleira'
    document.getElementById('produtoPreco').value = '25'
    app.criarProduto()
    const lista = document.getElementById('listaProdutos')
    expect(lista.innerHTML).toContain('Coleira - R$ 25')
  })

  // 4. CARRINHO E COMPRAS
  test('14. Deve adicionar produto selecionado ao carrinho', () => {
    app.produtos.push({ nome: 'Ração', preco: 50 })
    app.renderProdutos()
    document.getElementById('produtoSelect').value = '0'
    app.adicionarCarrinho()
    expect(app.carrinho).toHaveLength(1)
    expect(app.carrinho[0].nome).toBe('Ração')
  })

  test('15. Deve remover produto do carrinho', () => {
    app.carrinho.push({ nome: 'Ração', preco: 50 })
    app.renderCarrinho()
    app.removerCarrinho()
    expect(app.carrinho).toHaveLength(0)
  })

  test('16. Deve atualizar a lista de itens no carrinho', () => {
    app.carrinho.push({ nome: 'Ração', preco: 50 })
    app.carrinho.push({ nome: 'Petisco', preco: 10 })
    app.renderCarrinho()
    const listaCarrinho = document.getElementById('listaCarrinho')
    expect(listaCarrinho.children.length).toBe(2)
    expect(listaCarrinho.innerHTML).toContain('Ração')
    expect(listaCarrinho.innerHTML).toContain('Petisco')
  })

  test('17. Deve calcular o valor total das compras', () => {
    app.carrinho.push({ nome: 'Item 1', preco: 30 })
    app.carrinho.push({ nome: 'Item 2', preco: 40 })
    const total = app.calcularTotal()
    expect(total).toBe('70.00')
  })

  test('18. Deve aplicar 10% de desconto para compras acima de R$100', () => {
    app.carrinho.push({ nome: 'Produto Caro', preco: 150 })
    const total = app.calcularTotal()
    expect(total).toBe('135.00')
  })

  test('19. Cliente VIP deve receber desconto de 15%', () => {
    app.clientes.push({ nome: 'Cliente VIP', email: 'vip@test.com', vip: true })
    app.carrinho.push({ nome: 'Produto', preco: 100 })
    const total = app.calcularTotal()
    expect(total).toBe('85.00')
  })

  test('20. Carrinho não deve aceitar produto com preço igual a zero', () => {
    app.produtos.push({ nome: 'Produto Grátis', preco: 0 })
    app.renderProdutos()
    document.getElementById('produtoSelect').value = '0'
    app.adicionarCarrinho()
    expect(app.carrinho).toHaveLength(0)
    expect(window.alert).toHaveBeenCalledWith('Produto inválido para o carrinho')
  })

  test('21. Deve resetar/zerar o total para zero quando o carrinho estiver vazio', () => {
    const total = app.calcularTotal()
    expect(total).toBe('0.00')
    expect(document.getElementById('total').innerText).toBe('0')
  })

  test('22. Finalizar compra deve esvaziar o carrinho e atualizar a interface', () => {
    app.carrinho.push({ nome: 'Produto', preco: 50 })
    app.renderCarrinho()
    app.finalizarCompra()
    expect(app.carrinho).toHaveLength(0)
    expect(document.getElementById('listaCarrinho').children.length).toBe(0)
  })

  test('23. Deve alternar os slides do carrossel corretamente', () => {
    expect(app.getSlideIndex()).toBe(0)
    app.nextSlide()
    expect(app.getSlideIndex()).toBe(1)
  })

  test('24. Os botões Adicionar / Remover / Finalizar devem funcionar corretamente', () => {
    app.produtos.push({ nome: 'Osso', preco: 20 })
    app.renderProdutos()
    document.getElementById('produtoSelect').value = '0'

    const cardCarrinho = document.querySelectorAll('.card')[3]
    const botoes = cardCarrinho.querySelectorAll('button')
    const btnAdicionar = botoes[0]
    const btnRemover = botoes[1]
    const btnFinalizar = botoes[2]

    btnAdicionar.click()
    expect(app.carrinho).toHaveLength(1)

    btnRemover.click()
    expect(app.carrinho).toHaveLength(0)

    btnAdicionar.click()
    btnFinalizar.click()
    expect(app.carrinho).toHaveLength(0)
  })
})