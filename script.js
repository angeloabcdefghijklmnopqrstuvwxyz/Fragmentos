// Pegando o elemento do contêiner da câmera
const cameraContainer = document.getElementById('camera-container');

// Criando o elemento de vídeo principal
const video = document.createElement('video');
video.id = "camera";
video.autoplay = true;
video.playsInline = true; // Evita problemas no iOS
cameraContainer.appendChild(video);

// Conjunto de fontes e cores para as frases
const fonts = [
    "'Courier New', Courier, monospace",
    "Arial, sans-serif",
    "'Times New Roman', Times, serif",
    "'Comic Sans MS', cursive, sans-serif",
    "'Lucida Console', Monaco, monospace"
];
const colors = [
    'white',  // Fundo branco
    'black',  // Fundo preto
    '#0000ff',  // Azul forte de TV de tubo
    '#ff1493', // Rosa mais forte
    '#00ff00'  // Verde mais claro
];

// Conjunto de cores de texto para fundos claros
const textColors = [
    'black',  // Texto preto para fundo claro (usado para fundo branco)
    'white',  // Texto branco para outros fundos
    'white',  // Texto branco para fundo azul
    'white',  // Texto branco para fundo rosa
    'black'   // Texto preto para fundo verde
];

// Função para acessar a câmera
function iniciarCamera() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert("Seu navegador não suporta a câmera ou o acesso foi negado.");
        return;
    }

    navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } })
        .then(stream => {
            console.log("Câmera acessada com sucesso!");
            video.srcObject = stream;
            updateCameraDisplay(); // Exibe a câmera ao carregar a página
        })
        .catch(error => {
            console.error("Erro ao acessar a câmera:", error);
            alert("Erro ao acessar a câmera. Verifique as permissões.");
        });
}

// Lista de layouts
const layouts = ['tiktok-layout', 'reels-layout', 'shorts-layout', 'kwai-layout'];

// Variável para contar quantas vezes o usuário deslizou ou clicou
let swipeCount = 1; // Começa com 1 para exibir a câmera ao carregar
let questionActive = false; // Indica se a tela de pergunta está ativa
let inFinalPhase = false; // Indica se estamos na fase final

// Variáveis para armazenar a posição inicial do toque
let touchStartY = 0;
let touchEndY = 0;

// Função para detectar deslize para baixo
function handleSwipe(event) {
    if (event.deltaY > 0 && !questionActive && !inFinalPhase) { // Só permite deslizar se a tela de pergunta não estiver ativa e não estiver na fase final
        swipeCount = (swipeCount % 5) + 1; // Alterna entre 1 e 5
        updateCameraDisplay();
    }
}

// Funções para detectar deslize em dispositivos móveis
function handleTouchStart(event) {
    touchStartY = event.touches[0].clientY;
}

function handleTouchMove(event) {
    touchEndY = event.touches[0].clientY;
}

function handleTouchEnd() {
    if (touchStartY - touchEndY > 50 && !questionActive && !inFinalPhase) { // Só permite deslizar se a tela de pergunta não estiver ativa e não estiver na fase final
        swipeCount = (swipeCount % 5) + 1; // Alterna entre 1 e 5
        updateCameraDisplay();
    }
}

// Adiciona eventos de deslize para baixo
document.addEventListener('wheel', handleSwipe); // Para PC

// Adiciona eventos de toque para dispositivos móveis
document.addEventListener('touchstart', handleTouchStart);
document.addEventListener('touchmove', handleTouchMove);
document.addEventListener('touchend', handleTouchEnd);

// Função para adicionar o efeito de "glitch"
function addGlitchEffect(element) {
    element.classList.add('glitch');
    setTimeout(() => {
        element.classList.remove('glitch');
        swipeCount = 1; // Reinicia o contador
        updateCameraDisplay(); // Reinicia a exibição
    }, 1000); // Duração do efeito de "glitch"
}

// Função para centralizar a frase no meio de cada vídeo
function centerQuestion(question, video) {
    const videoRect = video.getBoundingClientRect();
    question.style.left = `${videoRect.left + videoRect.width / 2 - question.offsetWidth / 2}px`;
    question.style.top = `${videoRect.top + videoRect.height / 2 - question.offsetHeight / 2}px`;
}

// Função para adicionar e centralizar frases no meio de cada vídeo
function addCenteredQuestions(videos) {
    videos.forEach((video, index) => {
        const question = document.createElement('div');
        question.textContent = "ESSE É VOCÊ?";
        question.className = 'question';
        question.style.fontFamily = 'Arial, sans-serif';
        question.style.fontSize = '36px'; // Tamanho da fonte diminuído
        question.style.backgroundColor = 'transparent';
        cameraContainer.appendChild(question);
        question.style.visibility = 'visible';
        centerQuestion(question, video);
    });
}

// Função para adicionar frases uma após a outra em cantos aleatórios da tela
function addQuestionsGradually(questions, count) {
    for (let i = 0; i < count; i++) {
        const question = document.createElement('div');
        question.textContent = "ESSE É VOCÊ?";
        question.className = 'question';
        cameraContainer.appendChild(question);
        questions.push(question);
        setTimeout(() => {
            question.style.visibility = 'visible';
            placeQuestionRandomly(question, i);
        }, i * 250); // Adiciona a próxima pergunta após 250ms
    }
}

// Função para posicionar a frase em um canto aleatório da tela
function placeQuestionRandomly(question, index) {
    const maxWidth = window.innerWidth - question.offsetWidth;
    const maxHeight = window.innerHeight - question.offsetHeight;
    const randomX = Math.floor(Math.random() * maxWidth);
    const randomY = Math.floor(Math.random() * maxHeight);
    const randomFont = fonts[Math.floor(Math.random() * fonts.length)];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const randomTextColor = textColors[colors.indexOf(randomColor)];
    question.style.left = `${randomX}px`;
    question.style.top = `${randomY}px`;
    question.style.fontFamily = randomFont;
    question.style.backgroundColor = randomColor;
    question.style.color = randomTextColor;
}

// Função para atualizar a exibição da câmera
function updateCameraDisplay() {
    cameraContainer.innerHTML = ''; // Limpa o contêiner

    // Remove todas as classes antigas do layout
    cameraContainer.className = 'layout ' + layouts[swipeCount - 1];

    const videos = [];

    // Adiciona as imagens da câmera ao contêiner
    for (let i = 0; i < swipeCount; i++) {
        const videoClone = document.createElement('video');
        videoClone.srcObject = video.srcObject;
        videoClone.autoplay = true;
        videoClone.playsInline = true;
        videoClone.style.width = `${100 / swipeCount}%`; // Divide o espaço igualmente
        videoClone.style.height = '100%'; // Ocupa toda a altura
        cameraContainer.appendChild(videoClone);
        videos.push(videoClone);
    }

    // Adiciona as perguntas "ESSE É VOCÊ?" no meio de cada vídeo
    if (swipeCount === 5) {
        inFinalPhase = true; // Indica que estamos na fase final
        addCenteredQuestions(videos);

        // Adiciona mais 10 frases gradualmente após 2 segundos
        const questions = [];
        setTimeout(() => {
            addQuestionsGradually(questions, 10);
        }, 2000);

        // Transição da tela final para o início após 5 segundos
        setTimeout(() => {
            questions.forEach(question => question.style.visibility = 'hidden');
            questionActive = false; // Define que a tela de pergunta não está mais ativa
            inFinalPhase = false; // Sai da fase final
            swipeCount = 1;
            updateCameraDisplay();
        }, 5000); // 5 segundos
    }
}

// Impede que o clique nos botões propague para o documento
document.querySelectorAll('.button-container button').forEach(button => {
    button.addEventListener('click', (event) => {
        event.stopPropagation();
    });
    button.setAttribute('aria-label', button.textContent.trim());
});

// Inicia a câmera quando a página carregar
iniciarCamera();