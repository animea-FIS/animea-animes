'use strict';

const request = require('request');
const utils = require('../utils');
const AnimeModel = require('../models/anime.model');

class AnimeService {
  static getAnimes(page, filters) {
    const options = {
      url: utils.createUrl(page, filters),
      headers: {
        'Accept': 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
      },
    };
    return new Promise(function(resolve, reject) {
      request.get(options, (err, response, body) => {
        if (err) {
          reject(err);
        } else {
          resolve(JSON.parse(response.body));
        }
      });
    });
  }

  static getAnimeById(animeId) {
    const API_PATH = process.env.API_PATH;
    const options = {
      url: `${API_PATH}/anime?filter[id]=${animeId}`,
      headers: {
        'Accept': 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
      },
    };
    return new Promise(function(resolve, reject) {
      request.get(options, (err, response, body) => {
        if (err) {
          reject(err);
        } else {
          resolve(JSON.parse(response.body));
        }
      });
    });
  }

  static getUserAnimesById(userId) {
    return new Promise(function(resolve, reject) {
      AnimeModel.find({
        user_id: userId,
      })
          .then((doc) => {
            resolve(doc);
          })
          .catch((err) => {
            reject(err);
          });
    });
  }
}

module.exports = AnimeService;
