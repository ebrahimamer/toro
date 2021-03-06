const Sequelize = require('sequelize');
const Op = Sequelize.Op

const bcrypt = require('bcrypt');

const User = require('./users');

const db = require('../services/database');

// 1: The model schema.
const modelDefinition = {
  coachId: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  proficiency: {
    type: Sequelize.STRING
  },
  validity: {
    type: Sequelize.BOOLEAN,
    defaultValue: 0
  },
  avatar: {
    type: Sequelize.STRING
  }
};

// 2: Define the User model.
const CoachesModel = module.exports = db.define('coaches', modelDefinition);

User.hasMany(CoachesModel, { foreignKey: 'coachId' })
CoachesModel.belongsTo(User, { foreignKey: 'coachId' })

module.exports.createUser = (newCoach) => {
  newCoach.save();
}
module.exports.comparePassword = (candidatePassword, hash) => {
  return bcrypt.compare(candidatePassword, hash);
}
module.exports.updateSettings = (proficiency, coachId) => {
  CoachesModel.update(
    {
      proficiency: proficiency
    },
    {
      where: {
        coachId: coachId
      }
    }
  );
}
module.exports.getCoachesByProficiencies = (proficiency) => {
  return CoachesModel.findAll({
    where: {
      proficiency: {
        [Op.or]: [proficiency, 'all']
      },
      validity: 1
    },
    include: {
      model: User,
      required: true
    }
  });
}
module.exports.getAllCoaches = () => {
  return CoachesModel.findAll({
    include: {
      model: User,
      required: true
    }
  });
}
module.exports.getAllValidCoaches = () => {
  return CoachesModel.findAll({
    where: {
      validity: 1
    },
    include: {
      model: User,
      required: true
    }
  });
}