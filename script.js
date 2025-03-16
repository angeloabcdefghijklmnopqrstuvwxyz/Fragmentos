// Pegando o elemento do contêiner da câmera
const cameraContainer = document.getElementById('camera-container');

// Criando o elemento de vídeo principal
const video = document.createElement('video');
video.id = "camera";
video.autoplay = true;
video.playsInline = true; // Evita problemas no iOS
cameraContainer.appendChild(video);

// Conjunto de fontes para a frase
const fonts = [
    "'Courier New', Courier, monospace",
    "Arial, sans-serif",
    "'Times New Roman', Times, serif",
    "'Comic Sans MS', cursive, sans-serif",
    "'Lucida Console', Monaco, monospace",
    "'Verdana', Geneva, sans-serif",
    "'Georgia', serif"
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

// Variáveis para armazenar a posição inicial do toque
let touchStartY = 0;
let touchEndY = 0;

// Função para detectar deslize para baixo
function handleSwipe(event) {
    if (event.deltaY > 0 && !questionActive) { // Só permite deslizar se a tela de pergunta não estiver ativa
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
    if (touchStartY - touchEndY > 50 && !questionActive) { // Só permite deslizar se a tela de pergunta não estiver ativa
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

// Função para mover a frase para uma posição aleatória e trocar a fonte
function moveQuestionRandomly(question) {
    const maxWidth = window.innerWidth - question.offsetWidth;
    const maxHeight = window.innerHeight - question.offsetHeight;
    const randomX = Math.floor(Math.random() * maxWidth);
    const randomY = Math.floor(Math.random() * maxHeight);
    const randomFont = fonts[Math.floor(Math.random() * fonts.length)];
    question.style.left = `${randomX}px`;
    question.style.top = `${randomY}px`;
    question.style.fontFamily = randomFont;
}

// Função para atualizar a exibição da câmera
function updateCameraDisplay() {
    cameraContainer.innerHTML = ''; // Limpa o contêiner

    // Remove todas as classes antigas do layout
    cameraContainer.className = 'layout ' + layouts[swipeCount - 1];

    // Adiciona as imagens da câmera ao contêiner
    for (let i = 0; i < swipeCount; i++) {
        const videoClone = document.createElement('video');
        videoClone.srcObject = video.srcObject;
        videoClone.autoplay = true;
        videoClone.playsInline = true;
        videoClone.style.width = `${100 / swipeCount}%`; // Divide o espaço igualmente
        videoClone.style.height = '100%'; // Ocupa toda a altura
        cameraContainer.appendChild(videoClone);
    }

    // Adiciona a pergunta "ESSE É VOCÊ?" após a quinta deslizada
    if (swipeCount === 5) {
        const question = document.createElement('div');
        question.textContent = "ESSE É VOCÊ?";
        question.className = 'question'; // Aplica a classe question
        cameraContainer.appendChild(question);

        questionActive = true; // Define que a tela de pergunta está ativa

        // Função para piscar a frase em locais aleatórios
        function blinkQuestion() {
            question.style.visibility = 'hidden'; // Esconde a frase
            setTimeout(() => {
                moveQuestionRandomly(question);
                question.style.visibility = 'visible'; // Mostra a frase
            }, 100); // Intervalo de 100ms
        }

        // Chama a função blinkQuestion a cada 500ms
        const blinkInterval = setInterval(blinkQuestion, 500);

        // Transição da tela final para o início após 3 segundos
        setTimeout(() => {
            clearInterval(blinkInterval); // Para o intervalo de piscar
            questionActive = false; // Define que a tela de pergunta não está mais ativa
            swipeCount = 1;
            updateCameraDisplay();
        }, 3000); // 3 segundos
    }
}

// Impede que o clique nos botões propague para o documento
document.querySelectorAll('.button-container button').forEach(button => {
    button.addEventListener('click', (event) => {
        event.stopPropagation(); // Impede a propagação do evento
    });
    // Adiciona atributos de acessibilidade
    button.setAttribute('aria-label', button.textContent.trim());
});

// Inicia a câmera quando a página carregar
iniciarCamera();