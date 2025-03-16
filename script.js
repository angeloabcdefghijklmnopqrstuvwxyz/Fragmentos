// Pegando o elemento do contêiner da câmera
const cameraContainer = document.getElementById('camera-container');

// Criando o elemento de vídeo principal
const video = document.createElement('video');
video.id = "camera";
video.autoplay = true;
video.playsInline = true; // Evita problemas no iOS
cameraContainer.appendChild(video);

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

// Função para detectar deslize para baixo
function handleSwipe(event) {
    if (event.deltaY > 0) {
        swipeCount = (swipeCount % 5) + 1; // Alterna entre 1 e 5
        updateCameraDisplay();
    }
}

// Adiciona eventos de deslize para baixo
document.addEventListener('wheel', handleSwipe); // Para PC
document.addEventListener('touchmove', handleSwipe); // Para celular

// Função para adicionar o efeito de "glitch"
function addGlitchEffect(element) {
    element.classList.add('glitch');
    setTimeout(() => {
        element.classList.remove('glitch');
        swipeCount = 1; // Reinicia o contador
        updateCameraDisplay(); // Reinicia a exibição
    }, 1000); // Duração do efeito de "glitch"
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
        cameraContainer.appendChild(videoClone);
    }

    // Adiciona a pergunta "Esse é você?" após a quarta deslizada
    if (swipeCount === 5) {
        const question = document.createElement('div');
        question.textContent = "Esse é você?";
        question.style.position = 'absolute';
        question.style.top = '50%';
        question.style.left = '50%';
        question.style.transform = 'translate(-50%, -50%)';
        question.style.fontSize = '24px';
        question.style.color = 'white';
        question.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        question.style.padding = '10px';
        question.style.borderRadius = '10px';
        cameraContainer.appendChild(question);

        // Adiciona o efeito de "glitch" e reinicia
        addGlitchEffect(question);
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