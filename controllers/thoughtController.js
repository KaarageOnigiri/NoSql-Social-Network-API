const { ObjectId } = require('mongoose').Types;
const { User, Thought } = require('../models');

module.exports = {
    // get all thoughts
    async getThoughts(req, res) {
        try {
            const thoughts = await Thought.find();

            res.json(thoughts);
        }
        catch (err) {
            return res.status(500).json(err);
        }
    },
    // get a single thought
    async getSingleThought(req, res) {
        try {
            const thought = await Thought.findOne({ _id: req.params.thoughtId }).select('-__v');

            if (!user) {
                return res.status(404).json({ message: 'No thought with that ID' });
            }

            res.json(thought);
        }
        catch (err) {
            return res.status(500).json(err);
        }
    },
    // create a new thought
    async createThought(req, res) {
        try {
            const thought = await Thought.create(req.body);
            
            const user = await User.findOneAndUpdate(
                { _id: req.body.userId },
                { $addToSet: { thoughts: thought._id } },
                { new: true }
            );

            if (!user) {
                return res.status(404).json({ message: 'Thought created but no user with that ID exists' })
            }

            res.json('Created the thought');
        }
        catch (err) {
            return res.status(500).json(err);
        }
    },
    // update a thought
    async updateThought(req, res) {
        try {
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $set: req.body },
                { runValidators: true, new: true }
            )

            if (!thought) {
                return res.status(404).json({ message: 'No thought with this id!' });
            }
        }
        catch (err) {
            return res.status(500).json(err);
        }
    }
}