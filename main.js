const imagem = document.getElementById('imagem') //Imagem
const titulo = document.getElementById('titulo_texto')
const artista = document.getElementById('artista')

const links_exibidos = new Set() //Cria um set para ler os links já exibidos

//"tag_string_artist": "geistbox"

const endpointRandom = "https://danbooru.donmai.us/posts/random.json" //Fazer request da api do Danbooru

function pesquisar() {
    var tag1 = document.getElementById('tag1').value
    var tag2 = document.getElementById('tag2').value
    var errorMessageElement = document.getElementById('errorMessage')

    //Só executa se tag1 e tag2 for diferente de uma string vazia
    if (tag1.trim() !== '' && tag2.trim() !== '') {
        var tags = `tags=${tag1}+${tag2}`
        const apiUrl = `${endpointRandom}?${tags}`

        //Busca usando fetch()
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.status)
                }
                return response.json()
            })
            .then(postAleatorio => {
                var urlImagem = postAleatorio.file_url
                var artista_nome = postAleatorio.tag_string_artist
                imagem.src = urlImagem
                imagem.style.filter = "blur(0) contrast(100%) brightness(100%) grayscale(0)"
                imagem.style.display = 'block'

                artista.textContent = 'Artist: ' + artista_nome

                //Limpar mensagem de erro em caso de sucesso
                errorMessageElement.textContent = ''
                //Remove o titulo em caso de sucesso
                titulo.textContent = ''
                titulo.style.marginBottom = titulo.style.fontSize = 'initial'

                if (urlImagem === undefined) {
                    //console.log("NÃO DENIFIDO (ERROR)")
                    imagem.style.display = 'none'
                    pesquisar() 
                    return
                }

                if (urlImagem !== undefined && links_exibidos.has(urlImagem)) {
                    imagem.style.filter = "blur(5px) contrast(70%) brightness(60%) grayscale(100%)"
                    pesquisar()
                    return
                }
                if (urlImagem.endsWith('.webm') || urlImagem.endsWith('.mp4')) {
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
                    errorMessageElement.innerHTML = ":( These tags don't exist, check <a href='https://danbooru.donmai.us/tags' target='_blank' class='tagslink'>Danbooru Tags</a>";
                }
                else {
                    errorMessageElement.textContent = error
                    console.log(error)
                }
            })
    } else {
        alert("Please insert 2 tags")
    }
}