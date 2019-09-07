"use strict";

const db = require("./database");
const Sequelize = require("sequelize");

// Make sure you have `postgres` running!

//---------VVVV---------  your code below  ---------VVV----------

const Task = db.define("Task", {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  complete: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  due: Sequelize.DATE
});

Task.belongsTo(Task, { as: "parent" });

Task.clearCompleted = function() {
  this.destroy({
    where: { complete: true }
  });
};

Task.completeAll = function() {
  return this.update(
    {
      complete: true
    },
    { where: { complete: false } }
  );
};

Task.prototype.getTimeRemaining = function() {
  // const rDiff = this.due;
  // if (!rDiff) {
  //   return Infinity;
  // } else {
  //   return rDiff - new Date();
  // }
  //Ternary operator
  return !this.due ? Infinity : this.due - new Date();
};

Task.prototype.isOverdue = function() {
  // const todayDate = new Date();
  // if (this.due > todayDate || (this.due < todayDate && this.complete)) {
  //   return false;
  // } else {
  //   return true;
  // }

  //Ternary Operator
  return !(this.due > new Date() || (this.due < new Date() && this.complete));
};

Task.prototype.addChild = function(child) {
  child.parentId = this.id;
  return Task.create(child);
};

Task.prototype.getChildren = function() {
  return Task.findAll({
    where: {
      parentId: this.id
    }
  });
};

Task.prototype.getSiblings = function() {
  return Task.findAll({
    where: {
      parentId: this.parentId,
      id: { $ne: this.id }
    }
  });
};
//---------^^^---------  your code above  ---------^^^----------

module.exports = Task;
