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
var numGoldPieces = 7; // NUMERO DE OUROS
var numMonsterPieces = 7; // NUMERO DE MONSTRO
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
// =========================================
// Classe para representar um agente temporário
class Agente {
    constructor(x, y, movimentos) {
        this.x = x;
        this.y = y;
        this.movimentos = movimentos;
    }
    mover() {
        this.movimentos.forEach(movimento => {
            switch (movimento) {
                case 'acima':
                    this.y += 1;
                    break;
                case 'baixo':
                    this.y -= 1;
                    break;
                case 'direita':
                    this.x += 1;
                    break;
                case 'esquerda':
                    this.x -= 1;
                    break;
            }
            console.log(`Agente em movimento para: (${this.x}, ${this.y})`);
        });
    }
}

function gerarPopulacao(numIndividuos, numMovimentos) {
    var movimentosPossiveis = ['cima', 'baixo', 'esquerda', 'direita'];
    var populacao = [];
    for (var i = 0; i < numIndividuos; i++) {
        var movimentos = [];
        for (var j = 0; j < numMovimentos; j++) {
            movimentos.push(movimentosPossiveis[Math.floor(Math.random() * movimentosPossiveis.length)]);
        }
        populacao.push({
            numero: i + 1, // Assegura que cada agente tenha um número único
            x: 0,
            y: 0,
            movimentos: movimentos,
            score: 0 // Inicializar o score do agente
        });
    }
    return populacao;
}

document.addEventListener('DOMContentLoaded', function() {
    const tabuleiro = document.getElementById('tabuleiro');
    let zoom = 1;

    function zoomTabuleiro(event) {
        if (event.deltaY < 0) {
            zoom += 0.1;
        } else if (event.deltaY > 0) {
            zoom -= 0.1;
        }
        zoom = Math.max(0.1, Math.min(zoom, 3)); // Limitar o zoom para não ficar negativo ou muito pequeno
        tabuleiro.style.transform = `scale(${zoom})`;
    }

    document.addEventListener('wheel', zoomTabuleiro);
});


// =======================================
function gerarTabuleiro() {
    if (selectedAgent === null) {
        alert("Por favor, selecione um agente antes de gerar o tabuleiro.");
        return;
    }
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
    // Pausa a música, se estiver tocando
    if (!audio.paused) {
        audio.pause();
    }
    audio.src = urlMusica;
    audio.currentTime = 0; // Isso reinicia a música para o início
    audio.play();
    var size = parseInt(document.getElementById('size').value);
    var tabuleiro = document.getElementById('tabuleiro');
    var detalhesButton = document.getElementById('detalhesButton');
    var detalhesDiv = document.getElementById('detalhes');
    var passoAPassoDiv = document.getElementById('passoAPasso');
    tabuleiro.innerHTML = '';
    detalhesDiv.innerHTML = '';
    passoAPassoDiv.innerHTML = '';
    // Inicializando as variáveis


    numPits = 0;
    numBreezes = 0;
    numStenches = 0;
    numGold = 0;
    numMonsters = 0;
    numArrows = 40;
    agentPoints = 0; // Definindo os pontos de vida iniciais do agente
    // Atualizar o elemento HTML para exibir os pontos do agente
    document.getElementById('pontosAgente').textContent = agentPoints;
    // Limpar o array de casas visitadas
    memoriaAgente = [];
    // Criando o tabuleiro com células e atribuindo pesos conforme solicitado
    for (var i = 0; i < size; i++) {
        var row = document.createElement('div');
        row.classList.add('row');
        for (var j = 0; j < size; j++) {
            var cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.content = '';
            // Atribuindo os pesos conforme solicitado
            var randomWeight = Math.random();
            if (randomWeight < 0.3) {
                cell.dataset.weight = 0.3; // Casa com brisa (B)
            } else if (randomWeight < 0.6) {
                cell.dataset.weight = 0.3; // Casa com fedor (S)
            } else {
                cell.dataset.weight = 0.1; // Casa vazia (V)
            }
            row.appendChild(cell);
            memoriaAgente = [];
            for (let i = 0; i < size; i++) {
                memoriaAgente[i] = [];
                for (let j = 0; j < size; j++) {
                    // Inicializa cada célula na memória do agente com percepção vazia, peso inicial e não visitada
                    memoriaAgente[i][j] = {
                        percepcao: '',
                        peso: 0.1, // Peso padrão para células não visitadas ou sem percepção específica
                        visitado: false
                    };
                }
            }
        }
        tabuleiro.appendChild(row);
    }
    // Colocando o agente na posição (1, 1)
    agentRow = 0;
    agentCol = 0;
    var agentCell = tabuleiro.querySelector(`.row:nth-child(${agentRow + 1}) .cell:nth-child(${agentCol + 1})`);
    agentCell.dataset.content = agentSymbol + emptySymbol;
    agentCell.textContent = agentSymbol + flecha + emptySymbol;
    // Adiciona a posição inicial do agente ao array de casas visitadas
    casasVisitadas.push({
        linha: agentRow,
        coluna: agentCol
    });
    // Colocando o monstro em uma posição aleatória, diferente da posição do agente
    // Colocando múltiplos pedaços de ouro em posições aleatórias
    // Defina quantos pedaços de ouro você quer
    for (var g = 0; g < numGoldPieces; g++) {
        var goldRow, goldCol;
        do {
            goldRow = Math.floor(Math.random() * size);
            goldCol = Math.floor(Math.random() * size);
        } while ((goldRow === agentRow && goldCol === agentCol) ||
            (goldRow === monsterRow && goldCol === monsterCol) ||
            tabuleiro.querySelector(`.row:nth-child(${goldRow + 1}) .cell:nth-child(${goldCol + 1})`).dataset.content.includes(goldSymbol));
        var goldCell = tabuleiro.querySelector(`.row:nth-child(${goldRow + 1}) .cell:nth-child(${goldCol + 1})`);
        goldCell.dataset.content = goldSymbol;
        goldCell.textContent = goldSymbol;
        numGold++;
    }
    // Calculando o número de poços
    var maxPits = size - 1;
    // Gerando os poços e as brisas
    for (var k = 0; k < maxPits; k++) {
        var pitRow, pitCol;
        do {
            pitRow = Math.floor(Math.random() * size);
            pitCol = Math.floor(Math.random() * size);
        } while ((pitRow === agentRow && pitCol === agentCol) || (pitRow === monsterRow && pitCol === monsterCol) || (pitRow === goldRow && pitCol === goldCol));
        var pitCell = tabuleiro.querySelector(`.row:nth-child(${pitRow + 1}) .cell:nth-child(${pitCol + 1})`);
        pitCell.dataset.content = pitSymbol;
        pitCell.textContent = pitSymbol;
        numPits++;
        // Colocando brisas ao redor do poço
        if (pitRow > 0) {
            var topCell = tabuleiro.querySelector(`.row:nth-child(${pitRow}) .cell:nth-child(${pitCol + 1})`);
            if (!topCell.dataset.content.includes(pitSymbol)) {
                topCell.dataset.content += breezeSymbol;
                topCell.textContent = topCell.dataset.content;
                numBreezes++;
            }
        }
        if (pitRow < size - 1) {
            var bottomCell = tabuleiro.querySelector(`.row:nth-child(${pitRow + 2}) .cell:nth-child(${pitCol + 1})`);
            if (!bottomCell.dataset.content.includes(pitSymbol)) {
                bottomCell.dataset.content += breezeSymbol;
                bottomCell.textContent = bottomCell.dataset.content;
                numBreezes++;
            }
        }
        if (pitCol > 0) {
            var leftCell = tabuleiro.querySelector(`.row:nth-child(${pitRow + 1}) .cell:nth-child(${pitCol})`);
            if (!leftCell.dataset.content.includes(pitSymbol)) {
                leftCell.dataset.content += breezeSymbol;
                leftCell.textContent = leftCell.dataset.content;
                numBreezes++;
            }
        }
        if (pitCol < size - 1) {
            var rightCell = tabuleiro.querySelector(`.row:nth-child(${pitRow + 1}) .cell:nth-child(${pitCol + 2})`);
            if (!rightCell.dataset.content.includes(pitSymbol)) {
                rightCell.dataset.content += breezeSymbol;
                rightCell.textContent = rightCell.dataset.content;
                numBreezes++;
            }
        }
    }
    for (var m = 0; m < numMonsterPieces; m++) {
        var monsterRow, monsterCol;
        do {
            monsterRow = Math.floor(Math.random() * size);
            monsterCol = Math.floor(Math.random() * size);
        } while ((monsterRow === agentRow && monsterCol === agentCol));
        var monsterCell = tabuleiro.querySelector(`.row:nth-child(${monsterRow + 1}) .cell:nth-child(${monsterCol + 1})`);
        monsterCell.dataset.content = monsterSymbol;
        monsterCell.textContent = monsterSymbol;
        numMonsters++;
        // Adicionando fedor ao redor do monstro
        if (monsterRow > 0) {
            var monsterTopCell = tabuleiro.querySelector(`.row:nth-child(${monsterRow}) .cell:nth-child(${monsterCol + 1})`);
            if (!monsterTopCell.dataset.content.includes(monsterSymbol)) {
                monsterTopCell.dataset.content += stenchSymbol;
                monsterTopCell.textContent = monsterTopCell.dataset.content;
                numStenches++;
            }
        }
        if (monsterRow < size - 1) {
            var monsterBottomCell = tabuleiro.querySelector(`.row:nth-child(${monsterRow + 2}) .cell:nth-child(${monsterCol + 1})`);
            if (!monsterBottomCell.dataset.content.includes(monsterSymbol)) {
                monsterBottomCell.dataset.content += stenchSymbol;
                monsterBottomCell.textContent = monsterBottomCell.dataset.content;
                numStenches++;
            }
        }
        if (monsterCol > 0) {
            var monsterLeftCell = tabuleiro.querySelector(`.row:nth-child(${monsterRow + 1}) .cell:nth-child(${monsterCol})`);
            if (!monsterLeftCell.dataset.content.includes(monsterSymbol)) {
                monsterLeftCell.dataset.content += stenchSymbol;
                monsterLeftCell.textContent = monsterLeftCell.dataset.content;
                numStenches++;
            }
        }
        if (monsterCol < size - 1) {
            var monsterRightCell = tabuleiro.querySelector(`.row:nth-child(${monsterRow + 1}) .cell:nth-child(${monsterCol + 2})`);
            if (!monsterRightCell.dataset.content.includes(monsterSymbol)) {
                monsterRightCell.dataset.content += stenchSymbol;
                monsterRightCell.textContent = monsterRightCell.dataset.content;
                numStenches++;
            }
        }
    }
    // Preenchendo as células vazias com o símbolo de célula vazia
    var emptyCells = tabuleiro.querySelectorAll('.cell');

    emptyCells.forEach(cell => {
        if (cell.textContent === '') {
            cell.dataset.content = emptySymbol;
            cell.textContent = emptySymbol;
        }
    });
    // Mostrar botão de detalhes
    detalhesButton.style.display = 'block';
    var mensagem = '';
    switch (agentCell.dataset.content) {
        case 'AV':
            mensagem = '- Você se sente sozinho, esta casa está vazia.';
            break;
        case 'AVS':
            mensagem = '- Você iniciou a jornada sentindo um cheiro estranho, cuidado o monstro pode estar por perto.';
            break;
        case 'AVB':
        case 'AVBB':
        case 'AVBBB':
            mensagem = '- Você iniciou sua jornada sentindo uma brisa, pode haver poços por perto.';
            break;
        case 'AVBS':
        case 'AVSB':
            mensagem = '- Você iniciou a jornada sentindo um cheiro estranho e uma brisa. Fique alerta, pode haver monstro e poços por perto.';
            break;
        default:
            mensagem = '- Você entrou em uma casa vazia.';
            break;
    }
    // Adiciona a mensagem à lista de detalhes
    var passoAPasso = document.getElementById('passoAPasso');
    var listItem = document.createElement('li');
    listItem.textContent = mensagem;
    passoAPasso.appendChild(listItem);
    inicializarCasasVisitadas(size);
    tamanhoTabuleiro = size;
    moveAgent();
    // Exemplo de uso:
}


// Função para mover o agente temporário no tabuleiro
function moverAgenteTemporario(agente, tamanhoTabuleiro, callback) {
    var tabuleiro = document.getElementById('tabuleiro');

    // Função para executar um movimento específico
    function executarMovimento(indiceMovimento) {
        // Se o índice de movimento for maior que 0, limpar a célula anterior
        if (indiceMovimento > 0) {
            var cellAnterior = tabuleiro.querySelector(`.row:nth-child(${agente.y + 1}) .cell:nth-child(${agente.x + 1})`);
            if (cellAnterior && cellAnterior.originalContent !== undefined) {
                cellAnterior.textContent = cellAnterior.originalContent;
            } else if (cellAnterior) {
                cellAnterior.textContent = 'V';
            }
        }

        // Verificar se ainda há movimentos a serem feitos
        if (indiceMovimento < agente.movimentos.length) {
            // Determinar o próximo movimento
            var proximoMovimento = agente.movimentos[indiceMovimento];
            switch (proximoMovimento) {
                case 'cima':
                    agente.y--;
                    break;
                case 'baixo':
                    agente.y++;
                    break;
                case 'esquerda':
                    agente.x--;
                    break;
                case 'direita':
                    agente.x++;
                    break;
            }

            // Verificar se o agente está dentro dos limites do tabuleiro
            if (agente.y >= 0 && agente.y < tamanhoTabuleiro && agente.x >= 0 && agente.x < tamanhoTabuleiro) {
                agente.score += 1; // Aumentar a pontuação para movimentos válidos

                // Selecionar a nova célula e atualizar seu conteúdo
                var newCell = tabuleiro.querySelector(`.row:nth-child(${agente.y + 1}) .cell:nth-child(${agente.x + 1})`);
                if (newCell) {
                    // Salvar o conteúdo original da célula, se ainda não foi salvo
                    if (!newCell.hasOwnProperty('originalContent')) {
                        newCell.originalContent = newCell.textContent;
                    }

                    // Verificar o conteúdo da nova célula
                    if (newCell.textContent.includes(pitSymbol)) {
                        agente.score -= 100000;
                        adicionarMensagem(`Agente ${agente.numero} caiu no poço.`);
                        return callback(agente.score);
                    }

                    if (newCell.textContent.includes(monsterSymbol)) {
                        agente.score -= 100000;
                        adicionarMensagem(`Agente ${agente.numero} foi morto por um monstro.`);
                        return callback(agente.score);
                    }

                    if (newCell.textContent.includes(goldSymbol)) {
                        agente.score += 5000;
                        adicionarMensagem(`Agente ${agente.numero} encontrou o ouro.`);
                        return callback(agente.score);
                    }

                    // Atualizar o conteúdo da célula com o símbolo do agente
                    newCell.textContent += `A${agente.numero}F`;
                }
            } else {
                agente.score -= 1; // Penalizar se o movimento for fora dos limites
            }

            // Atualizar a lista de passos
            var passoAPasso = document.getElementById('passoAPasso');
            var listItem = document.createElement('li');
            listItem.textContent = `- Agente temporário ${agente.numero} moveu para (${agente.x}, ${agente.y})`;
            passoAPasso.appendChild(listItem);

            // Continuar com o próximo movimento após um curto intervalo
            setTimeout(() => executarMovimento(indiceMovimento + 1), 1);
        } else {
            // Chamar o callback quando todos os movimentos terminarem
            callback(agente.score);
        }
    }

    // Iniciar a execução dos movimentos a partir do primeiro
    executarMovimento(0);
}


function adicionarMensagem(mensagem) {
    console.log(mensagem)
        // var passoAPasso = document.getElementById('passoAPasso');
        // var listItem = document.createElement('li');
        // listItem.textContent = mensagem;
        // passoAPasso.appendChild(listItem);
}

function mostrarClassificacao(populacaoAgentes) {
    // Classificar os agentes pelo score (do maior para o menor)
    populacaoAgentes.sort((a, b) => b.score - a.score);
    // Exibir a tabela de classificação no console
    console.table(populacaoAgentes.map(agente => ({
        'Agente': agente.numero,
        'Score': agente.score
    })));
}

function verificarTerminoDeAndar() {
    agentesTerminaramDeAndar++;
    if (agentesTerminaramDeAndar === populacaoAposCruzamento.length) {
        // Todos os agentes terminaram de andar
        console.log('Todos os agentes terminaram de andar. Exibindo tabela classificatória:');
        // Ordenar população após cruzamento e mutação pelo score decrescente
        populacaoAposCruzamento.sort((a, b) => b.score - a.score);
        // Exibir tabela de classificação
        console.table(populacaoAposCruzamento.map(agente => ({
            'Agente': agente.numero,
            'Score': agente.score
        })));
    }
}
// Função para mover o agente principal após selecionar o melhor agente
function moverAgentePrincipal(populacaoAgentes) {
    // Ordenar a população pelo score (se ainda não estiver ordenada)
    // Assumir que o primeiro agente da lista é o que tem o maior score
    var melhorAgente = populacaoAgentes[0];
    console.log("O melhor agente foi:", melhorAgente);
    // Inverter linhas e colunas do tabuleiro
    inverterTabuleiro();
    // Verificar se o melhor agente tem a propriedade movimentos e se é um array
    if (melhorAgente.movimentos && Array.isArray(melhorAgente.movimentos)) {
        var movimentosMelhorAgente = melhorAgente.movimentos;
        console.log(`O agente com o maior score é o Agente ${melhorAgente.numero} com score ${melhorAgente.score}`);
        console.log('Movimentos:', movimentosMelhorAgente.join(', '));
        // Chamar a função moverAgente3 com os movimentos do melhor agente
        moverAgente3(movimentosMelhorAgente);
    } else {
        console.error('Erro: O melhor agente não possui movimentos válidos.');
    }
}
// Função para inverter o tabuleiro (mantendo classes e percepções)
function inverterTabuleiro() {
    var tabuleiro = document.getElementById('tabuleiro');
    var linhas = tabuleiro.querySelectorAll('.row');
    var numLinhas = linhas.length;
    var numColunas = linhas[0].querySelectorAll('.cell').length;
    // Criar um novo tabuleiro invertido
    var novoTabuleiro = [];
    for (var lin = 0; lin < numLinhas; lin++) {
        novoTabuleiro[lin] = [];
        for (var col = 0; col < numColunas; col++) {
            var cell = linhas[lin].querySelectorAll('.cell')[col].cloneNode(true);
            novoTabuleiro[lin][col] = cell;
        }
    }
    // Limpar o tabuleiro atual
    while (tabuleiro.firstChild) {
        tabuleiro.removeChild(tabuleiro.firstChild);
    }
    // Adicionar o novo tabuleiro invertido ao DOM
    for (var col = 0; col < numColunas; col++) {
        var row = document.createElement('div');
        row.className = 'row';
        for (var lin = 0; lin < numLinhas; lin++) {
            row.appendChild(novoTabuleiro[lin][col]);
        }
        tabuleiro.appendChild(row);
    }
}
// Função para aplicar cruzamento
function aplicarCruzamento2(populacao, taxaCruzamento, taxaMutacao) {
    novaPopulacao = [...populacao];
    var numCruzamentos = Math.floor(taxaCruzamento * populacao.length / 2);
    var filhosGerados = [];
    // Realizar cruzamento para gerar filhos
    for (var i = 0; i < numCruzamentos; i++) {
        var [pai1, pai2] = selecionarPais(populacao);
        var [filho1, filho2] = cruzar(pai1, pai2);
        filhosGerados.push(filho1, filho2);
    }
    // Aplicar mutação em 5% dos filhos gerados
    var numMutacoes = Math.floor(taxaMutacao * filhosGerados.length);
    var filhosMutados = [];
    for (var i = 0; i < numMutacoes; i++) {
        var indiceFilho = Math.floor(Math.random() * filhosGerados.length);
        var filho = filhosGerados[indiceFilho];
        var indice1 = Math.floor(Math.random() * filho.movimentos.length);
        var indice2 = Math.floor(Math.random() * filho.movimentos.length);
        while (indice1 === indice2) {
            indice2 = Math.floor(Math.random() * filho.movimentos.length);
        }
        // Permutar os movimentos
        [filho.movimentos[indice1], filho.movimentos[indice2]] = [filho.movimentos[indice2], filho.movimentos[indice1]];
        // Log dos filhos mutados e posições trocadas
        filhosMutados.push({
            ...filho, // Garantir que estamos copiando todas as propriedades do filho original
            numero: filho.numero + 'MUTADO',
            pontosTrocados: [indice1, indice2],
            movimentos: [...filho.movimentos] // Garantir que movimentos seja um array
        });
        console.log(`Filho escolhido para mutação: Agente ${filho.numero}`);
        console.log(`Posições trocadas: ${indice1} e ${indice2}`);
    }
    // Concatenar filhos mutados aos filhos gerados
    filhosGerados = filhosGerados.concat(filhosMutados);
    novaPopulacao = novaPopulacao.concat(filhosGerados);
    // Calcular o fitness para a nova população de filhos e mutados
    calcularFitnessPopulacao(novaPopulacao);
    // Concatenar filhos gerados (incluindo os mutados) na nova população
    // novaPopulacao = novaPopulacao.concat(filhosGerados);
    // console.table('Populacao atual', novaPopulacao);
    // Retornar a nova população com os filhos gerados e mutados
    return novaPopulacao;
}

// Função para aplicar cruzamento por G gerações
function aplicarCruzamento(populacao, taxaCruzamento, taxaMutacao, G) {
    var novaPopulacao = [...populacao];

    for (var g = 0; g < G; g++) {
        var numCruzamentos = Math.floor(taxaCruzamento * novaPopulacao.length / 2);
        var filhosGerados = [];

        // Realizar cruzamento para gerar filhos
        for (var i = 0; i < numCruzamentos; i++) {
            var [pai1, pai2] = selecionarPais(novaPopulacao);
            var [filho1, filho2] = cruzar(pai1, pai2);
            filhosGerados.push(filho1, filho2);
        }

        // Aplicar mutação em uma porcentagem dos filhos gerados
        var numMutacoes = Math.floor(taxaMutacao * filhosGerados.length);
        var filhosMutados = [];
        for (var i = 0; i < numMutacoes; i++) {
            var indiceFilho = Math.floor(Math.random() * filhosGerados.length);
            var filho = filhosGerados[indiceFilho];
            var indice1 = Math.floor(Math.random() * filho.movimentos.length);
            var indice2 = Math.floor(Math.random() * filho.movimentos.length);
            while (indice1 === indice2) {
                indice2 = Math.floor(Math.random() * filho.movimentos.length);
            }
            // Permutar os movimentos
            [filho.movimentos[indice1], filho.movimentos[indice2]] = [filho.movimentos[indice2], filho.movimentos[indice1]];
            // Log dos filhos mutados e posições trocadas
            filhosMutados.push({
                ...filho, // Garantir que estamos copiando todas as propriedades do filho original
                numero: filho.numero + 'MUTADO',
                pontosTrocados: [indice1, indice2],
                movimentos: [...filho.movimentos] // Garantir que movimentos seja um array
            });
            console.log(`Filho escolhido para mutação: Agente ${filho.numero}`);
            console.log(`Posições trocadas: ${indice1} e ${indice2}`);
        }

        // Concatenar filhos mutados aos filhos gerados
        filhosGerados = filhosGerados.concat(filhosMutados);
        novaPopulacao = novaPopulacao.concat(filhosGerados);

        // Calcular o fitness para a nova população de filhos e mutados
        calcularFitnessPopulacao(novaPopulacao);
    }

    // Retornar a nova população com os filhos gerados e mutados
    return novaPopulacao;
}

// Função para calcular o fitness de uma população
function calcularFitnessPopulacao(populacao) {
    populacao.forEach(agente => {
        if (Array.isArray(agente.movimentos)) {
            moverAgenteTemporario(agente, tamanhoTabuleiro, function(score) {
                agente.score = score;
                console.log(`Agente ${agente.numero} terminou com score: ${agente.score}`);
                // console.log(populacaoAposCruzamento)
                verificarTerminoDeAndar();
                if (agentesTerminaramDeAndar === populacaoAposCruzamento.length) {
                    moverAgentePrincipal(populacaoAposCruzamento)
                }
            });
        } else {
            console.error(`Movimentos não é um array para agente ${agente.numero}`);
        }
    });
}
// Função para selecionar dois pais aleatoriamente
function selecionarPais(populacao) {
    var pai1 = populacao[Math.floor(Math.random() * populacao.length)];
    var pai2 = populacao[Math.floor(Math.random() * populacao.length)];
    return [pai1, pai2];
}
// Função para cruzar dois pais e gerar dois filhos
function cruzar(pai1, pai2) {
    var numMovimentos = pai1.movimentos.length;
    var pontoCorte1 = Math.floor(Math.random() * numMovimentos);
    var pontoCorte2 = Math.floor(Math.random() * numMovimentos);
    if (pontoCorte1 > pontoCorte2) {
        [pontoCorte1, pontoCorte2] = [pontoCorte2, pontoCorte1];
    }
    var movimentosFilho1 = pai1.movimentos.slice(0, pontoCorte1)
        .concat(pai2.movimentos.slice(pontoCorte1, pontoCorte2))
        .concat(pai1.movimentos.slice(pontoCorte2));
    var movimentosFilho2 = pai2.movimentos.slice(0, pontoCorte1)
        .concat(pai1.movimentos.slice(pontoCorte1, pontoCorte2))
        .concat(pai2.movimentos.slice(pontoCorte2));
    var filho1 = {
        numero: `${pai1.numero}|${pai2.numero}`,
        x: 0,
        y: 0,
        movimentos: movimentosFilho1,
        score: 0
    };
    var filho2 = {
        numero: `${pai2.numero}|${pai1.numero}`,
        x: 0,
        y: 0,
        movimentos: movimentosFilho2,
        score: 0
    };
    return [filho1, filho2];
}
// 
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
//agente numero V1 (INICIANTE)
function moverAgente() {
    if (!jogoEmAndamento) {
        return; // Não move o agente se o jogo não estiver em andamento
    }
    var size = parseInt(document.getElementById('size').value);
    var tabuleiro = document.getElementById('tabuleiro');
    var currentCell = tabuleiro.querySelector(`.row:nth-child(${agentRow + 1}) .cell:nth-child(${agentCol + 1})`);
    currentCell.textContent = currentCell.textContent.replace(agentSymbol, '').replace(flecha, '');
    console.log('Movendo agente de forma aleatória.');
    // Escolher aleatoriamente uma direção (cima, baixo, esquerda, direita)
    var randomDirection = Math.floor(Math.random() * 4);
    // Atualizar a posição do agente de acordo com a direção escolhida
    switch (randomDirection) {
        case 0: // Cima
            if (agentRow > 0) agentRow--;
            break;
        case 1: // Baixo
            if (agentRow < size - 1) agentRow++;
            break;
        case 2: // Esquerda
            if (agentCol > 0) agentCol--;
            break;
        case 3: // Direita
            if (agentCol < size - 1) agentCol++;
            break;
    }
    mostrarDetalhes();
    agentPoints--;
    passosDados++;
    // Atualizar a exibição dos pontos do agente na tela
    var pontosAgenteSpan = document.getElementById('pontosAgente');
    if (pontosAgenteSpan) {
        pontosAgenteSpan.textContent = agentPoints;
    }
    // Verificar o conteúdo da nova célula após mover o agente
    var newAgentCell = tabuleiro.querySelector(`.row:nth-child(${agentRow + 1}) .cell:nth-child(${agentCol + 1})`);
    switch (newAgentCell.dataset.content) {
        case stenchSymbol:
        case 'AFVS':
            mensagem = '- Você sentiu um mau cheiro. Pressione "F" para atirar uma flecha.';
            var randomShoot = Math.random() < 0.5; // 50% de chance de atirar
            if (randomShoot) {
                atirarFlecha();
            }
            break;
        case goldSymbol:
            mensagem = '- Você encontrou o ouro, está na hora de ir.';
            // Remover o ouro da célula
            newAgentCell.dataset.content = newAgentCell.dataset.content.replace(goldSymbol, emptySymbol);
            newAgentCell.textContent = newAgentCell.textContent.replace(goldSymbol, emptySymbol);
            numGold--; // Decrementar o número de ouro
            ourosPegos += 1
                // Adicionar 1000 pontos ao agente
            agentPoints += 1000;
            // Atualizar a exibição dos pontos do agente na tela
            pontosAgenteSpan.textContent = agentPoints;
            break;
        case pitSymbol:
            mensagem = '';
            caiuEmPoco += 1;
            alert('Você caiu em um poço, cuidado!');
            fimDeJogo(); // Chama a função fimDeJogo se os pontos de vida acabarem
            break;
        case monsterSymbol:
            mensagem = '';
            MortoPorMonstro += 1
            alert('Você não foi sagaz, o monstro lhe achou!');
            fimDeJogo(); // Chama a função fimDeJogo se os pontos de vida acabarem
            break;
        case 'MB':
            MortoPorMonstro += 1
            alert('Você sentiu uma brisa, porém não prestou atenção e o monstro lhe achou!');
            fimDeJogo(); // Chama a função fimDeJogo se os pontos de vida acabarem
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
            mensagem = '-  Você sentiu um mal cheiro. Fique alerta, pode haver monstro ou poços ao redor!';
            break;
        case 'BS':
        case 'SB':
        case 'BBS':
        case 'BBBS':
        case 'AFVBS':
        case 'AFVBBS':
            mensagem = '- Você sentiu uma brisa forte e um mal cheiro. Fique alerta, pode haver monstro ou poços ao redor!';
            var randomShoot = Math.random() < 0.5; // 50% de chance de atirar
            if (randomShoot) {
                atirarFlecha();
            }
            break;
        case 'PS':
            mensagem = '';
            caiuEmPoco += 1;
            alert(' Você sentiu um mal cheiro. Porém não tomou cuidado e caiu em um poço!');
            fimDeJogo(); // Chama a função fimDeJogo se os pontos de vida acabarem
            break;
        case 'PB':
            mensagem = '';
            caiuEmPoco += 1;
            alert(' Você sentiu uma brisa forte. Porém não tomou cuidado e caiu em um poço!');
            fimDeJogo(); // Chama a função fimDeJogo se os pontos de vida acabarem
            break;
        case 'GS':
            mensagem = '- Você encontrou o ouro, mas sentiu um mal cheiro. Fique alerta, pode haver monstro ao redor!';
            var randomShoot = Math.random() < 0.5; // 50% de chance de atirar
            if (randomShoot) {
                atirarFlecha();
            }
            // Remover o ouro da célula
            newAgentCell.dataset.content = newAgentCell.dataset.content.replace(goldSymbol, emptySymbol);
            newAgentCell.textContent = newAgentCell.textContent.replace(goldSymbol, emptySymbol);
            numGold--; // Decrementar o número de ouro
            ourosPegos += 1
                // Adicionar 1000 pontos ao agente
            agentPoints += 1000;
            // Atualizar a exibição dos pontos do agente na tela
            pontosAgenteSpan.textContent = agentPoints;
            break;
        case 'GB':
        case 'GBB':
        case 'GBBB':
            mensagem = '- Você encontrou o ouro, mas sentiu uma brisa forte. Fique alerta, pode haver poços muito próximos!';
            // Remover o ouro da célula
            newAgentCell.dataset.content = newAgentCell.dataset.content.replace(goldSymbol, emptySymbol);
            newAgentCell.textContent = newAgentCell.textContent.replace(goldSymbol, emptySymbol);
            numGold--; // Decrementar o número de ouro
            ourosPegos += 1
                // Adicionar 1000 pontos ao agente
            agentPoints += 1000;
            // Atualizar a exibição dos pontos do agente na tela
            pontosAgenteSpan.textContent = agentPoints;
            break;
        case 'GBS':
        case 'GBBS':
        case 'GBBBS':
            mensagem = '- Você encontrou o ouro, mas sentiu uma brisa forte e sentiu um mal cheiro.. Fique alerta, pode haver poços muito próximos e o monstro a espreitar.';
            var randomShoot = Math.random() < 0.5; // 50% de chance de atirar
            if (randomShoot) {
                atirarFlecha();
            }
            // Remover o ouro da célula
            newAgentCell.dataset.content = newAgentCell.dataset.content.replace(goldSymbol, emptySymbol);
            newAgentCell.textContent = newAgentCell.textContent.replace(goldSymbol, emptySymbol);
            numGold--; // Decrementar o número de ouro
            ourosPegos += 1
                // Adicionar 1000 pontos ao agente
            agentPoints += 1000;
            // Atualizar a exibição dos pontos do agente na tela
            pontosAgenteSpan.textContent = agentPoints;
            break;
        case 'BBB':
            mensagem = '- Você sentiu uma brisa intensa. Há poços extremamente próximos.';
            break;
        case 'VB':
            mensagem = '- Você sentu uma brisa intensa. Há poços extremamente próximos.';
            break;
        case 'VBB':
            mensagem = '- Você sentiu uma brisa intensa. Há poços extremamente próximos.';
            break;
        default:
            mensagem = '- Você entrou em uma casa vazia.';
            break;
    }
    // Adiciona a mensagem à lista de detalhes
    var passoAPasso = document.getElementById('passoAPasso');
    var listItem = document.createElement('li');
    listItem.textContent = mensagem;
    passoAPasso.appendChild(listItem);
    var newCell = tabuleiro.querySelector(`.row:nth-child(${agentRow + 1}) .cell:nth-child(${agentCol + 1})`);
    newCell.textContent = agentSymbol + flecha + newCell.textContent;
    var mensagens = passoAPasso.querySelectorAll('li');
    var mensagemPegouOuro = false;
    mensagens.forEach(function(msg) {
        if (msg.textContent.includes('Você encontrou o ouro') ||
            msg.textContent.includes('Você encontrou o ouro, mas sentiu uma brisa forte e sentiu um mal cheiro.. Fique alerta, pode haver poços muito próximos e o monstro a espreitar.') ||
            msg.textContent.includes('Você encontrou o ouro, mas sentiu uma brisa forte. Fique alerta, pode haver poços muito próximos!') ||
            msg.textContent.includes('Você encontrou o ouro, mas sentiu um mal cheiro. Fique alerta, pode haver monstro ao redor!')) {
            mensagemPegouOuro = true;
        }
    });
    if (agentRow === 0 && agentCol === 0 && mensagemPegouOuro) {
        alert("Você conseguiu! Que tal aumentar o tamanho do tabuleiro para um desafio maior?");
        fimDeJogo();
    }
}
// Função para inicializar a matriz casasVisitadas com base no tamanho do tabuleiro
function inicializarCasasVisitadas(size) {
    casasVisitadas = [];
    for (let i = 0; i < size; i++) {
        casasVisitadas[i] = [];
        for (let j = 0; j < size; j++) {
            // Inicializa cada célula com uma string representando o estado visual inicial
            casasVisitadas[i][j] = '| . |';
        }
    }
}

function atualizarCasasVisitadas(linha, coluna, percepcao) {
    // Verifica se a linha e coluna estão dentro dos limites da matriz casasVisitadas
    if (linha >= 0 && linha < casasVisitadas.length && coluna >= 0 && coluna < casasVisitadas[linha].length) {
        // Atualiza a representação visual da casa na matriz casasVisitadas com base na percepção
        switch (percepcao) {
            case 'B':
            case 'BB': // Brisa
                casasVisitadas[linha][coluna] = '| B |';
                break;
            case 'P':
                casasVisitadas[linha][coluna] = '| P |';
                break;
            case 'V':
            case 'AV': // Visitado
                casasVisitadas[linha][coluna] = '| V |';
                break;
            case 'G': // Ouro
                casasVisitadas[linha][coluna] = '| G |';
                break;
            default:
                casasVisitadas[linha][coluna] = '| . |';
                break;
        }
    } else {
        console.error(`Posição inválida (${linha}, ${coluna}) para atualização na matriz casasVisitadas.`);
    }
}
// Função para atualizar o estado visual da célula no tabuleiro com a percepção atual
function atualizarEstadoCasa(linha, coluna, tabuleiro) {
    var cell = tabuleiro.querySelector(`.row:nth-child(${linha + 1}) .cell:nth-child(${coluna + 1})`);
    var percepcao = memoriaAgente[linha][coluna].percepcao;
    switch (percepcao) {
        case 'V':
        case 'AV':
            cell.textContent = 'V'; // Substitui o conteúdo visual da célula pela percepção atual
            break;
        case 'B':
            cell.textContent = 'B';
            break;
        case 'S':
            cell.textContent = 'S';
            break;
        case 'BS':
            cell.textContent = 'BS';
            break;
        case 'BB':
            cell.textContent = 'BB';
            break;
        case 'BBS':
            cell.textContent = 'BBS';
            break;
        case 'P':
            cell.textContent = 'P';
            break;
        case 'M':
            cell.textContent = 'M';
            break;
        case 'G':
            cell.textContent = 'G';
            break;
        default:
            cell.textContent = ''; // Caso não haja percepção específica, limpa o conteúdo da célula
            break;
    }
}

function atualizarPesos(linha, coluna) {
    // Obtenha a célula atual da memória do agente
    let celula = memoriaAgente[linha][coluna];
    // Se a célula já foi visitada e a percepção é "V", defina o peso como 0
    if (celula.visitado && celula.percepcao === 'V') {
        celula.peso = 0.1;
        return;
    }
    // Atualize os pesos com base na percepção da célula
    switch (celula.percepcao) {
        case 'P': // Poço
            celula.peso = 1; // Peso alto porque há um poço
            break;
        case 'AVB': // Brisa
        case 'B': // Brisa
        case 'BB': // Brisa
        case 'BBB': // Brisa
            celula.peso = 0.7; // Peso intermediário porque há uma brisa, sugerindo proximidade de um poço
            break;
        case 'AV': // Aviso
        case 'V': // Brisa
            celula.peso = 0.1; // Peso baixo, é um aviso mas não crítico
            break;
        default: // Qualquer outra percepção
            celula.peso = 0.1; // Peso padrão para células não visitadas ou sem percepção específica
            break;
    }
}

function moverAleatoriamenteComPercepcoes(size, tabuleiro) {
    var directions = [{
        linha: -1,
        coluna: 0,
        nome: 'Esquerda'
    }, {
        linha: 1,
        coluna: 0,
        nome: 'Direita'
    }, {
        linha: 0,
        coluna: -1,
        nome: 'Cima'
    }, {
        linha: 0,
        coluna: 1,
        nome: 'Baixo'
    }];




    // Mostrar a matriz casasVisitadas no console usando console.table
    // Array para armazenar as probabilidades de encontrar um poço em cada direção
    var probabilities = [];
    // Atualizar casas visitadas com informações de poços
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            casasVisitadas[i][j] = '| . |'; // Reinicia todas as casas como não visitadas
            // Ajustar para verificar poços no tabuleiro, considerando a estrutura correta do DOM
            var cell = tabuleiro.children[i].children[j]; // Ajuste aqui conforme a estrutura do seu tabuleiro no DOM
            if (cell.dataset.content.includes(pitSymbol)) {
                casasVisitadas[i][j] = '| P |'; // Marca as casas com poços
            }
        }
    }
    // Calcular as probabilidades com base nas percepções das casas vizinhas relevantes
    directions.forEach(direction => {
        var newLine = agentRow + direction.linha;
        var newCol = agentCol + direction.coluna;
        if (newLine >= 0 && newLine < size && newCol >= 0 && newCol < size) {
            var percepcao = memoriaAgente[newLine][newCol].percepcao;
            var peso = memoriaAgente[newLine][newCol].peso;
            var probabilidade = peso; // Inicialmente, consideramos apenas o peso
            // Se a percepção for brisa, aumentar a probabilidade
            if (percepcao === 'B') {
                probabilidade += 0.7; // Aumento de 0.7 na probabilidade
            }
            // Verificar as casas vizinhas das vizinhas relevantes apenas se o agente já as visitou
            var casasVizinhasRelevantes = [];
            if (newCol > 0 && memoriaAgente[newLine][newCol - 1].visitado) {
                casasVizinhasRelevantes.push(memoriaAgente[newLine][newCol - 1]);
            }
            if (newCol < size - 1 && memoriaAgente[newLine][newCol + 1].visitado) {
                casasVizinhasRelevantes.push(memoriaAgente[newLine][newCol + 1]);
            }
            if (newLine > 0 && memoriaAgente[newLine - 1][newCol].visitado) {
                casasVizinhasRelevantes.push(memoriaAgente[newLine - 1][newCol]);
            }
            if (newLine < size - 1 && memoriaAgente[newLine + 1][newCol].visitado) {
                casasVizinhasRelevantes.push(memoriaAgente[newLine + 1][newCol]);
            }
            // Se houver casas vizinhas relevantes, verificar se alguma tem brisa e aumentar a probabilidade
            if (casasVizinhasRelevantes.length > 0) {
                var vizinhosComBrisa = casasVizinhasRelevantes.filter(vizinho => vizinho.percepcao === 'B');
                if (vizinhosComBrisa.length > 0) {
                    probabilidade += 0.7; // Aumento de 0.7 na probabilidade
                }
            }
            // Limitar a probabilidade entre 0 e 1
            probabilidade = Math.max(0, Math.min(1, probabilidade));
            console.log(`Probabilidade para direção ${direction.nome}: ${probabilidade}`);
            probabilities.push({
                direction: direction,
                probability: probabilidade
            });
        }
    });
    // Filtrar as direções com a menor probabilidade
    var minProbability = Math.min(...probabilities.map(p => p.probability));
    var availableDirections = probabilities.filter(probability => probability.probability === minProbability);
    // Verificar se alguma direção disponível não leva a um poço
    var safeDirections = availableDirections.filter(dir => {
        var newLine = agentRow + dir.direction.linha;
        var newCol = agentCol + dir.direction.coluna;
        return newLine >= 0 && newLine < size && newCol >= 0 && newCol < size && casasVisitadas[newLine][newCol] !== '| P |';
    });
    // Escolher uma direção aleatória entre as direções seguras
    if (safeDirections.length > 0) {
        var randomDirection = safeDirections[Math.floor(Math.random() * safeDirections.length)].direction;
        console.log('Direção aleatória escolhida:', randomDirection.nome);
        // Mover o agente na direção escolhida
        agentRow += randomDirection.linha;
        agentCol += randomDirection.coluna;
        passosDados++;
        console.log('Nova posição do agente:', agentRow, agentCol);
        // Marcar a casa atual como visitada na memoriaAgente
        memoriaAgente[agentRow][agentCol].visitado = true;
        // Capturar percepção da nova casa
        capturarPercepcao(agentRow, agentCol, tabuleiro);
        atualizarMemoriaAgente(agentRow, agentCol, tabuleiro);
        atualizarCasasVisitadas(agentRow, agentCol, 'AF');
        console.log("Matriz casasVisitadas:");
        // console.table(casasVisitadas);
    } else {
        console.log('Nenhuma direção disponível para o movimento ou todas as direções levam a um poço.');
    }
}
// Função para atualizar a memória do agente após o movimento
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
            if (ourosPegos == 1) {
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
            if (ourosPegos == 1) {
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
            if (ourosPegos == 1) {
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
            if (ourosPegos == 1) {
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
setInterval(movimentoAutomatico, 1400);
// -----------------------------
// Função moverAgente3 (não precisa mexer em nada acima dessa linha)
function moverAgente32() {
    console.log("entrou na função");
    // moverAgentesTemporarios(populacaoAgentes);
}
// -----------------
function moverAgente3(caminho) {
    if (!Array.isArray(caminho) || caminho.length === 0) {
        console.error('Caminho inválido:', caminho);
        return;
    }
    if (!jogoEmAndamento) {
        return; // Não move o agente se o jogo não estiver em andamento
    }
    var size = parseInt(document.getElementById('size').value);
    var tabuleiro = document.getElementById('tabuleiro');
    var pontosAgenteSpan = document.getElementById('pontosAgente');
    var movimentosRealizados = 0;
    var memoriaAgente = []; // Para armazenar o caminho percorrido
    var encontrouOuro = false;
    caminho.forEach((movimento, index) => {
        setTimeout(() => {
            if (encontrouOuro) return; // Para de mover o agente se já encontrou o ouro
            // Limpar a célula anterior
            var previousCell = tabuleiro.querySelector(`.row:nth-child(${agentRow + 1}) .cell:nth-child(${agentCol + 1})`);
            previousCell.textContent = previousCell.textContent.replace(agentSymbol, '').replace(flecha, '');
            // Log de posição anterior
            console.log(`Passo ${index + 1}: Movimento ${movimento}`);
            console.log(`Direção: ${movimento}`);
            console.log(`Posição anterior: (row: ${agentRow}, col: ${agentCol})`);
            // Atualizar a posição do agente de acordo com a direção escolhida
            switch (movimento) {
                case 'esquerda':
                    if (agentRow > 0) agentRow--;
                    break;
                case 'direita':
                    if (agentRow < size - 1) agentRow++;
                    break;
                case 'cima':
                    if (agentCol > 0) agentCol--;
                    break;
                case 'baixo':
                    if (agentCol < size - 1) agentCol++;
                    break;
                default:
                    console.error('Movimento inválido:', movimento);
                    return;
            }
            // Log de nova posição
            console.log(`Nova posição: (row: ${agentRow}, col: ${agentCol})`);
            mostrarDetalhes();
            agentPoints--;
            passosDados++;
            memoriaAgente.push({
                row: agentRow,
                col: agentCol
            }); // Armazenar a posição atual na memória do agente
            // Atualizar a exibição dos pontos do agente na tela
            if (pontosAgenteSpan) {
                pontosAgenteSpan.textContent = agentPoints;
            }
            // Verificar o conteúdo da nova célula após mover o agente
            var newAgentCell = tabuleiro.querySelector(`.row:nth-child(${agentRow + 1}) .cell:nth-child(${agentCol + 1})`);
            var mensagem = '';
            switch (newAgentCell.dataset.content) {
                case stenchSymbol:
                case 'AFVS':
                    mensagem = '- Você sentiu um mau cheiro. Pressione "F" para atirar uma flecha.';
                    var randomShoot = Math.random() < 0.5; // 50% de chance de atirar
                    if (randomShoot) {
                        atirarFlecha();
                    }
                    break;
                case goldSymbol:
                case 'GS':
                case 'GB':
                case 'GBB':
                case 'GBBB':
                case 'GBS':
                case 'GBBS':
                case 'GBBBS':
                    mensagem = '- Você encontrou o ouro, está na hora de ir.';
                    // Remover o ouro da célula
                    newAgentCell.dataset.content = newAgentCell.dataset.content.replace(goldSymbol, emptySymbol);
                    newAgentCell.textContent = newAgentCell.textContent.replace(goldSymbol, emptySymbol);
                    numGold--; // Decrementar o número de ouro
                    ourosPegos += 1;
                    // Adicionar 1000 pontos ao agente
                    agentPoints += 1000;
                    // Atualizar a exibição dos pontos do agente na tela
                    pontosAgenteSpan.textContent = agentPoints;
                    encontrouOuro = true;
                    seguirRotaDeVolta2(memoriaAgente.reverse()); // Caminho de volta incluindo a casa inicial
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
                case pitSymbol:
                    mensagem = '';
                    caiuEmPoco += 1;
                    fimDeJogo(); // Chama a função fimDeJogo se cair em um poço
                    return;
                case monsterSymbol:
                    mensagem = '';
                    MortoPorMonstro += 1;
                    fimDeJogo(); // Chama a função fimDeJogo se encontrar um monstro
                    return;
                    // Adicionar outros casos conforme necessário...
                default:
                    mensagem = '- Você entrou em uma casa vazia.';
                    break;
            }
            // Adiciona a mensagem à lista de detalhes
            var passoAPasso = document.getElementById('passoAPasso');
            var listItem = document.createElement('li');
            listItem.textContent = mensagem;
            passoAPasso.appendChild(listItem);
            var newCell = tabuleiro.querySelector(`.row:nth-child(${agentRow + 1}) .cell:nth-child(${agentCol + 1})`);
            newCell.textContent = agentSymbol + flecha + newCell.textContent;
            var mensagens = passoAPasso.querySelectorAll('li');
            var mensagemPegouOuro = false;
            mensagens.forEach(function(msg) {
                if (msg.textContent.includes('Você encontrou o ouro') ||
                    msg.textContent.includes('Você encontrou o ouro, mas sentiu uma brisa forte e sentiu um mal cheiro.. Fique alerta, pode haver poços muito próximos e o monstro a espreitar.') ||
                    msg.textContent.includes('Você encontrou o ouro, mas sentiu uma brisa forte. Fique alerta, pode haver poços muito próximos!') ||
                    msg.textContent.includes('Você encontrou o ouro, mas sentiu um mal cheiro. Fique alerta, pode haver monstro ao redor!')) {
                    mensagemPegouOuro = true;
                }
            });
            if ((index === caminho.length - 1) || ((agentRow === 0 && agentCol === 0 && mensagemPegouOuro))) {
                alert('Parabéns! Você chegou ao destino final.');
                fimDeJogo();
            }
        }, (index + 1) * 1000);
        movimentosRealizados++;
    });
}

function seguirRotaDeVolta2(caminhoDeVolta) {
    caminhoDeVolta.forEach((pos, index) => {
        setTimeout(() => {
            var previousCell = tabuleiro.querySelector(`.row:nth-child(${agentRow + 1}) .cell:nth-child(${agentCol + 1})`);
            previousCell.textContent = previousCell.textContent.replace(agentSymbol, '').replace(flecha, '');
            agentRow = pos.row;
            agentCol = pos.col;
            var newCell = tabuleiro.querySelector(`.row:nth-child(${agentRow + 1}) .cell:nth-child(${agentCol + 1})`);
            newCell.textContent = agentSymbol + flecha + newCell.textContent;
            if (agentRow === 0 && agentCol === 0) {
                alert('Parabéns! Você chegou ao ponto inicial com o ouro.');
                fimDeJogo();
            }
        }, (index + 1) * 1000);
    });
}
// LOGICA DO AGENTE3 TERMINA AQUI (MAS ESTA TENDO ALGUNS BUGS!!!
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
            var populacaoAgentes = gerarPopulacao(4, 608); //1º(NUMERO DE INDIVIDUOS). 2º(TAMANHO DO VETOR)
            var taxaCruzamento = 0.85;
            // Aplicar cruzamento e mutação
            populacaoAposCruzamento = aplicarCruzamento(populacaoAgentes, taxaCruzamento, 0.05, 5);
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