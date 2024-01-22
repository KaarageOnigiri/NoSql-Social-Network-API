const { ObjectId } = require('mongoose').Types;
const { User } = require('../models');

// aggregate function to get friendCount
const friendCount = async () => {
    const numberOfFriends = await User.aggregate().count('friendCount');
    return numberOfFriends;
}

module.exports = {
    // get all users
    async getUsers(req, res) {
        try {
            const users = await User.find();

            const userObj = {
                users,
                friendCount: await friendCount()
            };

            res.json(userObj);
        }
        catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    },
    // get single user by its _id and populate thought and friend data
    async getSingleUser(req, res) {
        try{ 
            const user = await User.findOne({ _id: req.params.userId })
                .select('-__v')
                // **** populate both thoughts and friends, how?
                .populate('thoughts')
                .populate('friends');

            if (!user) {
                return res.status(404).json({ message: 'No user with that ID' });
            }

            res.json({
                user,
                // start here to find the 'path' populate method and how to put it in here
            })
        }
        catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    }
}