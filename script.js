// Pontuação

let pontuacao = 0;

// Bola

class Bola {
    constructor(x, y, raio, velocidadeX, velocidadeY) {
        this.x = x;
        this.y = y;
        this.raio = raio;
        this.velocidadeX = velocidadeX;
        this.velocidadeY = velocidadeY;
    }
    draw(context) {
        context.beginPath();
        context.arc(this.x, this.y, this.raio, 0, Math.PI * 2);
        context.fillStyle = "blue";
        context.fill();
        context.closePath();
    }
    update() {
        this.x += this.velocidadeX;
        this.y += this.velocidadeY;
    }
}

// Remo

class Remo {
    constructor(x, y, largura, altura, velocidade) {
        this.x = x;
        this.y = y;
        this.largura = largura;
        this.altura = altura;
        this.velocidade = velocidade;
    }
    draw(context) {
        context.fillStyle = 'red';
        context.fillRect(this.x, this.y, this.largura, this.altura);

    }
    move(direction) {
        this.x += this.velocidade * direction;
    }
}

// Quebra

class Quebra {
    constructor(x, y, largura, altura) {
        this.x = x;
        this.y = y;
        this.largura = largura;
        this.altura = altura;
        this.status = 1;
    }
    draw(context) {
        if (this.status === 1) {
            context.fillStyle = 'green';
            context.fillRect(this.x, this.y, this.largura, this.altura);
        }
    }
}

// Jogo

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

const bola = new Bola(200, 200, 7, -2, -2);
const remo = new Remo(175, canvas.height -10, 100, 10, 15);

// Quebra parede

const quebras = [];

function criarQuebraParede() {
    const quebraContLinhas = 4;
    const quebraContColunas = 8;
    const quebraLargura = 50;
    const quebraAltura = 20;
    const quebraEspaco = 10;

    for (let c = 0; c < quebraContColunas; c++) {
        for (let r = 0; r < quebraContLinhas; r++) {
            const x = c * (quebraLargura + quebraEspaco);
            const y = r * (quebraAltura + quebraEspaco);
            quebras.push(new Quebra(x, y, quebraLargura, quebraAltura));
        }
    }
}

// Atualização e desenhos quebrados

function desenhaQuebras() {
    quebras.forEach(quebra => {
        if (quebra.status === 1) {
            quebra.draw(context);
            if (bola.x > quebra.x && bola.x < quebra.x + quebra.largura && 
                bola.y > quebra.y && bola.y < quebra.y + quebra.altura) {
                    bola.velocidadeY = -bola.velocidadeY;
                    quebra.status = 0;
                    pontuacao += 10;
                    document.getElementById("pontuacao").innerHTML = `Pontuação: ${pontuacao}`;
                }
        }
    })
}

// Controlador do remo

document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
        remo.move(-1);
    } else if (event.key === "ArrowRight") {
        remo.move(1);
    } else if (event.key === "ArrowUp"){
        remo.width = canvas.width;
    }
})

document.addEventListener("keyup", (event) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        remo.move(0);
    } else if (event.key === "ArrowDown") {
        remo.width = 70;
    } else if (event.key === "ArrowUp"){
        remo.width = 100;
    }
})

criarQuebraParede();

function resetaJogo(){
    bola.x = 200;
    bola.y = 200;
    bola.velocidadeX = -2;
    bola.velocidadeY = -2;
    remo.x = 175;
    remo.width = 100;
    pontuacao = 0;
    quebras.forEach(quebra => {
        quebra.status = 1;
    })
}

function loopJogo() {
    // Tela limpa
    context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    // Posição atualizada da bola de desenho
    bola.update();
    bola.draw(context);
    // Detecção de colisão de bola 
    if (bola.x - bola.raio < 0 || bola.x + bola.raio > canvas.width) {
        bola.velocidadeX = -bola.velocidadeX;
    } // Lados
    if (bola.y - bola.raio < 0) {
        bola.velocidadeY = -bola.velocidadeY;
    } // Lado de cima
    // Detecção de colisão de remo
    if (bola.x + bola.raio > remo.x &&
        bola.x - bola.raio < remo.x + remo.width &&
        bola.y + bola.raio > remo.y) {
        bola.velocidadeY = -bola.velocidadeY;
    }
    // 
    if (bola.y + bola.raio > canvas.height) {
        alert("Fim de jogo! Você perdeu!");
        resetaJogo();
    }

    if(quebras.every(quebra => quebra.status === 0)){
        alert("Parabéns! Você virou lenda! \n Score: " + pontuacao);
        resetaJogo();
    }
    // Remo
    remo.draw(context);
    // Quebras
    desenhaQuebras();
    // Loop
    requestAnimationFrame(loopJogo);
}

loopJogo();