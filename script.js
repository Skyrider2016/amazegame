let idCounter = 0;
let countInit = false

function addAtor() {
  const lista = document.getElementById('listaAtos');

  const ator = document.createElement('div');

  ator.classList.add('ator');
  ator.dataset.id = idCounter++;
  ator.dataset.ciclo = 1;
  ator.dataset.tipo = "Neutro"

  ator.innerHTML = `
    <div class="linha">
      <select class="tier">
        <option value="S">S</option>
        <option value="A">A</option>
        <option value="B">B</option>
        <option value="C">C</option>
        <option value="D">D</option>
      </select>
      <input type="text" class="nome">
      <input type="number" class="iniciativa">
      <button class="botao-pequeno" onclick="trocarTipo(this)"></button>
      <button onclick="removerAtor(this)" class="botao-imagem">
        <img src="delete.png" alt="Botão" class="imagem-do-botao">
      </button>
    </div>
    <div class="linha" style="margin-top: 5px;">
      Vida: <input type="number" class="vida"> /
      <input type="number" class="vida">
      Anot.: <input type="text" class="anotacao">
      <button onclick="adicionarStatus(this)" class="botao-imagem">
        <img src="addEffect.png" alt="Botão" class="imagem-do-botao">
      </button>
    </div>
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
  
  const container = botao.parentElement.parentElement.querySelector('.status-container');

  const linha = document.createElement('div');
  linha.classList.add('status');
  linha.innerHTML = `
    <img src="effect.png" alt="Status" class="imagem-do-botao"> <input type="text" class = "statusReal">
    <input type="number" class="duracao"> 
    <button onclick="removerAtor(this)" class="botao-imagem">
      <img src="deleteEffect.png" alt="Botão" class="imagem-do-botao">
    </button>
  `;

  container.appendChild(linha);
}

function trocarTipo(botao){
  const ator = botao.parentElement.parentElement
  const tipo = ator.dataset.tipo
  if(tipo == "Neutro"){
    ator.dataset.tipo = "Aliado"
    botao.style.background = '#19d600'; // muda para Verde
    botao.style.borderColor = '#0c7c00'
    ator.style.backgroundColor = '#095302'
    ator.style.borderColor = '#19d600'

  }else if(tipo == "Aliado"){
    ator.dataset.tipo = "Inimigo"
    botao.style.background = '#ff0000'; // muda para vermelho
    botao.style.borderColor = '#b50000'
    ator.style.backgroundColor = '#710000'
    ator.style.borderColor = '#d60000'

  }else if(tipo == "Inimigo"){
    ator.dataset.tipo = "Ambiente"
    botao.style.background = '#ffff00'; // muda para Amarelo
    botao.style.borderColor = '#c3c31b'
    ator.style.backgroundColor = '#5f5f49'
    ator.style.borderColor = '#bebe1e'
    

  }else {
    ator.dataset.tipo = "Neutro"
    botao.style.background = '#505050'; // muda para Cinza
    botao.style.borderColor = '#000000'
    ator.style.backgroundColor = '#505050'
    ator.style.borderColor = '#bebebe'

  }
  ordenarLista()
}

function removerAtor(botao){
  botao.parentElement.remove()
}


function rolarTodasIniciativas() {
  documentarHist("Rolando Iniciativas")
  const atores = document.querySelectorAll('.ator');

  atores.forEach(ator => {
    const tier = ator.querySelector('.tier').value;
    const iniciativaInput = ator.querySelector('.iniciativa');
    let valor = rolarDadoPorTier(ator.querySelector('.nome').value , tier);
    iniciativaInput.value = valor;
  });

  ordenarLista();

  atores.forEach(ator => {
    const iniciativaInput = ator.querySelector('.iniciativa');
    let valor = iniciativaInput.value
    
    //valor-= valor%10
    iniciativaInput.value = valor
    ator.dataset.ciclo = valor
  });
  countInit = true
}

function rolarDadoPorTier(nome, tier) {
  
  const dados = { S: 2, A: 4, B: 6, C: 8, D: 10 };
  const max = dados[tier] || 6;
  let result = 0
  let dadoText = nome +` rolou 3d${max}(`
  let valor

  for(i=1;i<=3;i++){
    valor = Math.floor(Math.random() * max) + 1
    result+= valor
    if(i<3){
      dadoText+= `${valor} + `
    }else{
      dadoText+= `${valor} = ${result})`
    }
  }
  
  documentarHist(dadoText)
  return  result;
}

function ordenarLista() {
  const lista = document.getElementById('listaAtos');
  const atores = Array.from(lista.children);



  atores.sort((a, b) => {
    const aVal = a.dataset.ciclo || 0;
    const bVal = b.dataset.ciclo || 0;
    return bVal - aVal; // Ordem decrescente
  });
  

  atores.sort((a, b) => {
    const aVal = parseInt(a.querySelector('.iniciativa').value) || 0;
    const bVal = parseInt(b.querySelector('.iniciativa').value) || 0;
    return (aVal + (a.dataset.tipo == "Inimigo" ? 0.5 : 0)) - (bVal + (b.dataset.tipo == "Inimigo" ? 0.5 : 0)); // Ordem decrescente
  });
  atores.forEach(ator => {
    ator.dataset.ciclo = parseInt(ator.querySelector('.iniciativa').value)
    lista.appendChild(ator);
  });
}

function zeraIniciativa(){
  const inputsStatus = document.querySelectorAll(".duracao");
  const inputsInit = document.querySelectorAll(".iniciativa"); // seleciona todos os inputs com classe "vida"
 
  inputsStatus.forEach(input => {
    if(input.value!=null){
      let valorAtual = parseInt(input.value)
      valorAtual -= 10
      if(valorAtual<=0){
        documentarHist(`Status ${input.parentElement.querySelector('.statusReal').value} de ${input.parentElement.parentElement.parentElement.querySelector('.nome').value} chegou ao fim`)
        removerAtor(input)
        }else{
        input.value = valorAtual;
      }
    }
  });

    inputsInit.forEach(input => {
    const valorAtual = parseInt(input.value) || 0; // transforma o valor em número
    input.value = Math.max(0, valorAtual - valorAtual%10 - (countInit ? 0 : 10));     // reduz 10, sem deixar negativo
    input.parentElement.dataset.ciclo = input.value/10 + 1
  });
  countInit = false
}

function documentarHist(texto){
  const data = new Date()
  const hora = String(data.getHours()).padStart(2, '0')
  const min = String(data.getMinutes()).padStart(2, '0')
  const sec = String(data.getSeconds()).padStart(2, '0')
  const dataText = "("+hora + ":" + min + ":" +sec +")"
  const hist = document.querySelector(".historico");
  hist.innerHTML += dataText + ": " + texto + "<br>"
  hist.scrollTop = hist.scrollHeight;
}
