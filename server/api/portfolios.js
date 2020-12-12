const express = require("express");
const router = express.Router();

const Portfolio = require("../models/portfolio");

router.get("/", (req, res) => {
  Portfolio.find()
    .then((portfolios) => res.json(portfolios))
    .catch((err) => console.log(err));
});

router.post("/", (req, res) => {
  console.log("posting portfolio");

  const { name, owner } = req.body;

  const newPortfolio = new Portfolio({
    name: name,
    owner: owner,
  });

  newPortfolio
    .save()
    .then(() => {
      res.json({
        message: "Created portfolio successfully",
      });
    })
    .catch((err) => {
      res.status(400).json({
        error: err,
        message: "Error creating portfolio",
      });
    });
});

module.exports = router;
