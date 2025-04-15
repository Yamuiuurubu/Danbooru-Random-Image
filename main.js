const imagem = document.getElementById('imagem')
const titulo = document.getElementById('titulo_texto')
const artista = document.getElementById('artista')
const links_exibidos = new Set()
const endpointRandom = "https://danbooru.donmai.us/posts/random.json"
const endpointArtist = "https://danbooru.donmai.us/artists.json?search[name]="
const DanbooruArtistPage = "https://danbooru.donmai.us/artists/"

const sfw = document.getElementById('sfw_check')
//DEBUG
//console.log(sfw.checked)
//console.log("Valor inicial")

function checkcheck() {
    //DEBUG
    //console.log(sfw.checked)
    document.getElementById('tag2').classList.toggle('hidden', sfw.checked)
}


async function pesquisar() {
    var tag1 = document.getElementById('tag1').value //Pega as tags do input
    var tag2 = document.getElementById('tag2').value
    var mensagemDeErro = document.getElementById('errorMessage') //Mensagem de erro

    mensagemDeErro.textContent = '' // Mensagem de erro vazia


    // Sem tags
    // se as duas tags estão vazias e se sfw é falso então busque
    if (tag1.trim() == '' && tag2.trim() == '') { 
        if (sfw.checked === false) {
            try {
                let resposta = await fetch(endpointRandom)
                let post = await resposta.json()
                let art_url = post.media_asset.variants[3].url
                if (!resposta.ok) {
                    throw new Error(`Status: ${resposta.status}`) 
                }

                if (art_url === undefined) {
                    console.log("Deu undefined")
                    pesquisar()
                    return
                }
                imagem.style.display = 'block'
                titulo.textContent = ''
          
                imagem.src = art_url
                //DEBUG
                //console.log("SEM TAGS NÃO SEGURO")
                //console.log(resposta)
            
            }
            catch (error) {
                console.error("Deu erro:", error)
            }
        } else {
            //console.log("SEM TAGS SEGURO")
            try {
                let sfwsearch = `${endpointRandom}?tags=is:sfw`
                let resposta = await fetch(sfwsearch)
                let post = await resposta.json()
                let art_url = post.media_asset.variants[3].url
                imagem.src = art_url
                imagem.style.display = 'block'
                titulo.textContent = '' 
            } catch(error) {
                console.error(error)
            }
        }

    // Com tags
    } else {
        if (sfw.checked === true) {
            try {
                let tags_SFW = `tags=is:sfw+${tag1}`
                let sfwsearch = `${endpointRandom}?${tags_SFW}`
                let resposta = await fetch(sfwsearch)
                let post = await resposta.json()
                let art_url = post.media_asset.variants[3].url

                imagem.src = art_url
                imagem.style.display = 'block'
                titulo.textContent = ''

                //DEBUG
                console.log(sfwsearch)
                console.log("COM TAGS SEGURO")

            } catch (error) {
                console.error(error)
            }
        } else {
            try {
                let tags = `tags=${tag1}+${tag2}`
                let endpointRandomTag = `${endpointRandom}?${tags}`
                let resposta = await fetch(endpointRandomTag)
                let post = await resposta.json()
                
                let art_url = post.media_asset.variants[3].url
                let artistName = post.tag_string_artist //nome do artista
    
                let artistResponse = await fetch(endpointArtist + artistName)
                let artistJson = await artistResponse.json()
                let artistId = artistJson[0].id
                let artistPage = DanbooruArtistPage + artistId
                
                if (art_url === undefined) {
                    console.log("Deu undefined")
                    pesquisar()
                    return
                }
            
                //DEBUG
                //console.log("COM TAGS NÃO SEGURO")
                //console.log(endpointRandomTag)
                //console.log(resposta)


                imagem.src = art_url
                imagem.style.display = 'block'
                titulo.textContent = ''
                artista.innerHTML = `Artist: <a href='${artistPage}' class='ArtistPageLink'>${artistName}</a>`
    
            } catch (error) {
                console.error(error)
                console.log(error)
                if (error = 404) {
                    mensagemDeErro.innerHTML = ":( These tags don't exist, check <a href='https://danbooru.donmai.us/tags' target='_blank' class='tagslink'>Danbooru Tags (;</a>";
                }
            }

        }
    }

}