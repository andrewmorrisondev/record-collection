# [VYNL](https://record-collection.fly.dev/)

## Don't judge a record by its sleeve... or do.

VYNL is a social app built with the MEN stack. Show off your favorite records, discover your friends niche tastes. Learn something about your favorite new artist along the way.

<img src="https://i.imgur.com/EiJjRN1.png"  max-width="600" max-height="640">
<img src="https://i.imgur.com/woYPGJi.png"  max-width="300" max-height="640">

## TheAudioDB API
Hooking up to this API gives me access to a DB of pretty much every album released in the US. As a result, the `record-cards` auto-populate based off the information coming from `req.body`
### Endpoint - Exposed
To handle requests to the API, I'm using a `promise based HTTP client` for node.js, `Axios`. 
<br>
The following function, `fetchAlbumInfo` takes two arguments, (artist, album) from `req.body` and queries the DB for a matching album object. From there, I compile the information needed for `VYNL` into a new object, `albumData` and pass it to the records controller.
<br>
<br>
from `/src/services/api.js`
```
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
```
### Controller Integration
In the controller, I call the `fetchAlbumInfo` function and, if an album exists, `persist` that data to the `record model`. Notice that becuase of the API call, I am calling `Record.create` with albumData as an argument
<br>
<br>
from `/controllers/records.js`
```
function create(req, res) {
  fetchAlbumInfo(req.body.artist, req.body.title)
  .then(albumData => {
    if (albumData === undefined) {
      res.redirect('/records/new')
    } else {
      albumData.owner = req.user.profile._id
      Record.create(albumData)
```

## Highlights

### Partial City
Keeping my code `DRY` has become a point of pride, and its something that I am constantly working to improve upon. To keep my EJS clean, I made use of partials. In the following code, you can see `every element on the page is a parital` (some partials are exclusivley made up up other partials!)
<br>
<br>
from `/records/show.ejs`
```
<%- include('../partials/html-head') %>
<link rel="stylesheet" href="/stylesheets/partials/record-cards.css"/>
<link rel="stylesheet" href="/stylesheets/partials/comments.css"/>
<script defer type="text/javascript" src="/scripts/record-transition.js"></script>
<%- include('../partials/nav') %>

<div class="records-show-content">
  <%- include('../partials/record-card') %>

  <div class="comment-container">
    <%- include('../partials/comments') %>
    <%- include('../partials/add-comment') %>
  </div>
</div>

<%- include('../partials/footer') %>
```

### Seperation of `C`on`S`ern`S`
Most partials come with their own CSS file. Structuring my EJS and CSS in this way makes the code incredibly easy to build on with very little risk of accidentally breaking features that I am not activley working on.

![EJS](https://i.imgur.com/6SniD7q.png)
![CSS](https://i.imgur.com/ZMRqROi.png))

## Technologies

* Axios
* CSS
* Docker
* EJS
* ExpressJS
* fly.io
* Git
* Google OAuth
* JS
* MongoDB
* Mongooose
* NodeJS

## Icebox User Stories

[ ] - AA User I want a nav button that takes me to a 'for you' page that shows all records by other users that you follow.

[ ] - AA User I want to navigate to my profile and see a list of all records that I have liked.

[ ] - AA User I want to navigate to my profile and see a list of all records that I have commented on, and the body of my comment.

## Attributions

* [TheAudioDB](https://rapidapi.com/theaudiodb/api/theaudiodb/)
* [GA OAuth Template](https://github.com/SEI-Remote/men-stack-oauth-template)
* [Josh's Custom CSS Reset](https://www.joshwcomeau.com/css/custom-css-reset/)
* [Icons from FontAwesome](https://fontawesome.com/icons)
* [Maven Pro - Google Font](https://fonts.googleapis.com/css2?family=Maven+Pro:wght@400;900&display=swap)