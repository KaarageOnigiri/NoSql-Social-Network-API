const { ObjectId } = require('mongoose').Types;
const { User, Thought } = require('../models');

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
                // friendCount: await friendCount()
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
    },
    // create a new user
    async createUser(req, res) {
        try {
            const user = await User.create(req.body);
            res.json(user);
        }
        catch(err) {
            console.log(err)
            return res.status(500).json(err);
        }
    },
    // update an existing user
    async updateUser(req, res) {
        try {
            const user = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $set: req.body },
                { runValidators: true, new: true }
            )

            if(!user) {
                res.status(404).json({ message: 'No user with this id!' });
            }

            res.json(user);
        }
        catch (err) {
            res.status(500).json(err);
        }
    },
    // delete user
    async deleteUser(req, res) {
        try {
            console.log(res);
            const user = await User.findOneAndDelete({ _id: req.params.userId });



            if (!user) {
                res.status(404).json({ message: 'No user with that ID' });
            }

            res.json({ message: 'User successfully deleted' });
        }
        catch (err) {
            res.status(500).json(err);
        }
    },
    // add new friend to the user's friend list
    async addFriend(req, res) {
        try {
            const user = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $addToSet: { friends: req.params.friendId } },
                { runValidators: true, new: true }
            )

            if (!user) {
                res.status(404).json({ message: 'No user with that ID' });
            }
            
            const friend = await User.findOne({ _id: req.params.friendId });

            if (!friend) {
                res.status(404).json({ message: 'The user you are trying to befriend does not exist' });
            }

            res.json(user);
        }
        catch(err) {
            res.status(500).json(err);
        }
    },
    // delete a friend from user's friend list
    async deleteFriend(req, res) {
        try {
            const user = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $pull: { friends: req.params.friendId } },
                { new: true }
            )

            if (!user) {
                res.status(404).json({ message: 'No user with that ID' });
            }

            const friend = await User.findOne({ _id: req.params.friendId });

            if (!friend) {
                res.status(404).json({ message: 'The user you are trying to unfriend does not exist' });
            }
        }
        catch (err) {
            res.status(500).json(err);
        }
    }
}