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

// Função para detectar toque ou clique
function handleInteraction() {
    swipeCount = (swipeCount % 4) + 1; // Alterna entre 1 e 4
    updateCameraDisplay();
}

// Adiciona eventos de toque e clique
document.addEventListener('touchstart', handleInteraction); // Para celular
document.addEventListener('click', handleInteraction); // Para PC

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