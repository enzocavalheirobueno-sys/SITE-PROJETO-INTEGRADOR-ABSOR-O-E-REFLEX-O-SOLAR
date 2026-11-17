/* ========================================
   SOL + ÁGUA - JavaScript
   Absorção, Reflexão e Transmissão da Radiação Solar
   ======================================== */

// ===== ACESSIBILIDADE =====
function toggleContraste() {
  document.body.classList.toggle('alto-contraste');
}

function toggleDislexia() {
  document.body.classList.toggle('fonte-dislexia');
}

let tamanhoFonte = 16;

function aumentarFonte() {
  tamanhoFonte = Math.min(tamanhoFonte + 2, 24);
  document.body.style.fontSize = tamanhoFonte + 'px';
}

function diminuirFonte() {
  tamanhoFonte = Math.max(tamanhoFonte - 2, 12);
  document.body.style.fontSize = tamanhoFonte + 'px';
}

// ===== QUIZ =====
function responderQuiz(botao, correta) {
  const opcoes = botao.parentElement.querySelectorAll('.quiz-opcao');
  
  opcoes.forEach(op => {
    op.disabled = true;
    op.style.cursor = 'default';
  });

  if (correta) {
    botao.classList.add('correta');
  } else {
    botao.classList.add('errada');
    
    // Destaca a resposta correta
    opcoes.forEach(op => {
      // Verifica se o onclick contém true
      if (op.getAttribute('onclick') && op.getAttribute('onclick').includes('true')) {
        op.classList.add('correta');
      }
    });
  }
}

// ===== SIMULADOR =====
const canvas = document.getElementById('canvasPiscina');
const ctx = canvas ? canvas.getContext('2d') : null;

function atualizarSimulador() {
  if (!canvas || !ctx) return;

  const corInput = document.getElementById('corSuperficie');
  const transpInput = document.getElementById('transparencia');
  const intensidadeInput = document.getElementById('intensidadeSol');

  if (!corInput || !transpInput || !intensidadeInput) return;

  const cor = corInput.value;
  const transp = parseInt(transpInput.value);
  const intensidade = parseInt(intensidadeInput.value);

  // Atualiza os valores exibidos
  const valorTransp = document.getElementById('valorTransp');
  const valorSol = document.getElementById('valorSol');
  
  if (valorTransp) valorTransp.textContent = transp;
  if (valorSol) valorSol.textContent = intensidade;

  // Cálculo simplificado de temperatura
  const luminosidade = getLuminosidade(cor); // 0 = preto, 1 = branco
  const absorcao = 1 - luminosidade;
  const efeitoEstufa = (transp / 100) * 0.75;
  const temp = 17 + (absorcao * intensidade * 0.28) + (efeitoEstufa * 9) + (intensidade * 0.04);

  const resultado = document.getElementById('resultadoTemp');
  if (resultado) {
    resultado.innerHTML = `
      Temperatura estimada da água
      <strong>${temp.toFixed(1)} °C</strong>
    `;
  }

  desenharPiscina(cor, transp, intensidade);
}

function getLuminosidade(hex) {
  const r = parseInt(hex.substr(1, 2), 16);
  const g = parseInt(hex.substr(3, 2), 16);
  const b = parseInt(hex.substr(5, 2), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

function desenharPiscina(corFundo, transp, intensidade) {
  if (!ctx || !canvas) return;

  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  // Céu
  const gradCeu = ctx.createLinearGradient(0, 0, 0, 140);
  gradCeu.addColorStop(0, '#4fc3f7');
  gradCeu.addColorStop(1, '#81d4fa');
  ctx.fillStyle = gradCeu;
  ctx.fillRect(0, 0, w, 140);

  // Sol
  const solX = 480;
  const solY = 55;
  const raioSol = 28 + intensidade / 12;

  // Brilho externo do sol
  ctx.beginPath();
  ctx.arc(solX, solY, raioSol, 0, Math.PI * 2);
  ctx.fillStyle = '#FFD54F';
  ctx.fill();

  // Centro do sol
  ctx.beginPath();
  ctx.arc(solX, solY, raioSol * 0.7, 0, Math.PI * 2);
  ctx.fillStyle = '#FFECB3';
  ctx.fill();

  // Raios do sol
  ctx.strokeStyle = `rgba(255, 213, 79, ${intensidade / 120})`;
  ctx.lineWidth = 2.5;
  for (let i = 0; i < 12; i++) {
    const ang = (i / 12) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(
      solX + Math.cos(ang) * (raioSol + 5),
      solY + Math.sin(ang) * (raioSol + 5)
    );
    ctx.lineTo(
      solX + Math.cos(ang) * (raioSol + 22),
      solY + Math.sin(ang) * (raioSol + 22)
    );
    ctx.stroke();
  }

  // Cobertura transparente
  ctx.fillStyle = `rgba(180, 230, 255, ${transp / 100 * 0.45})`;
  ctx.fillRect(50, 125, 460, 22);
  ctx.strokeStyle = '#0277bd';
  ctx.lineWidth = 3;
  ctx.strokeRect(50, 125, 460, 22);

  // Água
  const gradAgua = ctx.createLinearGradient(0, 147, 0, 300);
  gradAgua.addColorStop(0, '#4fc3f7');
  gradAgua.addColorStop(1, '#0288d1');
  ctx.fillStyle = gradAgua;
  ctx.fillRect(60, 147, 440, 155);

  // Fundo da piscina
  ctx.fillStyle = corFundo;
  ctx.fillRect(60, 280, 440, 35);

  // Textos
  ctx.fillStyle = '#01579b';
  ctx.font = 'bold 13px Poppins, sans-serif';
  ctx.fillText('Cobertura transparente', 190, 140);

  ctx.fillStyle = '#ffffff';
  ctx.font = '12px Poppins, sans-serif';
  ctx.fillText('Água', 255, 220);
  ctx.fillText('Fundo', 255, 302);
}

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', function() {
  // Inicializa o simulador se o canvas existir
  if (document.getElementById('canvasPiscina')) {
    atualizarSimulador();
  }

  // Adiciona listeners nos controles (caso o oninput não esteja no HTML)
  const corSuperficie = document.getElementById('corSuperficie');
  const transparencia = document.getElementById('transparencia');
  const intensidadeSol = document.getElementById('intensidadeSol');

  if (corSuperficie) {
    corSuperficie.addEventListener('input', atualizarSimulador);
  }
  if (transparencia) {
    transparencia.addEventListener('input', atualizarSimulador);
  }
  if (intensidadeSol) {
    intensidadeSol.addEventListener('input', atualizarSimulador);
  }
});
