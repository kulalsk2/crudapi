const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Order = require("../models/orders");
const Product = require("../models/products");
router.get("/", (req, res, next) => {
  Order.find()
    .select("product quantity _id")
    .populate("product")
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        orders: docs.map((doc) => {
          return {
            product: doc.product,
            quantity: doc.quantity,
            _id: doc._id,
            url: "https://localhost:3000/orders/" + doc._id,
          };
        }),
      };
      console.log(docs);
      res.status(200).json(response);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.post("/", (req, res, next) => {
  Product.findById(req.body.productId)
    .then((product) => {
      if (!product) {
        return res.status(404).json({
          message: "product not found",
        });
      }
      const order = new Order({
        _id: mongoose.Types.ObjectId(),
        product: req.body.productId,
        quantity: req.body.quantity,
      });
      return order.save();
    })
    .then((result) => {
      console.log(result);
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

router.get("/:orderId", (req, res, next) => {
  const id = req.params.orderId;
  Order.findById(id)
    .select("product quantity _id")
    .populate("product")
    .exec()
    .then((doc) => {
      console.log(doc);
      if (doc) res.status(200).json(doc);
      else {
        res
          .status(404)
          .json({ message: "no valid entry found for provided entry" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.patch("/:orderId", (req, res, next) => {
  const id = req.params.orderId;
  Order.updateOne(
    { _id: id },
    { $set: { product: req.body.newProductId, quantity: req.body.newQuantity } }
  )
    .exec()
    .then((result) => {
      console.log(result);
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});
router.delete("/orderId", (req, res, next) => {
  const id = req.params.productId;
  Order.remove({ _id: id })
    .exec()
    .then((result) => {
      if (!result)
        return res.status(404).json({
          error: "Order not found",
        });
      console.log(result);
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

module.exports = router;
