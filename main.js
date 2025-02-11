const imagem = document.getElementById('imagem')
const titulo = document.getElementById('titulo_texto')
const artista = document.getElementById('artista')
const links_exibidos = new Set()
const endpointRandom = "https://danbooru.donmai.us/posts/random.json"

async function pesquisar() {
    var tag1 = document.getElementById('tag1').value //Pega as tags do input
    var tag2 = document.getElementById('tag2').value
    var errorMessageElement = document.getElementById('errorMessage') //Mensagem de erro

    errorMessageElement.textContent = '' // Mensagem de erro vazia
    if (tag1.trim() == '' && tag2.trim() == '') { //Se não tiver tag tente o fetch com o endpoint
        try {
            var resposta = await fetch(endpointRandom)
            if (!resposta.ok) {
                throw new Error(`Status: ${resposta.status}`)
              }          
        }
        catch (error) {
            console.error("Deu erro:", error)
        }

        var post = await resposta.json()
        var imagem_aleatoria = post.file_url

        imagem.src = imagem_aleatoria
        imagem.style.display = 'block'
        titulo.textContent = ''

        console.log(imagem_aleatoria)

    } else {
        try {
            var tags = `tags=${tag1}+${tag2}`
            var endpointRandomTag = `${endpointRandom}?${tags}`
            var resposta = await fetch(endpointRandomTag)
            if (!resposta.ok) {
                throw new Error(`Status: ${resposta.status}`)
            }
          
        var post = await resposta.json()
        var imagem_aleatoria = post.file_url

        imagem.src = imagem_aleatoria
        imagem.style.display = 'block'
        titulo.textContent = ''

        }
        catch (error) {
            console.error(error)
            if (error == 'Error: Status: 404')
                console.log("Error Not Found")
                errorMessageElement.textContent = error
            }
        }

        }