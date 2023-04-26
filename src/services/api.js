import axios from 'axios'

async function fetchAlbumInfo(artist, album) {
  console.log(artist, album)
  const options = {
    method: 'GET',
    url: 'https://theaudiodb.p.rapidapi.com/searchalbum.php',
    params: {
      s: artist,
      a: album
    },
    headers: {
      'content-type': 'application/octet-stream',
      'X-RapidAPI-Key': process.env.MUSIC_API_SECRET,
      'X-RapidAPI-Host': 'theaudiodb.p.rapidapi.com'
    }
  };
  
  try {
    const response = await axios.request(options)
    console.log(response.data)
    const albumData = {
      title: response.data.album[0].strAlbum,
      artist: response.data.album[0].strArtist,
      year: response.data.album[0].intYearReleased,
      art: response.data.album[0].strAlbumThumb,
      owner: undefined
    }
    return albumData
  } catch (error) {
    console.error(error)
  }
}



export {
  fetchAlbumInfo
}