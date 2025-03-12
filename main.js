const imagem = document.getElementById('imagem')
const titulo = document.getElementById('titulo_texto')
const artista = document.getElementById('artista')
const links_exibidos = new Set()
const endpointRandom = "https://danbooru.donmai.us/posts/random.json"
const endpointArtist = "https://danbooru.donmai.us/artists.json?search[name]="
const DanbooruArtistPage = "https://danbooru.donmai.us/artists/"

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js');
}

async function pesquisar() {
    var tag1 = document.getElementById('tag1').value //Pega as tags do input
    var tag2 = document.getElementById('tag2').value
    var mensagemDeErro = document.getElementById('errorMessage') //Mensagem de erro

    mensagemDeErro.textContent = '' // Mensagem de erro vazia
    // Sem tags
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
    // Com tags    
    } else {
        try {
            let tags = `tags=${tag1}+${tag2}`
            let endpointRandomTag = `${endpointRandom}?${tags}`
            let resposta = await fetch(endpointRandomTag)
            let post = await resposta.json()
            
            let art = post.file_url //arte
            let artistName = post.tag_string_artist //nome do artista

            let artistResponse = await fetch(endpointArtist + artistName)
            let artistJson = await artistResponse.json()
            let artistId = artistJson[0].id
            let artistPage = DanbooruArtistPage + artistId

            if (!resposta.ok) {
                throw new Error(`Status: ${resposta.status}`)
            }

            if (art === undefined) {
                console.log("Deu undefined")
                pesquisar()
                return
            }

        imagem.src = art
        imagem.style.display = 'block'
        titulo.textContent = ''
        artista.innerHTML = `Artist: <a href='${artistPage}' class='ArtistPageLink'>${artistName}</a>`

        }
        catch (error) {
            console.error(error)
            if (error == 'Error: Status: 404') {
                mensagemDeErro.innerHTML = ":( These tags don't exist, check <a href='https://danbooru.donmai.us/tags' target='_blank' class='tagslink'>Danbooru Tags (;</a>";
            }
            }
        }

    }