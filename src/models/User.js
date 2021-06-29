const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const matchesEmailRegex = require('../utils/email-regex')

const SALT_WORK_FACTOR = Number(process.env.SALT_WORK_FACTOR || 10);

mongoose.SchemaTypes.String.set('trim', true);

const modelName = 'User';
const schema = new mongoose.Schema({
  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: [true, 'Email is required'],
    validate: [
      matchesEmailRegex,
      'Invalid email',
    ],
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    minlength: [2, 'Name must be at least 2 characters']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters']
  },
  role: {
    type: String,
    enum: {
      values: ['regular', 'owner', 'admin'],
      message: '`{VALUE}` is not a valid role',
    },
    default: 'regular',
  },
  createdAt: { type: Date, default: Date.now },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

schema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    this.password = await bcrypt.hash(this.password, SALT_WORK_FACTOR);
    return next();
  } catch (err) {
    return next(err);
  }
});

schema.methods.validatePassword = async function validatePassword(str) {
  return bcrypt.compare(str, this.password);
};

module.exports = mongoose.models[modelName] || mongoose.model(
  modelName,
  schema
);