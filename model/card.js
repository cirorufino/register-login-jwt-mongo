const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema ({
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

}, {
    collection: 'cards'
});



const model = mongoose.model('cardSchema', cardSchema);
module.exports = model;

