// Definir a estrutura de memória como uma lista vazia
let memoriaAgente = [];
let casasVisitadas = [];
var jogoEmAndamento = true;
// Obtém o modal
// Variável para armazenar o tipo de agente selecionado
var selectedAgent = null;
var modal = document.getElementById("myModal");
var modal2 = document.getElementById("myModal2");
// Obtém os botões do modal
var outroAgenteBtn = document.getElementById("outroAgenteBtn");
var jogarNovamenteBtn = document.getElementById("jogarNovamenteBtn");
// Adiciona event listeners aos botões
outroAgenteBtn.addEventListener("click", function() {
    console.log("entrou")
    changeAgent(); // Escolher outro agente
    modal.style.display = "none"; // Esconder o modal
    location.reload(); // Recarregar a página
});
jogarNovamenteBtn.addEventListener("click", function() {
    gerarTabuleiro(); // Jogar novamente
    jogoEmAndamento = true;
    modal.style.display = "none"; // Esconder o modal
    location.reload(); // Recarregar a página
});
document.addEventListener("DOMContentLoaded", function() {
    outroAgenteBtn.addEventListener("click", function() {
        console.log("Entrou em outroAgenteBtn");
        changeAgent(); // Escolher outro agente
        modal2.style.display = "none"; // Esconder o modal
        location.reload(); // Recarregar a página
    });
    jogarNovamenteBtn.addEventListener("click", function() {
        console.log("Entrou em jogarNovamenteBtn");
        gerarTabuleiro(); // Jogar novamente
        jogoEmAndamento = true;
        modal2.style.display = "none"; // Esconder o modal
    });
});
var directions = ['cima', 'baixo', 'esquerda', 'direita'];
var generations = 10;
var mutationRate = 0.05;
var bestPath = [];
// Gerar população de agentes temporários
var populacaoAgentes = []
var novaPopulacao = []
var novaPopulacao2 = []
var taxaCruzamento = 0.85
var populacaoAposCruzamento = []
var paisTerminaramDeAndar = 0;
// Verificar quando todos os agentes terminaram de andar
var agentesTerminaramDeAndar = 0;
var jogoEmAndamento = true;
// Definindo variáveis globais para estatísticas e posição do agente
var numPits, numBreezes, numStenches, numGold, numMonsters, numArrows;
var agentRow, agentCol, agentPoints;
var numGoldPieces = 7;
var numMonsterPieces = 3;
let tamanhoTabuleiro = 0
let passosDados = 0;
let flechasGastas = 0;
let matouMonstro = 0;
let caiuEmPoco = 0;
let ourosPegos = 0;
let MortoPorMonstro = 0
let QuantMonstroKill = 0
let resposta1 = ''
    // -----------
let resposta2 = ''
let resposta3 = ''
    // Definindo os símbolos para representar as variáveis
var agentSymbol = 'A';
var monsterSymbol = 'M';
var pitSymbol = 'P';
var breezeSymbol = 'B';
var stenchSymbol = 'S';
var flecha = 'F';
var goldSymbol = 'G';
var emptySymbol = 'V'; // Símbolo para células vazias
var retornandoParaCasa = false;

function changeAgent() {
    selectedAgent = document.getElementById("selectAgent").value;
}


function gerarTabuleiro3D() {
    var numPits = 0;
    var numBreezes = 0;
    var numStenches = 0;
    var numGold = 0;
    var numMonsters = 0;
    var numArrows = 40;
    var agentPoints = 1400;

    var musicas = [
        'music/Cauldron Boss music [Minecraft Dungeons OST].mp4',
        'music/Full Metal Alchemist Opening 1_ MELISSA GUITAR COVER.mp4',
        'music/Minecraft Dungeons OST- 15 Caravan.mp4',
        'music/Steppe - Minecraft Dungeons_ Flames of the Nether.mp4',
        'music/Undertale OST_ 090 - His Theme.mp4',
        'music/Untold - Minecraft Dungeons- Flames of the Nether.mp4'
    ];

    var indiceMusica = Math.floor(Math.random() * musicas.length);
    var urlMusica = musicas[indiceMusica];
    var audio = document.getElementById('musica');
    if (!audio.paused) {
        audio.pause();
    }
    audio.src = urlMusica;
    audio.currentTime = 0;
    audio.play();

    var size = parseInt(document.getElementById('size').value);
    var cube = document.getElementById('tabuleiro');
    var casasVisitadas = [];

    var offset = 95; // Adjust as needed for spacing and positioning

    // Clear previous content
    cube.innerHTML = '';

    // Generate the cube with blocks and assign weights as requested
    for (let z = 0; z < size; z++) {
        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                const block = document.createElement('div');
                block.classList.add('block');
                block.style.transform = `translate3d(${x * offset}px, ${y * offset}px, ${z * offset}px)`;

                // Create block faces
                const faces = ['front', 'back', 'left', 'right', 'top', 'bottom'];
                const faceSymbols = {}; // Object to store face symbols of the block
                faces.forEach(faceClass => {
                    const face = document.createElement('div');
                    face.classList.add('face', faceClass);
                    faceSymbols[faceClass] = document.createElement('div');
                    faceSymbols[faceClass].classList.add('face-content');
                    face.appendChild(faceSymbols[faceClass]);
                    block.appendChild(face);
                });

                // Place portals in every layer
                if (z === 0) {
                    const portaAcima = document.createElement('div');
                    portaAcima.classList.add('portaAcima');
                    block.appendChild(portaAcima);
                }
                if (z === size - 1) {
                    const portaAbaixo = document.createElement('div');
                    portaAbaixo.classList.add('portaAbaixo');
                    block.appendChild(portaAbaixo);
                }

                cube.appendChild(block);
            }
        }
    }

    var agentRow = 0;
    var agentCol = 0;
    var agentDepth = 0; // Ensure you initialize this variable correctly if it's used
    var agentIndex = agentRow * size * size + agentCol * size + agentDepth;
    var agentBlock = cube.querySelector(`.block:nth-child(${agentIndex + 1})`);
    if (agentBlock) {
        const agentFaces = agentBlock.querySelectorAll('.face-content');
        agentFaces.forEach(face => {
            face.textContent = agentSymbol + flecha + emptySymbol;
            face.style.backgroundColor = getFaceColor('A'); // Example function to get color based on symbol
        });
        casasVisitadas.push({
            linha: agentRow,
            coluna: agentCol,
            profundidade: agentDepth
        });
    } else {
        console.error('Erro ao encontrar o bloco do agente.');
    }

    // Place multiple gold pieces at random positions
    for (var g = 0; g < numGoldPieces; g++) {
        var goldRow, goldCol, goldDepth;
        do {
            goldRow = Math.floor(Math.random() * size);
            goldCol = Math.floor(Math.random() * size);
            goldDepth = Math.floor(Math.random() * size);
        } while ((goldRow === agentRow && goldCol === agentCol && goldDepth === agentDepth));

        var goldIndex = goldRow * size * size + goldCol * size + goldDepth;
        var goldBlock = cube.querySelector(`.block:nth-child(${goldIndex + 1})`);
        const goldFaces = goldBlock.querySelectorAll('.face-content');
        goldFaces.forEach(face => {
            face.textContent = goldSymbol;
            face.style.backgroundColor = getFaceColor('G'); // Example function to get color based on symbol
        });
        numGold++;
    }

    // Generate pits and breezes
    var maxPits = size - 1; // Maximum number of pits
    for (var k = 0; k < maxPits; k++) {
        var pitRow, pitCol, pitDepth;
        do {
            pitRow = Math.floor(Math.random() * size);
            pitCol = Math.floor(Math.random() * size);
            pitDepth = Math.floor(Math.random() * size);
        } while ((pitRow === agentRow && pitCol === agentCol && pitDepth === agentDepth) ||
            (pitRow === goldRow && pitCol === goldCol && pitDepth === goldDepth));

        var pitIndex = pitRow * size * size + pitCol * size + pitDepth;
        var pitBlock = cube.querySelector(`.block:nth-child(${pitIndex + 1})`);
        const pitFaces = pitBlock.querySelectorAll('.face-content');
        pitFaces.forEach(face => {
            face.textContent = pitSymbol;
            face.style.backgroundColor = getFaceColor('P'); // Example function to get color based on symbol
        });
        numPits++;

        // Place breezes around the pit
        for (let zOffset = -1; zOffset <= 1; zOffset++) {
            for (let yOffset = -1; yOffset <= 1; yOffset++) {
                for (let xOffset = -1; xOffset <= 1; xOffset++) {
                    if (Math.abs(zOffset) + Math.abs(yOffset) + Math.abs(xOffset) === 1) { // Ensure it's adjacent
                        const z = pitDepth + zOffset;
                        const y = pitRow + yOffset;
                        const x = pitCol + xOffset;
                        if (z >= 0 && z < size && y >= 0 && y < size && x >= 0 && x < size) {
                            const index = y * size * size + x * size + z;
                            const block = cube.querySelector(`.block:nth-child(${index + 1})`);
                            if (block) {
                                const frontFace = block.querySelector('.face.front .face-content');
                                const backFace = block.querySelector('.face.back .face-content');
                                const leftFace = block.querySelector('.face.left .face-content');
                                const rightFace = block.querySelector('.face.right .face-content');
                                const topFace = block.querySelector('.face.top .face-content');
                                const bottomFace = block.querySelector('.face.bottom .face-content');

                                if (frontFace && !frontFace.textContent.includes(pitSymbol)) {
                                    frontFace.textContent += breezeSymbol;
                                    frontFace.style.backgroundColor = getFaceColor('B'); // Example function to get color based on symbol
                                }
                                if (backFace && !backFace.textContent.includes(pitSymbol)) {
                                    backFace.textContent += breezeSymbol;
                                    backFace.style.backgroundColor = getFaceColor('B'); // Example function to get color based on symbol
                                }
                                if (leftFace && !leftFace.textContent.includes(pitSymbol)) {
                                    leftFace.textContent += breezeSymbol;
                                    leftFace.style.backgroundColor = getFaceColor('B'); // Example function to get color based on symbol
                                }
                                if (rightFace && !rightFace.textContent.includes(pitSymbol)) {
                                    rightFace.textContent += breezeSymbol;
                                    rightFace.style.backgroundColor = getFaceColor('B'); // Example function to get color based on symbol
                                }
                                if (topFace && !topFace.textContent.includes(pitSymbol)) {
                                    topFace.textContent += breezeSymbol;
                                    topFace.style.backgroundColor = getFaceColor('B'); // Example function to get color based on symbol
                                }
                                if (bottomFace && !bottomFace.textContent.includes(pitSymbol)) {
                                    bottomFace.textContent += breezeSymbol;
                                    bottomFace.style.backgroundColor = getFaceColor('B'); // Example function to get color based on symbol
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    // Generate monsters and stenches
    for (var m = 0; m < numMonsterPieces; m++) {
        var monsterRow, monsterCol, monsterDepth;
        do {
            monsterRow = Math.floor(Math.random() * size);
            monsterCol = Math.floor(Math.random() * size);
            monsterDepth = Math.floor(Math.random() * size);
        } while ((monsterRow === agentRow && monsterCol === agentCol && monsterDepth === agentDepth) ||
            (monsterRow === goldRow && monsterCol === goldCol && monsterDepth === goldDepth));

        var monsterIndex = monsterRow * size * size + monsterCol * size + monsterDepth;
        var monsterBlock = cube.querySelector(`.block:nth-child(${monsterIndex + 1})`);
        const monsterFaces = monsterBlock.querySelectorAll('.face-content');
        monsterFaces.forEach(face => {
            face.textContent = monsterSymbol;
            face.style.backgroundColor = getFaceColor('M'); // Example function to get color based on symbol
        });

        // Place stenches around the monster
        for (let zOffset = -1; zOffset <= 1; zOffset++) {
            for (let yOffset = -1; yOffset <= 1; yOffset++) {
                for (let xOffset = -1; xOffset <= 1; xOffset++) {
                    if (Math.abs(zOffset) + Math.abs(yOffset) + Math.abs(xOffset) === 1) { // Ensure it's adjacent
                        const z = monsterDepth + zOffset;
                        const y = monsterRow + yOffset;
                        const x = monsterCol + xOffset;
                        if (z >= 0 && z < size && y >= 0 && y < size && x >= 0 && x < size) {
                            const index = y * size * size + x * size + z;
                            const block = cube.querySelector(`.block:nth-child(${index + 1})`);
                            if (block) {
                                const frontFace = block.querySelector('.face.front .face-content');
                                const backFace = block.querySelector('.face.back .face-content');
                                const leftFace = block.querySelector('.face.left .face-content');
                                const rightFace = block.querySelector('.face.right .face-content');
                                const topFace = block.querySelector('.face.top .face-content');
                                const bottomFace = block.querySelector('.face.bottom .face-content');

                                if (frontFace && !frontFace.textContent.includes(monsterSymbol)) {
                                    frontFace.textContent += stenchSymbol;
                                    frontFace.style.backgroundColor = getFaceColor('S'); // Example function to get color based on symbol
                                }
                                if (backFace && !backFace.textContent.includes(monsterSymbol)) {
                                    backFace.textContent += stenchSymbol;
                                    backFace.style.backgroundColor = getFaceColor('S'); // Example function to get color based on symbol
                                }
                                if (leftFace && !leftFace.textContent.includes(monsterSymbol)) {
                                    leftFace.textContent += stenchSymbol;
                                    leftFace.style.backgroundColor = getFaceColor('S'); // Example function to get color based on symbol
                                }
                                if (rightFace && !rightFace.textContent.includes(monsterSymbol)) {
                                    rightFace.textContent += stenchSymbol;
                                    rightFace.style.backgroundColor = getFaceColor('S'); // Example function to get color based on symbol
                                }
                                if (topFace && !topFace.textContent.includes(monsterSymbol)) {
                                    topFace.textContent += stenchSymbol;
                                    topFace.style.backgroundColor = getFaceColor('S'); // Example function to get color based on symbol
                                }
                                if (bottomFace && !bottomFace.textContent.includes(monsterSymbol)) {
                                    bottomFace.textContent += stenchSymbol;
                                    bottomFace.style.backgroundColor = getFaceColor('S'); // Example function to get color based on symbol
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    // Update statistics display
    document.getElementById('numPits').textContent = numPits;
    document.getElementById('numBreezes').textContent = numBreezes;
    document.getElementById('numStenches').textContent = numStenches;
    document.getElementById('numGold').textContent = numGold;
    document.getElementById('numMonsters').textContent = numMonsters;
    document.getElementById('numArrows').textContent = numArrows;
    document.getElementById('agentPoints').textContent = agentPoints;
}

// Example function to get color based on symbol
function getFaceColor(symbol) {
    switch (symbol) {
        case 'AFV': // Agent
            return 'background: linear-gradient(to bottom, black 50%, black 50%); color: white;';
        case 'G': // Gold
            return 'gold';
        case 'P': // Pit
            return 'darkblue';
        case 'B': // Breeze
            return 'lightblue';
        case 'M': // Monster
            return '#402008';
        case 'S': // Stench
            return '#8B4513';
        default:
            return 'lightgrey'; // Default color for other symbols
    }
}



function mostrarDetalhes() {
    var detalhesDiv = document.getElementById('detalhes');
    detalhesDiv.innerHTML = `
     
        <div class="det po"><p>Número de Poços: ${numPits}</p></div>
        <div class="det br"><p>Número de Brisas: ${numBreezes}</p></div>
        <div class="det fr"><p>Número de Fedor: ${numStenches}</p></div>
        <div class="det go"><p>Número de Ouro: ${numGold}</p></div>
        <div class="det mo"><p>Número de Monstros: ${numMonsters}</p></div>
        <div class="det fl"><p>Número de Flechas: ${numArrows}</p></div>
    `;
    detalhesDiv.style.display = 'block';
    console.log(`Pontos: ${agentPoints}, Passos dados: ${passosDados}, Flechas gastas: ${flechasGastas}, Matou monstro: ${matouMonstro}, Caiu em poço: ${caiuEmPoco}, Ouros pegos: ${ourosPegos}`);
}

function fimDeJogo() {
    if (selectedAgent === 'V3') {
        memoriaAgente = [];
    }
    jogoEmAndamento = false; // Define o jogo como não em andamento
    modal.style.display = "block"; // Mostra o modal
    // Mostra a matriz atualizada no console
}
var flechaAtirada = false; // Variável para controlar se a flecha já foi atirada
function atirarFlecha() {
    // Remover o event listener temporariamente para evitar múltiplos disparos de flecha
    document.removeEventListener('keydown', handleKeyDown);
    var size = parseInt(document.getElementById('size').value);
    var tabuleiro = document.getElementById('tabuleiro');
    var pontosAgenteSpan = document.getElementById('pontosAgente'); // Elemento span para exibir os pontos do agente
    // Atualizar a exibição dos pontos do agente na tela
    if (pontosAgenteSpan) {
        pontosAgenteSpan.textContent = agentPoints;
    }
    // Atualizar o número de flechas na seção de detalhes
    var detalhesElemento = document.getElementById('detalhes');
    if (detalhesElemento) {
        var pElement = detalhesElemento.querySelector('p:nth-child(6)');
        if (pElement) {
            pElement.textContent = `Número de Flechas: ${numArrows}`;
        }
    }
    var agentCell = tabuleiro.querySelector(`.row:nth-child(${agentRow + 1}) .cell:nth-child(${agentCol + 1})`);
    var targetRow = agentRow;
    var targetCol = agentCol;
    // Verificar se o agente está no início do tabuleiro e sente mal cheiro
    if (agentRow === 0 && agentCol === 0 && (agentCell.dataset.content === 'AVS' || agentCell.dataset.content === 'AVBS' || agentCell.dataset.content === 'AVSB')) {
        // Atirar na célula (1,1) se sentir mal cheiro no início do tabuleiro
        targetRow = 0;
        targetCol = 0;
    } else {
        // Escolher uma direção aleatória para atirar a flecha
        var randomDirection = Math.floor(Math.random() * 4); // 0 para cima, 1 para baixo, 2 para esquerda, 3 para direita
        // Determinar a posição alvo com base na direção aleatória
        switch (randomDirection) {
            case 0: // Cima
                targetRow--;
                break;
            case 1: // Baixo
                targetRow++;
                break;
            case 2: // Esquerda
                targetCol--;
                break;
            case 3: // Direita
                targetCol++;
                break;
        }
    }
    // Verificar se a posição alvo está dentro dos limites do tabuleiro
    if (targetRow >= 0 && targetRow < size && targetCol >= 0 && targetCol < size) {
        // Encontrar a célula alvo
        var targetCell = tabuleiro.querySelector(`.row:nth-child(${targetRow + 1}) .cell:nth-child(${targetCol + 1})`);
        numArrows--;
        flechasGastas += 1
        mostrarDetalhes();
        if (targetCell) {
            // Verificar se o alvo contém o símbolo do monstro
            if (targetCell.dataset.content.includes(monsterSymbol)) {
                // Remover o monstro do tabuleiro
                targetCell.dataset.content = targetCell.dataset.content.replace(monsterSymbol, emptySymbol);
                targetCell.textContent = targetCell.textContent.replace(monsterSymbol, emptySymbol);
                // Atualizar o número de monstros
                numMonsters--;
                matouMonstro += 1
                QuantMonstroKill += 1
                    // Exibir mensagem de sucesso
                alert('UAU!! BOA PONTARIA!!! Você atingiu o monstro!');
                agentPoints += 1000;
                mostrarDetalhes();
                return
            } else {
                // Exibir mensagem de que a flecha não atingiu o monstro ou a borda do tabuleiro
                alert('VISH! MELHORE A PONTARIA!! Você atirou uma flecha, mas não acertou o monstro!');
                return
            }
        } else {
            // Exibir mensagem se a célula alvo estiver fora dos limites
            alert('Flecha atirada fora do tabuleiro!');
            return
        }
    } else {
        numArrows--;
        // Exibir mensagem se a célula alvo estiver fora dos limites
        alert('Flecha atirada fora do tabuleiro!');
        return
    }
    // Atualizar a exibição dos pontos do agente na tela
    if (pontosAgenteSpan) {
        pontosAgenteSpan.textContent = agentPoints;
    }
    // Permitir novamente o disparo da flecha após um curto período de tempo
    setTimeout(function() {
        flechaAtirada = false;
        document.addEventListener('keydown', handleKeyDown);
    }, 1000);
    mostrarDetalhes();
}

function handleKeyDown(event) {
    if (event.key === 'f' || event.key === 'F') {
        if (!flechaAtirada) {
            flechaAtirada = true;
        }
    } else {
        // Outras teclas para movimentação do agente
        moverAgente(event.key);
    }
}

function atualizarMemoriaAgente(coluna, linha, tabuleiro) {
    if (linha >= 0 && linha < memoriaAgente.length && coluna >= 0 && coluna < memoriaAgente[linha].length) {
        // Atualiza a percepção e peso da célula na memória do agente
        var cell = tabuleiro.querySelector(`.row:nth-child(${linha + 1}) .cell:nth-child(${coluna + 1})`);
        memoriaAgente[linha][coluna].percepcao = cell.dataset.content;
        memoriaAgente[linha][coluna].peso = parseFloat(cell.dataset.weight);
        memoriaAgente[linha][coluna].visitado = true;
        // O restante da lógica de atualização de memória pode ser implementada aqui, se necessário
        // Por exemplo, atualização de outras informações relevantes ou lógica específica do seu sistema.
    } else {
        console.error(`Posição inválida (${linha}, ${coluna}) para atualização na memória do agente.`);
    }
}

function encontrarRotaMaisCurta(memoriaAgente) {
    var destino = {
        linha: 0,
        coluna: 0
    }; // Casa inicial
    var posicaoAtual = memoriaAgente[memoriaAgente.length - 1];
    // Função auxiliar para verificar se uma posição está na memória do agente
    function estaNaMemoria(linha, coluna) {
        return memoriaAgente.some(casa => casa.linha === linha && casa.coluna === coluna);
    }
    // Função para verificar se uma posição está dentro dos limites do tabuleiro
    function estaDentroDosLimites(linha, coluna, size) {
        return linha >= 0 && linha < size && coluna >= 0 && coluna < size;
    }
    var size = parseInt(document.getElementById('size').value);
    var visitado = Array.from({
        length: size
    }, () => Array(size).fill(false));
    var fila = [{
        posicao: posicaoAtual,
        rota: [posicaoAtual]
    }];
    visitado[posicaoAtual.linha][posicaoAtual.coluna] = true;
    var direcoes = [{
            linha: -1,
            coluna: 0
        }, // Cima
        {
            linha: 1,
            coluna: 0
        }, // Baixo
        {
            linha: 0,
            coluna: -1
        }, // Esquerda
        {
            linha: 0,
            coluna: 1
        } // Direita
    ];
    while (fila.length > 0) {
        var {
            posicao,
            rota
        } = fila.shift();
        if (posicao.linha === destino.linha && posicao.coluna === destino.coluna) {
            return rota;
        }
        for (var i = 0; i < direcoes.length; i++) {
            var novaLinha = posicao.linha + direcoes[i].linha;
            var novaColuna = posicao.coluna + direcoes[i].coluna; // Corrigido aqui
            if (estaDentroDosLimites(novaLinha, novaColuna, size) &&
                estaNaMemoria(novaLinha, novaColuna) &&
                !visitado[novaLinha][novaColuna]) {
                visitado[novaLinha][novaColuna] = true;
                var novaPosicao = {
                    linha: novaLinha,
                    coluna: novaColuna
                };
                fila.push({
                    posicao: novaPosicao,
                    rota: [...rota, novaPosicao]
                });
            }
        }
    }
    return [];
}

function seguirRota(rota) {
    rota.forEach((destino, index) => {
        setTimeout(() => {
            // Verificar se o destino está definido
            if (destino) {
                // Atualizar a posição do agente
                agentRow = destino.linha;
                agentCol = destino.coluna;
                passosDados++;
                mostrarDetalhes();
                // Atualizar a célula atual do agente no tabuleiro
                var tabuleiro = document.getElementById('tabuleiro');
                var currentCell = tabuleiro.querySelector(`.row:nth-child(${agentRow + 1}) .cell:nth-child(${agentCol + 1})`);
                // Remover o símbolo antigo do agente, se presente
                currentCell.textContent = currentCell.textContent.replace(agentSymbol + flecha, '');
                // Adicionar o símbolo do agente à célula atual
                currentCell.textContent = agentSymbol + flecha + currentCell.textContent;
                // Remover o agente da célula anterior, se necessário
                if (index > 0) {
                    var previousDestino = rota[index - 1];
                    if (previousDestino) {
                        var previousCell = tabuleiro.querySelector(`.row:nth-child(${previousDestino.linha + 1}) .cell:nth-child(${previousDestino.coluna + 1})`);
                        previousCell.textContent = previousCell.textContent.replace(agentSymbol + flecha, '');
                    }
                }
                // Verificar se o agente chegou à casa inicial
                if (agentRow === 0 && agentCol === 0) {
                    // Atualize os pontos de vida e flechas gastas
                    agentPoints -= passosDados;
                    // ourosPegos2 = (numGoldPieces - ourosPegos) - numGoldPieces
                    alert("Você conseguiu! Que tal aumentar o tamanho do tabuleiro para um desafio maior?");
                    fimDeJogo();
                    retornandoParaCasa = false; // Resetar a variável de controle
                }
            }
        }, index * 1000); // Ajuste o tempo conforme necessário
    });
}
//agente numero V2 (INTERMEDIARIO)
function moverAgente2() {
    if (!jogoEmAndamento || retornandoParaCasa) {
        return; // Não move o agente se o jogo não estiver em andamento ou se estiver retornando para casa
    }
    var size = parseInt(document.getElementById('size').value);
    var tabuleiro = document.getElementById('tabuleiro');
    // Atualizar a memória do agente com a posição atual
    var posicaoAtual = {
        linha: agentRow,
        coluna: agentCol
    };
    memoriaAgente.push(posicaoAtual);
    // Capturar percepção da casa atual
    capturarPercepcao(agentRow, agentCol, tabuleiro);
    var currentCell = tabuleiro.querySelector(`.row:nth-child(${agentRow + 1}) .cell:nth-child(${agentCol + 1})`);
    currentCell.textContent = currentCell.textContent.replace(agentSymbol, '').replace(flecha, '');
    // Verificar se o agente encontrou o ouro
    if (currentCell.dataset.content.includes(goldSymbol)) {
        mensagem = '- Você encontrou o ouro, está na hora de ir.';
        currentCell.dataset.content = currentCell.dataset.content.replace(goldSymbol, emptySymbol);
        currentCell.textContent = currentCell.textContent.replace(goldSymbol, emptySymbol);
        numGold--; // Decrementar o número de ouro
        ourosPegos++;
        agentPoints += 1000; // Adicionar 1000 pontos ao agente
        document.getElementById('pontosAgente').textContent = agentPoints;
        // Verificar se já pegou dois ouros
        if (ourosPegos === 2) {
            // Criar rota de volta para casa inicial usando apenas casas visitadas
            var rotaMaisCurta = encontrarRotaMaisCurta(memoriaAgente);
            console.log("Rota mais curta:", rotaMaisCurta);
            // Sinalizar que o agente está retornando para casa
            retornandoParaCasa = true;
            // Mover o agente pela rota mais curta
            seguirRota(rotaMaisCurta);
        }
        return; // Parar a execução da função após pegar dois ouros
    }
    // Atualizar a matriz casasVisitadas com a posição atual do agente
    atualizarCasasVisitadas(agentRow, agentCol, currentCell.dataset.content);
    // Função para mover o agente aleatoriamente com base nas percepções
    moverAleatoriamenteComPercepcoes(size, tabuleiro);
    console.log(memoriaAgente);
    mostrarDetalhes();
    agentPoints--;
    document.getElementById('pontosAgente').textContent = agentPoints;
    var newAgentCell = tabuleiro.querySelector(`.row:nth-child(${agentRow + 1}) .cell:nth-child(${agentCol + 1})`);
    // Verificar percepções na nova casa
    verificarPercepcoesNovaCasa(newAgentCell);
    var newCell = tabuleiro.querySelector(`.row:nth-child(${agentRow + 1}) .cell:nth-child(${agentCol + 1})`);
    newCell.textContent = agentSymbol + flecha + newCell.textContent;
}

function capturarPercepcao(linha, coluna, tabuleiro) {
    // Atualiza a memória do agente com as percepções da casa atual
    if (linha >= 0 && linha < memoriaAgente.length && coluna >= 0 && coluna < memoriaAgente[linha].length) {
        var cell = tabuleiro.querySelector(`.row:nth-child(${linha + 1}) .cell:nth-child(${coluna + 1})`);
        var percepcao = cell.dataset.content;
        var peso = parseFloat(cell.dataset.weight);
        // Atualiza a percepção e peso da célula na memória do agente
        memoriaAgente[linha][coluna].percepcao = percepcao;
        memoriaAgente[linha][coluna].peso = peso;
        memoriaAgente[linha][coluna].visitado = true;
        // Atualiza a matriz casasVisitadas
        atualizarCasasVisitadas(linha, coluna, percepcao);
    } else {
        console.error(`Posição inválida (${linha}, ${coluna}) para captura de percepção.`);
    }
}

function verificarPercepcoesNovaCasa(cell) {
    switch (cell.dataset.content) {
        case stenchSymbol:
        case 'AFVS':
            mensagem = '- Você sentiu um mau cheiro. Pressione "F" para atirar uma flecha.';
            if (Math.random() < 0.5) {
                atirarFlecha();
            }
            break;
        case goldSymbol:
            mensagem = '- Você encontrou o ouro, está na hora de ir.';
            cell.dataset.content = cell.dataset.content.replace(goldSymbol, emptySymbol);
            cell.textContent = cell.textContent.replace(goldSymbol, emptySymbol);
            numGold--;
            ourosPegos += 1
            agentPoints += 1000;
            if (ourosPegos == 2) {
                document.getElementById('pontosAgente').textContent = agentPoints;
                var rotaMaisCurta = encontrarRotaMaisCurta(memoriaAgente);
                console.log("Rota mais curta:", rotaMaisCurta);
                retornandoParaCasa = true;
                seguirRota(rotaMaisCurta);
            }
            return;
        case pitSymbol:
            mensagem = '';
            caiuEmPoco += 1;
            alert('Você caiu em um poço, cuidado!');
            fimDeJogo();
            break;
        case monsterSymbol:
            mensagem = '';
            MortoPorMonstro += 1
            alert('Você não foi sagaz, o monstro lhe achou!');
            fimDeJogo();
            break;
        case 'MB':
            MortoPorMonstro += 1
            alert('Você sentiu uma brisa, porém não prestou atenção e o monstro lhe achou!');
            fimDeJogo();
            break;
        case 'B':
            mensagem = '- Você sentiu uma brisa. Há poços por perto.';
            break;
        case 'BB':
            mensagem = '- Você sentiu uma brisa forte. Há poços muito próximos.';
            break;
        case 'AVB':
            mensagem = '- Você sentiu uma brisa forte. Há poços muito próximos.';
            break;
        case 'AVS':
            mensagem = '- Você sentiu um mal cheiro. Fique alerta, pode haver monstro ou poços ao redor!';
            break;
        case 'BS':
        case 'BBS':
        case 'BBBS':
        case 'AFVBS':
        case 'AFVBBS':
            mensagem = '- Você sentiu uma brisa forte e um mal cheiro. Fique alerta, pode haver monstro ou poços ao redor!';
            if (Math.random() < 0.5) {
                atirarFlecha();
            }
            break;
        case 'PS':
            caiuEmPoco += 1;
            mensagem = '';
            alert('Você sentiu um mal cheiro. Porém não tomou cuidado e caiu em um poço!');
            fimDeJogo();
            break;
        case 'PB':
            caiuEmPoco += 1;
            mensagem = '';
            alert('Você sentiu uma brisa forte. Porém não tomou cuidado e caiu em um poço!');
            fimDeJogo();
            break;
        case 'GS':
            mensagem = '- Você encontrou o ouro, mas sentiu um mal cheiro. Fique alerta, pode haver monstro ao redor!';
            if (Math.random() < 0.5) {
                atirarFlecha();
            }
            cell.dataset.content = cell.dataset.content.replace(goldSymbol, emptySymbol);
            cell.textContent = cell.textContent.replace(goldSymbol, emptySymbol);
            numGold--;
            ourosPegos += 1
            agentPoints += 1000;
            if (ourosPegos == 2) {
                document.getElementById('pontosAgente').textContent = agentPoints;
                var rotaMaisCurta = encontrarRotaMaisCurta(memoriaAgente);
                console.log("Rota mais curta:", rotaMaisCurta);
                retornandoParaCasa = true;
                seguirRota(rotaMaisCurta);
            }
            return;
        case 'GB':
        case 'GBB':
        case 'GBBB':
            mensagem = '- Você encontrou o ouro, mas sentiu uma brisa forte. Fique alerta, pode haver poços muito próximos!';
            cell.dataset.content = cell.dataset.content.replace(goldSymbol, emptySymbol);
            cell.textContent = cell.textContent.replace(goldSymbol, emptySymbol);
            numGold--;
            ourosPegos += 1
            agentPoints += 1000;
            if (ourosPegos == 2) {
                document.getElementById('pontosAgente').textContent = agentPoints;
                var rotaMaisCurta = encontrarRotaMaisCurta(memoriaAgente);
                console.log("Rota mais curta:", rotaMaisCurta);
                retornandoParaCasa = true;
                seguirRota(rotaMaisCurta);
            }
            return;
        case 'GBS':
        case 'GBBS':
        case 'GBBBS':
            mensagem = '- Você encontrou o ouro, mas sentiu uma brisa forte e sentiu um mal cheiro.. Fique alerta, pode haver poços muito próximos e o monstro a espreitar.';
            if (Math.random() < 0.5) {
                atirarFlecha();
            }
            cell.dataset.content = cell.dataset.content.replace(goldSymbol, emptySymbol);
            cell.textContent = cell.textContent.replace(goldSymbol, emptySymbol);
            numGold--;
            ourosPegos += 1
            agentPoints += 1000;
            if (ourosPegos == 2) {
                document.getElementById('pontosAgente').textContent = agentPoints;
                var rotaMaisCurta = encontrarRotaMaisCurta(memoriaAgente);
                console.log("Rota mais curta:", rotaMaisCurta);
                retornandoParaCasa = true;
                seguirRota(rotaMaisCurta);
            }
            return;
        case 'BBB':
            mensagem = '- Você sentiu uma brisa intensa. Há poços extremamente próximos.';
            break;
        case 'VB':
            mensagem = '- Você sentiu uma brisa intensa. Há poços extremamente próximos.';
            break;
        case 'VBB':
            mensagem = '- Você sentiu uma brisa intensa. Há poços extremamente próximos.';
            break;
        default:
            mensagem = '- Você entrou em uma casa vazia.';
            break;
    }
    var passoAPasso = document.getElementById('passoAPasso');
    var listItem = document.createElement('li');
    listItem.textContent = mensagem;
    passoAPasso.appendChild(listItem);
}
// Adicionar o event listener inicial para capturar as teclas
document.addEventListener('keydown', handleKeyDown);

function movimentoAutomatico() {
    // Mover o agente de forma aleatória
    if (selectedAgent === 'V2') {
        moverAgente();
    } else if (selectedAgent === 'V3') {
        moverAgente2();
    }
}
// Chamar a função de movimento automático a cada 1 segundo (1000 milissegundos)
setInterval(movimentoAutomatico, 100);

function moveAgent() {
    // Atualizar a memória do agente com a posição atual
    var posicaoAtual = {
        linha: agentRow,
        coluna: agentCol
    };
    memoriaAgente.push(posicaoAtual);
    // Adiciona a nova posição ao array de casas visitadas se ainda não foi visitada
    if (!casasVisitadas.some(casa => casa.linha === agentRow && casa.coluna === agentCol)) {
        casasVisitadas.push({
            linha: agentRow,
            coluna: agentCol
        });
    }
    switch (selectedAgent) {
        case "V2":
            moverAgente();
            break;
        case "V3":
            moverAgente2();
            break;
        case "V4":
            // var bestPath = findBestPath();
            // moverAgente3(bestPath);
            var populacaoAgentes = gerarPopulacao(190, 300);
            var taxaCruzamento = 0.85;
            // Aplicar cruzamento e mutação
            populacaoAposCruzamento = aplicarCruzamento(populacaoAgentes, taxaCruzamento, 0.05);
            console.log("sasds", novaPopulacao2)
            break;
        default:
    }
}

function baixarRelatorio() {
    const {
        jsPDF
    } = window.jspdf;
    const doc = new jsPDF();
    let agentTitle = '';
    if (selectedAgent === 'V2') {
        agentTitle = 'Agente Iniciante';
    } else if (selectedAgent === 'V3') {
        agentTitle = 'Agente Intermediário';
    } else if (selectedAgent === 'V4') {
        agentTitle = 'Agente Avançado';
    }
    if (matouMonstro == 1) {
        resposta1 = 'Sim'
    } else {
        resposta1 = 'Nao'
    }
    if (caiuEmPoco == 1) {
        resposta2 = 'Sim'
    } else {
        resposta2 = 'Nao'
    }
    if (MortoPorMonstro == 1) {
        resposta3 = 'Sim'
    } else {
        resposta3 = 'Nao'
    }
    const columns = ["Quantidades de Passos", "Número de Flechas Gastas", "Matou o Monstro", "Caiu em Poço", "Número de Ouros Pegos", "Tamanho do Tabuleiro", "Morto Por Monstro", "Quantidade Monstro abatido"];
    const data = [
        [passosDados, flechasGastas, resposta1, resposta2, ourosPegos, tamanhoTabuleiro, resposta3, QuantMonstroKill]
    ];
    doc.text(agentTitle, 10, 10);
    doc.autoTable(columns, data, {
        startY: 30,
        styles: {
            fontSize: 12,
            textColor: [0, 0, 0],
            fontStyle: 'normal',
            cellPadding: 5
        },
        headStyles: {
            fillColor: [200, 200, 200],
            textColor: [0, 0, 0],
            fontStyle: 'bold'
        },
        columnStyles: {
            2: {
                cellWidth: 'auto'
            }, // Ajustar a largura da coluna "Matou o Monstro"
            3: {
                cellWidth: 'auto'
            }, // Ajustar a largura da coluna "Caiu em Poço"
        },
        margin: {
            top: 30
        },
        didDrawPage: function(data) {
            doc.setFontSize(18);
            doc.setTextColor(0, 0, 0);
            doc.text('Relatório do Jogo', data.settings.margin.left, 20);
        }
    });
    doc.save('relatorio_agente.pdf');
}