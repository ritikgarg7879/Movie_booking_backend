const Show = require('../models/show.model');
const Theatre = require('../models/theatre.model');
const { STATUS } = require('../utils/constants');
const redis = require('../config/redis');


const clearShowCache = async () => {
  const keys = await redis.keys("shows:*");

  if (keys.length > 0) {
    await redis.del(keys);
    console.log("🗑 Show cache cleared");
  }
};

/**
 * 
 * @param data -> object containing details of the show to be created
 * @returns -> object with the new show details
 */
const createShow = async (data) => {
    try {
        const theatre = await Theatre.findById(data.theatreId);
        if(!theatre) {
            throw {
                err: 'No theatre found',
                code: STATUS.NOT_FOUND
            }
        }
        if(theatre.movies.indexOf(data.movieId) == -1) {
            throw {
                err: 'Movie is currently not available in the requested theatre',
                code: STATUS.NOT_FOUND
            }
        }
        const show = await Show.create(data);

        await clearShowCache();  // 🔥 invalidate cache

        return show;

    } catch (error) {
        if(error.name == 'ValidationError') {
            let err = {};
            Object.keys(error.errors).forEach(key => {
                err[key] = error.errors[key].message;
            });
            throw {
                err,
                code: STATUS.UNPROCESSABLE_ENTITY
            }
        }
        throw error;
    }
}

// const getShows = async (data) => {
//     try {
//         let filter = {};
//         if(data.theatreId) {
//             filter.theatreId = data.theatreId;
//         } 
//         if(data.movieId) {
//             filter.movieId = data.movieId;
//         }
//         const response = await Show.find(filter).populate('theatreId');
//         if(!response) {
//             throw {
//                 err: 'No shows found',
//                 code: STATUS.NOT_FOUND
//             }
//         }
//         return response;
//     } catch (error) {
//         throw error;
//     }
// }

const getShows = async (data) => {

  const cacheKey = `shows:${JSON.stringify(data)}`;

  // 1️⃣ Check Redis first
  const cachedData = await redis.get(cacheKey);

  if (cachedData) {
    console.log("⚡ Serving Shows from Cache");
    return JSON.parse(cachedData);
  }

  // 2️⃣ Build filter
  let filter = {};

  if (data.theatreId) {
    filter.theatreId = data.theatreId;
  }

  if (data.movieId) {
    filter.movieId = data.movieId;
  }

  // 3️⃣ Fetch from DB
  const response = await Show.find(filter).populate('theatreId');

  // 4️⃣ Store in Redis (TTL 60 seconds)
  await redis.set(cacheKey, JSON.stringify(response), "EX", 60);

  return response;
};


const deleteShow = async (id) => {
    try {
        const response = await Show.findByIdAndDelete(id);
        if(!response) {
            throw {
                err: 'No show found',
                code: STATUS.NOT_FOUND
            }
        }

        await clearShowCache();  // 🔥 invalidate cache
        
        return response;
    } catch (error) {
        throw error;
    }
}

const updateShow = async (id, data) => {
    try {
        const response = await Show.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true
        });
        if(!response) {
            throw {
                err: 'No show found for the given id',
                code: STATUS.NOT_FOUND
            }
        }
        await clearShowCache();  // 🔥 invalidate cache
        
        return response;

    } catch (error) {
        if(error.name == 'ValidationError') {
            let err = {};
            Object.keys(error.errors).forEach(key => {
                err[key] = error.errors[key].message;
            });
            throw {
                err,
                code: STATUS.UNPROCESSABLE_ENTITY
            }
        }
        throw error;
    }
}

module.exports = {
    createShow,
    getShows,
    deleteShow,
    updateShow
}