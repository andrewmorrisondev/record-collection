# [VYNL](https://record-collection.fly.dev/)

## Don't judge a record by its sleeve... or do.

VYNL is a social app built with the MEN stack. Show off your favorite records. Discover your friend's niche tastes. Learn something about your favorite new artist along the way.
## Table of Contents
<details>
<summary> Click to Expand</summary>

- [Desktop View](#desktop-view)
- [Mobile View](#mobile-view)
- [TheAudioDB API](#theaudiodb-api)
  - [Endpoint - Exposed](#endpoint---exposed)
  - [Controller Integration](#controller-integration)
- [Highlights](#highlights)
  - [Partial City](#partial-city)
  - [Seperation of ConSernS](#seperation-of-conserns)
- [Technologies](#technologies)
- [ERD](#erd)
- [Icebox User Stories](#icebox-user-stories)
- [Attributions](#attributions)

</details>
<br>

## Desktop View

<img src="https://i.imgur.com/EiJjRN1.png"  max-width="600" max-height="640">

## Mobile View

<img src="https://i.imgur.com/woYPGJi.png"  max-width="300" max-height="640">

## [TheAudioDB API](https://www.theaudiodb.com/)
Hooking up to this API gives me access to a DB of pretty much every album released in the US. As a result, the `record-cards` auto-populate based on the information coming from `req.body`
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
In the controller, I call the `fetchAlbumInfo` function and, if an album exists, `persist` that data to the `record model`. Notice that because of the API call, I am calling `Record.create` with albumData as an argument
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
      Record.find({ title: albumData.title, artist: albumData.artist })
      .then(records => {
        if (records.length) {
          res.redirect('/records/new')
        } else {
          albumData.owner = req.user.profile._id
          Record.create(albumData)
```

## Highlights

### Partial City
Keeping my code `DRY` has become a point of pride, and its something that I am constantly working to improve upon. To keep my EJS clean, I made use of partials. In the following code, you can see `every element on the page is a partial` (some partials are exclusively made up of other partials!)
<br>
<br>
from `/views/records/show.ejs`

```
<%- include('../partials/html-head') %>
<link rel="stylesheet" href="/stylesheets/show.css"/>
<link rel="stylesheet" href="/stylesheets/partials/record-cards.css"/>
<script defer type="text/javascript" src="/scripts/record-transition.js"></script>
<%- include('../partials/nav') %>

<div class="records-show-content">
  <%- include('../partials/record-card') %>

  <div class="comment-container">
    <%- include('../partials/show/comments') %>
    <%- include('../partials/show/add-comment') %>
  </div>
  
</div>

<%- include('../partials/show/data-card') %>
<%- include('../partials/show/bio-card') %>

<%- include('../partials/footer') %>
```

### Seperation of `C`on`S`ern`S`
Most partials come with their own CSS file. Structuring my EJS and CSS in this way makes the code incredibly easy to build on with very little risk of accidentally breaking features that I am not actively working on.

![EJS](https://i.imgur.com/6SniD7q.png)
![CSS](https://i.imgur.com/ZMRqROi.png)

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
* Mongoose
* NodeJS

## ERD

![Imgur](https://i.imgur.com/gDqX4Ww.png)

<sup><sup>[trello link](https://trello.com/b/msTr6CMz/record-collection)</sup></sup>

## Icebox User Stories
[ ] - AA User I want to see an error message if my album was not added so that I know I need to try again.

[ ] - AA User I want a nav button that takes me to a 'for you' page that shows all records by other users that you follow.

[ ] - AA User I want to navigate to my profile and see a list of all records that I have liked.

[ ] - AA User I want to navigate to my profile and see a list of all records that I have commented on, and the body of my comment.

<br>

<details>
<summary><strong>Implemented User Stories</strong></summary>

[`X`] - AA User on the /records/new view, I want to interact with a music API that makes me pick an album and favorite song, and the rest of the info will be auto-populated (including album art) so that the user experience will be better.

[`X`] - AA User I want to navigate to another users profile and find a follow button so that I can add that user to my usersFollowing.

[`X`] - AA User I want to navigate to a post and see a button to like a record so that I can keep track of other users records that I like.

[`X`] - AA User I want a button to delete a comment on a specific record so that I can remove my comments.

[`X`] - AA User I want a button to edit a comment on a specific record so that I can edit my comments.

[`X`] - AA User I want a button to create a comment on a specific record so that other users can see what I think about it.

[`X`] - AA guest I want to navigate to a specific record and see all comments left by all users so that I can view what other users have to say about a specific record.

[`X`] - AA User I want a button to navigate to my profile show page so that I can see my record collection and other information tied to my user profile.

[`X`] - AA User I want a button on the show page to delete a record that I created and all its comments so that I can change which records I have posted but other users cannot (change mine).

[`X`] - AA User I want a button on the show page to edit a record that I created so that I can change any information about it but users that do not own a record cannot.

[`X`] - AA User I want a button to take me to a list of all users so I can see other users and their records.

[`X`] - AA User I want to create a new record so that I can share it with other users.

[`X`] - AA guest, I want to see all records so that I can browse all content.

[`X`] - AA guest I want a button to take me to the details for a record so that I can view all information in one place.


</details>
<br>

## Attributions

* [TheAudioDB](https://rapidapi.com/theaudiodb/api/theaudiodb/)
* [GA OAuth Template](https://github.com/SEI-Remote/men-stack-oauth-template)
* [Josh's Custom CSS Reset](https://www.joshwcomeau.com/css/custom-css-reset/)
* [Icons from FontAwesome](https://fontawesome.com/icons)
* [Maven Pro - Google Font](https://fonts.googleapis.com/css2?family=Maven+Pro:wght@400;900&display=swap)