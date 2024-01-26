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
            console.log(req.body)
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $set: req.body },
                { new: true }
            );

            if (!thought) {
                return res.status(404).json({ message: 'No thought with this id!' });
            }

            res.json(thought)
        }
        catch (err) {
            return res.status(500).json(err);
        }
    },
    // delete a thought
    async deleteThought(req, res) {
        try {
            const thought = await Thought.findOneAndRemove({ _id:req.params.thoughtId });

            if (!thought) {
                return res.status(404).json({ message: 'No thought with this id!' });
            }

            const user = await User.findOneAndUpdate(
                { thoughts: req.params.thoughtId },
                { $pull: { thoughts: req.params.thoughtId } },
                { new: true }
            )

            if (!user) {
                return res.status(404).json({ message: 'No user with this id!' });
            }

            res.json({ message: 'Thought successfully deleted!' })
        }
        catch (err) {
            return res.status(500).json(err);
        }
    },
    // create reaction
    async createReaction(req, res) {
        try {
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $addToSet: { reactions: req.body } },
                { runValidators: true, new: true }
            )

            if (!thought) {
                return res.status(404).json({ message: 'No thought with this id!' });
            }

            res.json(thought);
        }
        catch (err) {
            return res.status(500).json(err);
        }
    },
    // delete reaction
    async deleteReaction(req, res) {
        try {
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $pull: { reactions: { reactionId: req.body.reactionId } } },
                { runValidators: true, new: true }
            )

            if (!thought) {
                return res.status(404).json({ message: 'No thought with this id!' });
            }

            // need further testing
            if (!req.body.reactionId) {
                return res.status(404).json({ message: 'No reaction with this id!' });
            }

            res.json(thought);
        }
        catch (err) {
            return res.status(500).json(err);
        }
    }
}