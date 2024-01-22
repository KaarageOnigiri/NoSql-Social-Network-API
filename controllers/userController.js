const { ObjectId } = require('mongoose').Types;
const { User } = require('../models');

// get all users
module.exports = {
    async getUsers(req, res) {
        try {
            const users = await User.find();

            const 
        }
    }
}