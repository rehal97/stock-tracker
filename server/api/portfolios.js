const express = require("express");
const router = express.Router();

const Portfolio = require("../models/portfolio");

router.get("/", (req, res) => {
  Portfolio.find()
    .then((portfolios) => res.json(portfolios))
    .catch((err) => console.log(err));
});

router.get("/name", (req, res) => {
  const portfolioId = req.query.id;
  console.log("finding portfolio");
  Portfolio.findOne({ _id: portfolioId })
    .then((portfolio) => {
      res.json(portfolio);
    })
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

router.post("/delete", (req, res) => {
  const portfolioId = req.query.id;

  Portfolio.deleteOne({ _id: portfolioId })
    .then(() => {
      console.log("Successfully deleted.");
      res.json({
        message: "Created portfolio successfully",
      });
    })
    .catch((err) => {
      res.status(400).json({
        error: err,
        message: "Error deleting portfolio",
      });
    });
});

router.post("/addHolding", (req, res) => {
  console.log(req.body.params);
  const { id, symbol } = req.body.params;
  console.log(id);
  console.log(symbol);

  Portfolio.findById({ _id: id })
    .then((portfolio) => {
      portfolio.holdings.push({ name: symbol });
      portfolio.save();
      res.json({
        message: `Successfully added ${symbol} to holdings.`,
      });
    })
    .catch((err) => {
      res.status(400).json({
        error: err,
        message: "Error, could not add symbol to holdings.",
      });
    });
});

module.exports = router;
