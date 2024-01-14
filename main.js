//Mostrar imagem apenas quando ela carregar
const imagem = document.getElementById('imagem')

imagem.onload = function() {
    imagem.classList.add('carregada')
    var titulo = document.getElementById('titulo_texto')
    //Tirar texto
    titulo.textContent = ''
    titulo.style.marginBottom = titulo.style.fontSize = 'initial'
}

const links_exibidos = new Set()
//Fazer request da api do Danbooru
const endpointRandom = "https://danbooru.donmai.us/posts/random.json"

function pesquisar() {
    var tag1 = document.getElementById('tag1').value
    var tag2 = document.getElementById('tag2').value
    var errorMessageElement = document.getElementById('errorMessage')

    //Só executa se tag1 e tag2 for diferente de uma string vazia
    if (tag1.trim() !== '' && tag2.trim() !== '') {
        var tags = `tags=${tag1}+${tag2}`
        const apiUrl = `${endpointRandom}?${tags}`
        //console.log(tag1, tag2)

        //Request
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.status)
                }
                return response.json()
            })
            .then(postAleatorio => {
                var urlImagem = postAleatorio.file_url
                document.getElementById('imagem').src = urlImagem

                //Limpar mensagem de erro em caso de sucesso
                errorMessageElement.textContent = ''

                if (urlImagem === undefined) {
                    //console.log("NÃO DENIFIDO (ERROR)")
                    pesquisar() 
                    return
                }

                if (urlImagem !== undefined && links_exibidos.has(urlImagem)) {
                    //console.log("ESSE LINK JÁ APARECEU! E NÃO É UNDEFINED TENTANDO PROCURAR UMA IMAGEM NOVA")
                    pesquisar()
                    return

                }
                if (urlImagem.endsWith('.webm') || urlImagem.endsWith('.mp4')) {
                    //console.log('É UM VÍDEO')
                    //console.log(urlImagem)
                    pesquisar()
                    return
                }
                //Coloca o link gerado no Set com a função Add
                links_exibidos.add(urlImagem)
                console.log(links_exibidos)
            })
            .catch(error => {
                console.error("Error fetching random post:", error)
                //Exibir mensagem de erro
                if (error == 'Error: 404') {
                    errorMessageElement.textContent = "these tags don't exist ):"
                }
                else {
                    errorMessageElement.textContent = error
                    console.log(error)
                }
            })
    } else {
        alert("You need put tags :p")
    }
}