const { Schema, model } = require('mongoose');

const isEmail = function(email) {
    var emailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return emailFormat.test(email);
}

// Schema to create User model
const userSchema = new Schema(
    {
        username: {
            type: String,
            unique: true,
            required: true,
            // **** Need to test this out
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            validate: [ isEmail, 'invalid email' ]
        },
        thoughts: [
            {
                type: Schema.Types.ObjectId,
                ref: 'thought'
            }
        ],
        friends: [
            {
                // maybe we don't need this IDK
                type: Schema.Types.ObjectId,
                // **** need help with self-referencing
            }
        ]
    },
    {
        // **** Don't know if this is right
        toJSON: {
            virtuals: true,
            getters: true
        },
        id: false
    }
)

userSchema.virtual('friendCount').get(function() {
    return this.friends.length;
})

const User = model('user', userSchema);

module.exports = User;