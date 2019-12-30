const AnimeService = require('../services/animeService.js');
const express = require('express');
const router = express.Router();

/**
 * @typedef Anime
 * @property {integer} anime_id.required - Identifier of the anime
 * @property {integer} user_id.required - Identifier of the user
 * @property {enum} status.required - Status of the anime in the user's list - eg: pending, watching, finished
 * @property {integer} rating - Rating given from the user for the anime
 */

/**
 * @route GET /animes
 * @group Anime - Operations about Anime
 * @param {string} status.query - status of the anime for the user
 * @param {string} status.genres - genres of the anime
 * @param {string} status.text - text contained in the anime title or description
 * @returns {object} 200 - An array with the searched animes
 * @returns {Error}  default - Unexpected error
 */
router.get('/animes', (req, res) => {
  page = req.query.page ? req.query.page : 0;

  const filters = {
    'status': req.query.status ? req.query.status : '',
    'genres': req.query.genres ? req.query.genres : '',
    'text': req.query.text ? req.query.text : '',
  };

  AnimeService.getAnimes(page, filters).then((response) => {
    res.send(response.data);
  }, function(err) {
    console.log(err);
  });
});


/**
 * @route GET /animes/:id
 * @group Anime - Operations about Anime
 * @param {string} id.query.required - identifier of the anime
 * @returns {object} 200 - JSON object with information about the searched anime
 * @returns {Error}  default - Unexpected error
 */
router.get('/animes/:id', (req, res) => {
  animeId = req.params.id;

  AnimeService.getAnimeById(animeId).then((response) =>{
    res.send(response.data);
  }, function(err) {
    console.log(err);
  });
});

/**
 * @route GET /user/:id/animes
 * @group Anime - Operations about Anime
 * @param {string} id.query.required - identifier of the user
 * @returns {object} 200 - An array with the animes that the user has in his list
 * @returns {Error}  default - Unexpected error
 */
router.get('/user/:id/animes', (req, res) => {
  userId = req.params.id;

  AnimeService.getUserAnimesById(userId).then((response) => {
    res.json(response);
  }, function(err) {
    console.log(err);
  });
});


/**
 * @route DELETE /user/animes/:id
 * @group Anime - Operations about Anime
 * @param {string} id.query.required - identifier of the anime
 * @returns {object} 200 - Anime was properly deleted from the user's list
 * @returns {Error}  default - Unexpected error
 */
router.delete('/user/animes/:animeId', (req, res) => {
  animeId = req.params.animeId;
  userId = 1;

  AnimeService.deleteUserAnimeById(animeId, userId).then((response) => {
    res.sendStatus(200);
  }, function(err) {
    console.log(err);
  });
});

/**
 * @route POST /user/animes/:id
 * @group Anime - Operations about Anime
 * @param {string} anime.query.required - anime to save in the user'list
 * @returns {object} 200 - Anime was properly added to the user's list
 * @returns {Error}  default - Unexpected error
 */
router.post('/user/animes/:animeId', (req, res) => {
  const anime = req.body;
  anime.anime_id = req.params.animeId;
  anime.user_id = 1;
  anime.status = 'pending';
  anime.rating = '';

  AnimeService.postUserNewAnime(anime).then((response) =>{
    res.sendStatus(201);
  }, function(err) {
    console.log(err);
  });
});

/**
 * @route PUT /user/animes/:id
 * @group Anime - Operations about Anime
 * @param {string} anime.query.required - anime to update in the user's list
 * @returns {object} 200 - Anime was properly updated from the user's list
 * @returns {Error}  default - Unexpected error
 */
router.put('/user/animes/:animeId', (req, res) => {
  var anime = req.body;
  anime.anime_id = req.params.animeId;
  anime.status = 'finished';
  anime.rating = 5;
  //anime.status = res.params.status;
  //anime.rating = res.params.rating;

  AnimeService.updateUserAnimeById(anime).then((response) =>{
    res.sendStatus(200);
  }, function(err){
    console.log(err);
  });
});

module.exports = router;
