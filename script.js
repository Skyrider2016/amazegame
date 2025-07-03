let idCounter = 0;

function addAtor() {
  const lista = document.getElementById('listaAtos');

  const ator = document.createElement('div');

  ator.classList.add('ator');
  ator.dataset.id = idCounter++;
  ator.dataset.ciclo = 1;
  ator.dataset.tipo = "Neutro"

  ator.innerHTML = `
    <select class="tier">
      <option value="S">S</option>
      <option value="A">A</option>
      <option value="B">B</option>
      <option value="C">C</option>
      <option value="D">D</option>
    </select>
    <input type="text" class="nome">
    <input type="number" class="iniciativa">
    <button onclick="removerAtor(this)">X</button>

    
    Vida: <input type="number" class="vida"> /
    <input type="number" class="vida">
    Anot: <input type="text" class="anotacao">
    <button onclick="adicionarStatus(this)">🏷️</button>
    <div class="status-container"></div>
  `;


  // Adiciona os eventos para reorganizar apenas ao terminar de digitar ou sair do campo
    const inputIniciativa = ator.querySelector('.iniciativa');

    // Quando clica no campo, seleciona o texto automaticamente
    inputIniciativa.addEventListener('focus', function () {
    this.select();
    });

    // Reorganiza ao sair do campo
    inputIniciativa.addEventListener('blur', ordenarLista);

    // Reorganiza se pressionar Enter
    inputIniciativa.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        ordenarLista();
        this.blur(); // Sai do campo após confirmar
    }
    });

  lista.appendChild(ator);
}

function adicionarStatus(botao) {
  const container = botao.parentElement.querySelector('.status-container');

  const linha = document.createElement('div');
  linha.classList.add('status');
  linha.innerHTML = `
    🔖 <input type="text" class = "statusReal">
    <input type="number" class="duracao"> 
    <button onclick="removerAtor(this)">-</button>
  `;

  container.appendChild(linha);
}

function removerAtor(botao){
  botao.parentElement.remove()
}

function rolarTodasIniciativas() {
  const atores = document.querySelectorAll('.ator');

  atores.forEach(ator => {
    const tier = ator.querySelector('.tier').value;
    const iniciativaInput = ator.querySelector('.iniciativa');
    const valor = rolarDadoPorTier(tier);
    iniciativaInput.value = valor;
  });

  ordenarLista();

  atores.forEach(ator => {
    const iniciativaInput = ator.querySelector('.iniciativa');
    const valor = iniciativaInput.value
    iniciativaInput.value = valor - valor%10;
    ator.dataset.ciclo = Math.floor(valor/10 + 1)
  });
}

function rolarDadoPorTier(tier) {
  const dados = { S: 2, A: 4, B: 6, C: 8, D: 10 };
  const max = dados[tier] || 6;
  return Math.floor(Math.random() * max) + Math.floor(Math.random() * max) + Math.floor(Math.random() * max) + 3;
}

function ordenarLista() {
  const lista = document.getElementById('listaAtos');
  const atores = Array.from(lista.children);



  atores.sort((a, b) => {
    const aVal = a.dataset.ciclo || 1;
    const bVal = b.dataset.ciclo || 1;
    return bVal - aVal; // Ordem decrescente
  });
  

  atores.sort((a, b) => {
    const aVal = parseInt(a.querySelector('.iniciativa').value) || 0;
    const bVal = parseInt(b.querySelector('.iniciativa').value) || 0;
    return aVal - bVal; // Ordem decrescente
  });
  atores.forEach(ator => {
    ator.dataset.ciclo = Math.floor(parseInt(ator.querySelector('.iniciativa').value)/10 + 1)
    lista.appendChild(ator);
  });
}

function zeraIniciativa(){
  const inputsStatus = document.querySelectorAll(".duracao");
  const inputsInit = document.querySelectorAll(".iniciativa"); // seleciona todos os inputs com classe "vida"

  inputsStatus.forEach(input => {
    const valorAtual = parseInt(input.value) || 0; // transforma o valor em número
    input.value = Math.max(0, valorAtual - 10);     // reduz 10, sem deixar negativo
  });

    inputsInit.forEach(input => {
    const valorAtual = parseInt(input.value) || 0; // transforma o valor em número
    input.value = Math.max(0, valorAtual - valorAtual%10 - 10);     // reduz 10, sem deixar negativo
    input.parentElement.dataset.ciclo = input.value/10 + 1
  });
}
