const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const Food = require("./models/Food");

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

      // Check received data

      console.log(
        "BODY:",
        req.body
      );

      console.log(
        "FILE:",
        req.file
      );


      // Check image

      if (!req.file) {

        return res.status(400).json({

          message:
            "Image file not received"

        });

      }


      // Create Food

      const newFood = new Food({

        name:
          req.body.name,

        category:
          req.body.category,

        price:
          Number(req.body.price),

        image:
          `/uploads/${req.file.filename}`

      });


      // Save to MongoDB

      const savedFood =
        await newFood.save();


      console.log(
        "Food saved:",
        savedFood
      );


      // Send response

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