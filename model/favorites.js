const mongoose = require ('mongoose');

const favoritesSchema = new mongoose.Schema({

        username: {
            type: String
        },
        cards: [{
            title: {
                type: String
            },
            photo: {
                type: String
            },
            equip: {
                type: String
            },
            price: {
                type: String
            },
            delivery: {
                type: Boolean
            },
            isOffer: {
                type: Boolean
            },
            available: {
                type: Boolean
            },
            favorites: {
                type: String
            }
        }] 
}, {
    collection: 'favorites'
}); 

const model = mongoose.model('favoritesSchema', favoritesSchema);
module.exports = model;