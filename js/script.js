// Configurações da galeria de carros.
// Para adicionar novas fotos, coloque arquivos em assets/img/carros/ com nomes 1.png, 2.png, 3.png...
const PASTA_CARROS = 'assets/img/carros/';
const EXTENSAO_CARROS = '.png';

// Segurança para o navegador não tentar procurar infinitamente.
const MAX_NUMEROS_TESTADOS = 300;

// Quando o script já encontrou pelo menos uma imagem e aparecem alguns erros seguidos,
// ele entende que chegou ao fim da sequência. Isso evita travar se 6.png não existir, por exemplo.
const LIMITE_ERROS_CONSECUTIVOS = 4;
const INTERVALO_CARROSSEL = 4300;

const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');

if (menuToggle && mainNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  mainNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

function testarImagem(src) {
  return new Promise((resolve) => {
    const imagem = new Image();
    imagem.onload = () => resolve({ ok: true, src });
    imagem.onerror = () => resolve({ ok: false, src });
    imagem.src = src;
  });
}

async function buscarImagensNumeradas() {
  const encontradas = [];
  let errosSeguidos = 0;

  for (let numero = 1; numero <= MAX_NUMEROS_TESTADOS; numero += 1) {
    const caminho = `${PASTA_CARROS}${numero}${EXTENSAO_CARROS}`;
    const resultado = await testarImagem(caminho);

    if (resultado.ok) {
      encontradas.push({ numero, src: caminho });
      errosSeguidos = 0;
      continue;
    }

    errosSeguidos += 1;

    // Verificador de fim da sequência: se o navegador chegar no último número que existe
    // e começar a receber erro nos próximos arquivos, ele para a busca com segurança.
    if (encontradas.length > 0 && errosSeguidos >= LIMITE_ERROS_CONSECUTIVOS) {
      break;
    }

    // Se nem 1.png, 2.png, 3.png... existirem, para e mostra aviso.
    if (encontradas.length === 0 && errosSeguidos >= LIMITE_ERROS_CONSECUTIVOS) {
      break;
    }
  }

  return encontradas;
}

function criarCardCarro(item) {
  const card = document.createElement('article');
  card.className = 'car-card';
  card.setAttribute('aria-label', `Veículo vistoriado ${item.numero}`);

  const img = document.createElement('img');
  img.src = item.src;
  img.alt = `Veículo vistoriado pela InspeCar ${item.numero}`;
  img.loading = 'lazy';

  // Caso uma imagem seja apagada ou esteja corrompida depois que o carrossel já foi montado,
  // o card sai da tela sem quebrar a página.
  img.addEventListener('error', () => {
    card.remove();
  });

  card.appendChild(img);
  return card;
}
function iniciarCarrossel(imagens) {
  const track = document.getElementById('carTrack');
  const viewport = document.getElementById('carViewport');

  if (!track || !viewport) return;

  track.innerHTML = '';

  if (!imagens.length) {
    track.innerHTML = `
      <div class="loading-card">
        Nenhuma imagem encontrada. Adicione 1.png, 2.png, 3.png... em assets/img/carros/.
      </div>
    `;
    return;
  }

  if (imagens.length === 1) {
    track.classList.add('sem-animacao');
    track.appendChild(criarCardCarro(imagens[0]));
    return;
  }

  track.classList.remove('sem-animacao');

  /*
    Criamos uma sequência repetida de imagens.
    A primeira metade e a segunda metade são iguais.
    O CSS anima até -50% e reinicia sem o usuário perceber.
  */
  const sequencia = [];

  while (sequencia.length < 12) {
    imagens.forEach((imagem) => sequencia.push(imagem));
  }

  const listaRender = [...sequencia, ...sequencia];

  listaRender.forEach((item) => {
    track.appendChild(criarCardCarro(item));
  });

  /*
    Quanto mais imagens existirem, mais lenta fica a passagem,
    para dar tempo de mostrar todos os carros.
  */
  const duracao = Math.max(45, imagens.length * 8);
  track.style.setProperty('--duracao-carrossel', `${duracao}s`);

  /*
    Se alguma imagem quebrar depois que o carrossel já carregou,
    ela é removida sem travar o restante.
  */
  track.querySelectorAll('img').forEach((img) => {
    img.addEventListener('error', () => {
      const card = img.closest('.car-card');
      if (card) card.remove();
    });
  });
}
function iniciarAnimacoes() {
  const elementos = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    elementos.forEach((el) => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  elementos.forEach((el) => observer.observe(el));
}

document.addEventListener('DOMContentLoaded', async () => {
  iniciarAnimacoes();
  const imagens = await buscarImagensNumeradas();
  iniciarCarrossel(imagens);
});
