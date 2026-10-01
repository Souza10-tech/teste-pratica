// Manter referências de memória fixas para o Jest
const clientes = []
const pets = []
const produtos = []
const carrinho = []

// Função utilitária para definir texto em elementos do DOM compatível com JSDOM
function definirTexto(elemento, texto) {
  if (!elemento) return
  elemento.innerText = texto
  elemento.textContent = texto
}

// --- CLIENTE ---
function criarCliente() {
  const nomeEl = document.getElementById("clienteNome")
  const emailEl = document.getElementById("clienteEmail")
  const vipEl = document.getElementById("clienteVip")

  const nome = nomeEl ? nomeEl.value : ""
  const email = emailEl ? emailEl.value : ""
  const vip = vipEl ? vipEl.checked : false

  if (!nome || nome.trim() === "") {
    alert("Nome inválido")
    return false
  }

  if (!email || !email.includes("@")) {
    alert("Email inválido")
    return false
  }

  const novoCliente = { nome, email, vip }
  clientes.push(novoCliente)
  renderClientes()
  return novoCliente
}

function renderClientes() {
  const listaClientes = document.getElementById("listaClientes")
  if (!listaClientes) return

  listaClientes.innerHTML = ""
  clientes.forEach(c => {
    const li = document.createElement("li")
    definirTexto(li, `${c.nome} - ${c.email}`)
    listaClientes.appendChild(li)
  })
}

// --- PET ---
function cadastrarPet() {
  const nomeEl = document.getElementById("petNome")
  const tipoEl = document.getElementById("petTipo")
  const idadeEl = document.getElementById("petIdade")

  const nome = nomeEl ? nomeEl.value : ""
  const tipo = tipoEl ? tipoEl.value : ""
  const idadeVal = idadeEl ? idadeEl.value : ""
  const idade = parseInt(idadeVal, 10)

  if (!nome || nome.trim() === "") {
    alert("Pet precisa de nome")
    return false
  }

  if (!tipo || tipo.trim() === "") {
    alert("Pet precisa de tipo")
    return false
  }

  if (isNaN(idade) || idade < 0) {
    alert("Idade inválida")
    return false
  }

  const novoPet = { nome, tipo, idade }
  pets.push(novoPet)
  renderPets()
  return novoPet
}

function renderPets() {
  const listaPets = document.getElementById("listaPets")
  if (!listaPets) return

  listaPets.innerHTML = ""
  pets.forEach(p => {
    const li = document.createElement("li")
    definirTexto(li, `${p.nome} (${p.tipo})`)
    listaPets.appendChild(li)
  })
}

// --- PRODUTOS ---
function criarProduto() {
  const nomeEl = document.getElementById("produtoNome")
  const precoEl = document.getElementById("produtoPreco")

  const nome = nomeEl ? nomeEl.value : ""
  const precoVal = precoEl ? precoEl.value : ""
  const preco = parseFloat(precoVal)

  if (!nome || nome.trim() === "") {
    alert("Produto precisa de nome")
    return false
  }

  if (isNaN(preco) || preco <= 0) {
    alert("Preço inválido")
    return false
  }

  const novoProduto = { nome, preco }
  produtos.push(novoProduto)
  renderProdutos()
  return novoProduto
}

function renderProdutos() {
  const listaProdutos = document.getElementById("listaProdutos")
  const produtoSelect = document.getElementById("produtoSelect")

  if (listaProdutos) listaProdutos.innerHTML = ""
  if (produtoSelect) produtoSelect.innerHTML = ""

  produtos.forEach((p, index) => {
    if (listaProdutos) {
      const li = document.createElement("li")
      definirTexto(li, `${p.nome} - R$ ${p.preco}`)
      listaProdutos.appendChild(li)
    }

    if (produtoSelect) {
      const option = document.createElement("option")
      option.value = index.toString()
      definirTexto(option, p.nome)
      produtoSelect.appendChild(option)
    }
  })
}

// --- CARRINHO ---
function adicionarCarrinho() {
  const produtoSelect = document.getElementById("produtoSelect")
  if (!produtoSelect || produtoSelect.value === "") return false

  const index = parseInt(produtoSelect.value, 10)
  const p = produtos[index]

  if (!p || typeof p.preco !== "number" || p.preco <= 0) {
    alert("Produto inválido para o carrinho")
    return false
  }

  carrinho.push(p)
  renderCarrinho()
  return true
}

function removerCarrinho() {
  if (carrinho.length === 0) return false
  const removido = carrinho.shift()
  renderCarrinho()
  return removido
}

function renderCarrinho() {
  const listaCarrinho = document.getElementById("listaCarrinho")
  if (listaCarrinho) {
    listaCarrinho.innerHTML = ""
    carrinho.forEach(p => {
      const li = document.createElement("li")
      definirTexto(li, `${p.nome} - R$ ${p.preco}`)
      listaCarrinho.appendChild(li)
    })
  }

  calcularTotal()
}

// --- TOTAL ---
function calcularTotal() {
  let total = 0
  carrinho.forEach(p => {
    total += p.preco
  })

  const totalEl = document.getElementById("total")

  if (carrinho.length === 0 || total === 0) {
    if (totalEl) definirTexto(totalEl, "0")
    return "0.00"
  }

  const isVip = clientes.some(c => c.vip === true) || 
                (document.getElementById("clienteVip") && document.getElementById("clienteVip").checked)

  if (isVip) {
    total *= 0.85
  } else if (total > 100) {
    total *= 0.90
  }

  const totalFormatado = total.toFixed(2)
  if (totalEl) definirTexto(totalEl, totalFormatado)

  return totalFormatado
}

// --- FINALIZAR COMPRA ---
function finalizarCompra() {
  const total = calcularTotal()
  alert("Compra finalizada: " + total)
  carrinho.length = 0
  renderCarrinho()
}

// --- CARROSSEL ---
let slideIndex = 0

function getSlideIndex() {
  return slideIndex
}

function nextSlide() {
  slideIndex++
  updateSlide()
}

function prevSlide() {
  slideIndex--
  updateSlide()
}

function updateSlide() {
  const slides = document.querySelector(".slides")
  const slidesList = document.querySelectorAll(".slide")
  if (!slides || slidesList.length === 0) return

  const total = slidesList.length
  if (slideIndex >= total) slideIndex = 0
  if (slideIndex < 0) slideIndex = total - 1

  slides.style.transform = `translateX(-${slideIndex * 100}%)`
}

if (typeof window !== "undefined") {
  window.criarCliente = criarCliente
  window.cadastrarPet = cadastrarPet
  window.criarProduto = criarProduto
  window.adicionarCarrinho = adicionarCarrinho
  window.removerCarrinho = removerCarrinho
  window.finalizarCompra = finalizarCompra
  window.nextSlide = nextSlide
  window.prevSlide = prevSlide
}

module.exports = {
  clientes,
  pets,
  produtos,
  carrinho,
  criarCliente,
  renderClientes,
  cadastrarPet,
  renderPets,
  criarProduto,
  renderProdutos,
  adicionarCarrinho,
  removerCarrinho,
  renderCarrinho,
  calcularTotal,
  finalizarCompra,
  slideIndex,
  getSlideIndex,
  nextSlide,
  prevSlide,
  updateSlide
}