//Mostrar imagem apenas quando ela carregar
const imagem = document.getElementById('imagem');

imagem.onload = function() {
    imagem.classList.add('carregada');
    var titulo = document.getElementById('titulo_texto')
    //Tirar texto
    titulo.textContent = ''
    titulo.style.marginBottom = '0';
    titulo.style.fontSize = 'initial';
};


//Fazer request da api do Danbooru
const endpointRandom = "https://danbooru.donmai.us/posts/random.json";

function pesquisar() {
    var tag1 = document.getElementById('tag1').value;
    var tag2 = document.getElementById('tag2').value;
    var errorMessageElement = document.getElementById('errorMessage');

    if (tag1.trim() !== '' && tag2.trim() !== '') {
        var tags = `tags=${tag1}+${tag2}`;
        const apiUrl = `${endpointRandom}?${tags}`;
        //Request
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.status);
                }
                return response.json();
            })
            .then(postAleatorio => {
                const urlImagem = postAleatorio.file_url;
                document.getElementById('imagem').src = urlImagem;
                //Limpar mensagem de erro em caso de sucesso
                errorMessageElement.textContent = '';
            })
            .catch(error => {
                console.error("Error fetching random post:", error);
                //Exibir mensagem de erro
                errorMessageElement.textContent = "These tags don't exist ):";
            });
    } else {
        alert("You need put tags :p");
    }
}