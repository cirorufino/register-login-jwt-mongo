const mongoose = require ('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    username: {
        type: String, 
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
}, {
    collection: 'users'
})

//static method 
UserSchema.statics.login = async function(username, password){
    const user = await this.findOne({ username });
    if (user){
        const auth = await bcrypt.compare(password, user.password);
        if(auth){
            return user;
        }
        throw Error('Invalid Password');
    }
    throw Error ('Invalid Username');
}

const model = mongoose.model('UserSchema', UserSchema);
module.exports = model;