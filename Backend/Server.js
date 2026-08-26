const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const Food = require("./Models/Food");
const Coupon = require("./Models/Coupon");

const app = express();


// =====================================
// MIDDLEWARE
// =====================================

app.use(cors());

app.use(express.json());


// =====================================
// IMAGE UPLOAD SETUP
// =====================================

const storage = multer.diskStorage({

  destination: function (req, file, cb) {

    cb(null, "uploads/");

  },

  filename: function (req, file, cb) {

    const uniqueName =
      Date.now() +
      "-" +
      file.originalname;

    cb(null, uniqueName);

  }

});


const upload = multer({

  storage: storage

});


// =====================================
// MAKE UPLOADED IMAGES ACCESSIBLE
// =====================================

app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "uploads")
  )
);


// =====================================
// MONGODB CONNECTION
// =====================================

mongoose
  .connect(
    "mongodb://127.0.0.1:27017/FoodCouponSystem"
  )

  .then(() => {

    console.log(
      "MongoDB Connected Successfully"
    );

  })

  .catch((error) => {

    console.log(
      "MongoDB Connection Failed"
    );

    console.log(error);

  });


// =====================================
// TEST API
// =====================================

app.get("/", (req, res) => {

  res.send(
    "Food Coupon Backend is Running"
  );

});


// =====================================
// GET ALL FOODS
// =====================================

app.get(
  "/api/foods",
  async (req, res) => {

    try {

      const foods =
        await Food.find();

      res.json(foods);

    }

    catch (error) {

      console.log(
        "GET FOOD ERROR:",
        error
      );

      res.status(500).json({

        message:
          "Failed to get foods"

      });

    }

  }
);


// =====================================
// ADD FOOD WITH IMAGE
// =====================================

app.post(
  "/api/foods",
  upload.single("image"),

  async (req, res) => {

    try {

      console.log(
        "BODY:",
        req.body
      );

      console.log(
        "FILE:",
        req.file
      );


      if (!req.file) {

        return res.status(400).json({

          message:
            "Image file not received"

        });

      }


      const newFood =
        new Food({

          name:
            req.body.name,

          category:
            req.body.category,

          price:
            Number(req.body.price),

          image:
            `/uploads/${req.file.filename}`

        });


      const savedFood =
        await newFood.save();


      console.log(
        "Food saved:",
        savedFood
      );


      res.status(201).json(
        savedFood
      );

    }

    catch (error) {

      console.log(
        "ADD FOOD ERROR:",
        error
      );


      res.status(500).json({

        message:
          error.message

      });

    }

  }
);


// =====================================
// DELETE FOOD
// =====================================

app.delete(
  "/api/foods/:id",

  async (req, res) => {

    try {

      const deletedFood =
        await Food.findByIdAndDelete(
          req.params.id
        );


      if (!deletedFood) {

        return res.status(404).json({

          message:
            "Food not found"

        });

      }


      res.json({

        message:
          "Food deleted successfully"

      });

    }

    catch (error) {

      console.log(
        "DELETE FOOD ERROR:",
        error
      );


      res.status(500).json({

        message:
          "Failed to delete food"

      });

    }

  }
);


// =====================================
// GET ALL COUPONS
// =====================================

app.get(
  "/api/coupons",

  async (req, res) => {

    try {

      const coupons =
        await Coupon
          .find()
          .sort({
            createdAt: -1
          });


      res.json(
        coupons
      );

    }

    catch (error) {

      console.log(
        "GET COUPON ERROR:",
        error
      );


      res.status(500).json({

        message:
          "Failed to get coupons"

      });

    }

  }
);


// =====================================
// ADD COUPON
// =====================================

app.post(
  "/api/coupons",

  async (req, res) => {

    try {

      console.log(
        "COUPON DATA:",
        req.body
      );


      const {
        code,
        discount,
        minOrderAmount,
        validFrom,
        validUntil,
        store,
        description
      } = req.body;


      // Check duplicate coupon

      const existingCoupon =
        await Coupon.findOne({

          code:
            code.toUpperCase()

        });


      if (existingCoupon) {

        return res.status(400).json({

          message:
            "Coupon code already exists"

        });

      }


      // Create coupon

      const newCoupon =
        new Coupon({

          code:
            code.toUpperCase(),

          discount:
            Number(discount),

          minOrderAmount:
            Number(minOrderAmount),

          validFrom:
            validFrom,

          validUntil:
            validUntil,

          store:
            store,

          description:
            description

        });


      // Save permanently

      const savedCoupon =
        await newCoupon.save();


      console.log(
        "Coupon saved:",
        savedCoupon
      );


      res.status(201).json(
        savedCoupon
      );

    }

    catch (error) {

      console.log(
        "ADD COUPON ERROR:",
        error
      );


      res.status(500).json({

        message:
          error.message

      });

    }

  }
);


// =====================================
// DELETE COUPON
// =====================================

app.delete(
  "/api/coupons/:id",

  async (req, res) => {

    try {

      const deletedCoupon =
        await Coupon.findByIdAndDelete(
          req.params.id
        );


      if (!deletedCoupon) {

        return res.status(404).json({

          message:
            "Coupon not found"

        });

      }


      res.json({

        message:
          "Coupon deleted successfully"

      });

    }

    catch (error) {

      console.log(
        "DELETE COUPON ERROR:",
        error
      );


      res.status(500).json({

        message:
          "Failed to delete coupon"

      });

    }

  }
);


// =====================================
// SERVER
// =====================================

const PORT = 5000;


app.listen(
  PORT,

  () => {

    console.log(
      `Server running on http://localhost:${PORT}`
    );

  }
);