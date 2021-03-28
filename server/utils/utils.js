const express = require("express");
const fs = require("fs");

const adjectives = fs
  .readFileSync(__dirname + "/data/adjectives.txt")
  .toString("utf-8")
  .split(",");
const animals = fs
  .readFileSync(__dirname + "/data/animals.txt")
  .toString("utf-8")
  .split(",");

function generateUserName() {
  return (
    adjectives[Math.floor(Math.random() * adjectives.length)].trim() +
    "-" +
    animals[Math.floor(Math.random() * animals.length)].trim()
  );
}

module.exports = { generateUserName };
