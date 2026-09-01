const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const Food = require("./Models/Food");
const Coupon = require("./Models/Coupon");
const Order = require("./Models/Order");
const Restaurant = require("./Models/Restaurant");

const app = express();


// ============================================================
// MIDDLEWARE
// ============================================================

app.use(cors());

app.use(express.json());


// ============================================================
// IMAGE UPLOAD SETUP
// ============================================================

const storage = multer.diskStorage({

  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },

  filename: function (req, file, cb) {

    const uniqueName =
      Date.now() +
      "-" +
      file.originalname.replace(/\s+/g, "-");

    cb(null, uniqueName);
  }

});

const upload = multer({
  storage: storage
});


// ============================================================
// MAKE UPLOADED IMAGES ACCESSIBLE
// ============================================================

app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "uploads")
  )
);


// ============================================================
// MONGODB CONNECTION
// ============================================================

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


// ============================================================
// TEST API
// ============================================================

app.get("/", (req, res) => {

  res.send(
    "Food Coupon Backend is Running"
  );

});


// ============================================================
//                    RESTAURANT APIs
// ============================================================


// ============================================================
// GET ALL RESTAURANTS
// ============================================================

app.get(
  "/api/restaurants",
  async (req, res) => {

    try {

      const restaurants =
        await Restaurant
          .find()
          .sort({
            createdAt: -1
          });

      res.json(restaurants);

    } catch (error) {

      console.log(
        "GET RESTAURANTS ERROR:",
        error
      );

      res.status(500).json({

        message:
          "Failed to get restaurants"

      });

    }

  }
);


// ============================================================
// GET SINGLE RESTAURANT
// ============================================================

app.get(
  "/api/restaurants/:id",
  async (req, res) => {

    try {

      if (
        !mongoose.Types.ObjectId.isValid(
          req.params.id
        )
      ) {

        return res.status(400).json({

          message:
            "Invalid restaurant ID"

        });

      }


      const restaurant =
        await Restaurant.findById(
          req.params.id
        );


      if (!restaurant) {

        return res.status(404).json({

          message:
            "Restaurant not found"

        });

      }


      res.json(restaurant);

    } catch (error) {

      console.log(
        "GET RESTAURANT ERROR:",
        error
      );

      res.status(500).json({

        message:
          "Failed to get restaurant"

      });

    }

  }
);


// ============================================================
// ADD RESTAURANT WITH IMAGE
// ============================================================

app.post(
  "/api/restaurants",
  upload.single("image"),

  async (req, res) => {

    try {

      console.log(
        "RESTAURANT BODY:",
        req.body
      );

      console.log(
        "RESTAURANT FILE:",
        req.file
      );


      const {
        name,
        location,
        category,
        description,
        status
      } = req.body;


      // ======================================================
      // VALIDATION
      // ======================================================

      if (
        !name ||
        !name.trim()
      ) {

        return res.status(400).json({

          message:
            "Restaurant name is required"

        });

      }


      if (
        !location ||
        !location.trim()
      ) {

        return res.status(400).json({

          message:
            "Restaurant location is required"

        });

      }


      if (
        !category ||
        !category.trim()
      ) {

        return res.status(400).json({

          message:
            "Restaurant category is required"

        });

      }


      // ======================================================
      // CHECK DUPLICATE RESTAURANT
      // ======================================================

      const existingRestaurant =
        await Restaurant.findOne({

          name: {
            $regex:
              `^${name.trim()}$`,
            $options: "i"
          }

        });


      if (existingRestaurant) {

        return res.status(400).json({

          message:
            "Restaurant already exists"

        });

      }


      // ======================================================
      // CREATE RESTAURANT
      // ======================================================

      const newRestaurant =
        new Restaurant({

          name:
            name.trim(),

          location:
            location.trim(),

          category:
            category.trim(),

          image:
            req.file
              ? `/uploads/${req.file.filename}`
              : "",

          description:
            description
              ? description.trim()
              : "",

          status:
            status || "Active"

        });


      // ======================================================
      // SAVE RESTAURANT
      // ======================================================

      const savedRestaurant =
        await newRestaurant.save();


      console.log(
        "Restaurant saved:",
        savedRestaurant
      );


      res.status(201).json(
        savedRestaurant
      );


    } catch (error) {

      console.log(
        "ADD RESTAURANT ERROR:",
        error
      );

      res.status(500).json({

        message:
          error.message

      });

    }

  }
);


// ============================================================
// UPDATE RESTAURANT
// ============================================================

app.put(
  "/api/restaurants/:id",
  upload.single("image"),

  async (req, res) => {

    try {

      if (
        !mongoose.Types.ObjectId.isValid(
          req.params.id
        )
      ) {

        return res.status(400).json({

          message:
            "Invalid restaurant ID"

        });

      }


      const {
        name,
        location,
        category,
        description,
        status
      } = req.body;


      const updateData = {};


      if (name && name.trim()) {

        updateData.name =
          name.trim();

      }


      if (
        location &&
        location.trim()
      ) {

        updateData.location =
          location.trim();

      }


      if (
        category &&
        category.trim()
      ) {

        updateData.category =
          category.trim();

      }


      updateData.description =
        description
          ? description.trim()
          : "";


      if (status) {

        updateData.status =
          status;

      }


      if (req.file) {

        updateData.image =
          `/uploads/${req.file.filename}`;

      }


      const updatedRestaurant =
        await Restaurant.findByIdAndUpdate(

          req.params.id,

          updateData,

          {
            new: true,
            runValidators: true
          }

        );


      if (!updatedRestaurant) {

        return res.status(404).json({

          message:
            "Restaurant not found"

        });

      }


      res.json(
        updatedRestaurant
      );


    } catch (error) {

      console.log(
        "UPDATE RESTAURANT ERROR:",
        error
      );

      res.status(500).json({

        message:
          "Failed to update restaurant"

      });

    }

  }
);


// ============================================================
// DELETE RESTAURANT
// ============================================================

app.delete(
  "/api/restaurants/:id",

  async (req, res) => {

    try {

      if (
        !mongoose.Types.ObjectId.isValid(
          req.params.id
        )
      ) {

        return res.status(400).json({

          message:
            "Invalid restaurant ID"

        });

      }


      const deletedRestaurant =
        await Restaurant.findByIdAndDelete(
          req.params.id
        );


      if (!deletedRestaurant) {

        return res.status(404).json({

          message:
            "Restaurant not found"

        });

      }


      // ======================================================
      // DELETE FOODS BELONGING TO RESTAURANT
      // ======================================================

      await Food.deleteMany({

        restaurantId:
          req.params.id

      });


      res.json({

        message:
          "Restaurant and its foods deleted successfully"

      });


    } catch (error) {

      console.log(
        "DELETE RESTAURANT ERROR:",
        error
      );

      res.status(500).json({

        message:
          "Failed to delete restaurant"

      });

    }

  }
);


// ============================================================
//                         FOOD APIs
// ============================================================


// ============================================================
// GET ALL FOODS
// ============================================================

app.get(
  "/api/foods",

  async (req, res) => {

    try {

      const {
        restaurantId
      } = req.query;


      let query = {};


      // ======================================================
      // FILTER BY RESTAURANT
      // ======================================================

      if (restaurantId) {

        if (
          !mongoose.Types.ObjectId.isValid(
            restaurantId
          )
        ) {

          return res.status(400).json({

            message:
              "Invalid restaurant ID"

          });

        }


        query.restaurantId =
          restaurantId;

      }


      const foods =
        await Food
          .find(query)
          .sort({
            createdAt: -1
          });


      res.json(foods);


    } catch (error) {

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


// ============================================================
// GET SINGLE FOOD
// ============================================================

app.get(
  "/api/foods/:id",

  async (req, res) => {

    try {

      if (
        !mongoose.Types.ObjectId.isValid(
          req.params.id
        )
      ) {

        return res.status(400).json({

          message:
            "Invalid food ID"

        });

      }


      const food =
        await Food.findById(
          req.params.id
        );


      if (!food) {

        return res.status(404).json({

          message:
            "Food not found"

        });

      }


      res.json(food);


    } catch (error) {

      console.log(
        "GET SINGLE FOOD ERROR:",
        error
      );

      res.status(500).json({

        message:
          "Failed to get food"

      });

    }

  }
);


// ============================================================
// ADD FOOD WITH IMAGE
// ============================================================

app.post(
  "/api/foods",
  upload.single("image"),

  async (req, res) => {

    try {

      console.log(
        "FOOD BODY:",
        req.body
      );

      console.log(
        "FOOD FILE:",
        req.file
      );


      // ======================================================
      // IMAGE VALIDATION
      // ======================================================

      if (!req.file) {

        return res.status(400).json({

          message:
            "Image file not received"

        });

      }


      // ======================================================
      // RESTAURANT VALIDATION
      // ======================================================

      if (
        !req.body.restaurantId
      ) {

        return res.status(400).json({

          message:
            "Restaurant is required"

        });

      }


      // ======================================================
      // VALID RESTAURANT ID
      // ======================================================

      if (
        !mongoose.Types.ObjectId.isValid(
          req.body.restaurantId
        )
      ) {

        return res.status(400).json({

          message:
            "Invalid restaurant ID"

        });

      }


      // ======================================================
      // FOOD NAME VALIDATION
      // ======================================================

      if (
        !req.body.name ||
        !req.body.name.trim()
      ) {

        return res.status(400).json({

          message:
            "Food name is required"

        });

      }


      // ======================================================
      // CATEGORY VALIDATION
      // ======================================================

      if (
        !req.body.category ||
        !req.body.category.trim()
      ) {

        return res.status(400).json({

          message:
            "Food category is required"

        });

      }


      // ======================================================
      // PRICE VALIDATION
      // ======================================================

      if (
        req.body.price === undefined ||
        req.body.price === "" ||
        Number(req.body.price) <= 0
      ) {

        return res.status(400).json({

          message:
            "Valid food price is required"

        });

      }


      // ======================================================
      // CHECK RESTAURANT EXISTS
      // ======================================================

      const restaurant =
        await Restaurant.findById(
          req.body.restaurantId
        );


      if (!restaurant) {

        return res.status(404).json({

          message:
            "Selected restaurant not found"

        });

      }


      // ======================================================
      // CHECK RESTAURANT STATUS
      // ======================================================

      if (
        restaurant.status === "Inactive"
      ) {

        return res.status(400).json({

          message:
            "Selected restaurant is inactive"

        });

      }


      // ======================================================
      // CREATE FOOD
      // ======================================================

      const newFood =
        new Food({

          name:
            req.body.name.trim(),

          category:
            req.body.category.trim(),

          price:
            Number(req.body.price),

          image:
            `/uploads/${req.file.filename}`,

          restaurantId:
            req.body.restaurantId

        });


      // ======================================================
      // SAVE FOOD
      // ======================================================

      const savedFood =
        await newFood.save();


      console.log(
        "Food saved:",
        savedFood
      );


      res.status(201).json(
        savedFood
      );


    } catch (error) {

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


// ============================================================
// UPDATE FOOD
// ============================================================

app.put(
  "/api/foods/:id",
  upload.single("image"),

  async (req, res) => {

    try {

      if (
        !mongoose.Types.ObjectId.isValid(
          req.params.id
        )
      ) {

        return res.status(400).json({

          message:
            "Invalid food ID"

        });

      }


      const {
        name,
        category,
        price,
        restaurantId
      } = req.body;


      const updateData = {};


      if (
        name &&
        name.trim()
      ) {

        updateData.name =
          name.trim();

      }


      if (
        category &&
        category.trim()
      ) {

        updateData.category =
          category.trim();

      }


      if (
        price !== undefined &&
        price !== ""
      ) {

        if (
          Number(price) <= 0
        ) {

          return res.status(400).json({

            message:
              "Valid food price is required"

          });

        }

        updateData.price =
          Number(price);

      }


      if (restaurantId) {

        if (
          !mongoose.Types.ObjectId.isValid(
            restaurantId
          )
        ) {

          return res.status(400).json({

            message:
              "Invalid restaurant ID"

          });

        }


        const restaurant =
          await Restaurant.findById(
            restaurantId
          );


        if (!restaurant) {

          return res.status(404).json({

            message:
              "Selected restaurant not found"

          });

        }


        updateData.restaurantId =
          restaurantId;

      }


      if (req.file) {

        updateData.image =
          `/uploads/${req.file.filename}`;

      }


      const updatedFood =
        await Food.findByIdAndUpdate(

          req.params.id,

          updateData,

          {
            new: true,
            runValidators: true
          }

        );


      if (!updatedFood) {

        return res.status(404).json({

          message:
            "Food not found"

        });

      }


      res.json(
        updatedFood
      );


    } catch (error) {

      console.log(
        "UPDATE FOOD ERROR:",
        error
      );

      res.status(500).json({

        message:
          "Failed to update food"

      });

    }

  }
);


// ============================================================
// DELETE FOOD
// ============================================================

app.delete(
  "/api/foods/:id",

  async (req, res) => {

    try {

      if (
        !mongoose.Types.ObjectId.isValid(
          req.params.id
        )
      ) {

        return res.status(400).json({

          message:
            "Invalid food ID"

        });

      }


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


    } catch (error) {

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


// ============================================================
//                       COUPON APIs
// ============================================================


// ============================================================
// GET ALL COUPONS
// ============================================================

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


    } catch (error) {

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


// ============================================================
// GET SINGLE COUPON
// ============================================================

app.get(
  "/api/coupons/:id",

  async (req, res) => {

    try {

      if (
        !mongoose.Types.ObjectId.isValid(
          req.params.id
        )
      ) {

        return res.status(400).json({

          message:
            "Invalid coupon ID"

        });

      }


      const coupon =
        await Coupon.findById(
          req.params.id
        );


      if (!coupon) {

        return res.status(404).json({

          message:
            "Coupon not found"

        });

      }


      res.json(coupon);


    } catch (error) {

      console.log(
        "GET SINGLE COUPON ERROR:",
        error
      );

      res.status(500).json({

        message:
          "Failed to get coupon"

      });

    }

  }
);


// ============================================================
// ADD ADMIN COUPON
// ============================================================

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


      // ======================================================
      // VALIDATION
      // ======================================================

      if (
        !code ||
        !code.trim()
      ) {

        return res.status(400).json({

          message:
            "Coupon code is required"

        });

      }


      if (!store) {

        return res.status(400).json({

          message:
            "Store is required"

        });

      }


      if (
        discount === undefined ||
        Number(discount) < 1 ||
        Number(discount) > 100
      ) {

        return res.status(400).json({

          message:
            "Discount must be between 1 and 100"

        });

      }


      // ======================================================
      // CHECK DUPLICATE
      // ======================================================

      const couponCode =
        code
          .toUpperCase()
          .trim();


      const existingCoupon =
        await Coupon.findOne({

          code:
            couponCode

        });


      if (existingCoupon) {

        return res.status(400).json({

          message:
            "Coupon code already exists"

        });

      }


      // ======================================================
      // CREATE COUPON
      // ======================================================

      const newCoupon =
        new Coupon({

          code:
            couponCode,

          discount:
            Number(discount),

          minOrderAmount:
            Number(minOrderAmount) || 0,

          validFrom:
            validFrom,

          validUntil:
            validUntil,

          store:
            store,

          description:
            description || "",

          isActive:
            true,

          type:
            "admin",

          status:
            "generated"

        });


      const savedCoupon =
        await newCoupon.save();


      console.log(
        "Coupon saved:",
        savedCoupon
      );


      res.status(201).json(
        savedCoupon
      );


    } catch (error) {

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


// ============================================================
// GENERATE CUSTOMER COUPON
// ============================================================

app.post(
  "/api/coupons/generate",

  async (req, res) => {

    try {

      console.log(
        "GENERATE COUPON DATA:",
        req.body
      );


      const {
        items,
        totalAmount,
        store,
        customerName,
        customerMobile,
        orderId
      } = req.body;


      // ======================================================
      // CART VALIDATION
      // ======================================================

      if (
        !items ||
        !Array.isArray(items) ||
        items.length === 0
      ) {

        return res.status(400).json({

          message:
            "Cart is empty"

        });

      }


      // ======================================================
      // STORE
      // ======================================================

      const couponStore =
        store ||
        "Smart Food Coupon";


      // ======================================================
      // GENERATE UNIQUE CODE
      // ======================================================

      let couponCode;

      let existingCoupon;


      do {

        const randomPart =
          Math.random()
            .toString(36)
            .substring(2, 8)
            .toUpperCase();


        couponCode =
          `SFC-${randomPart}`;


        existingCoupon =
          await Coupon.findOne({

            code:
              couponCode

          });


      } while (existingCoupon);


      // ======================================================
      // DISCOUNT
      // ======================================================

      const discount =
        10;


      // ======================================================
      // VALID FROM
      // ======================================================

      const validFrom =
        new Date();


      // ======================================================
      // VALID UNTIL - 7 DAYS
      // ======================================================

      const validUntil =
        new Date();


      validUntil.setDate(
        validUntil.getDate() + 7
      );


      // ======================================================
      // CREATE CUSTOMER COUPON
      // ======================================================

      const generatedCoupon =
        new Coupon({

          code:
            couponCode,

          discount:
            discount,

          minOrderAmount:
            0,

          validFrom:
            validFrom,

          validUntil:
            validUntil,

          store:
            couponStore,

          description:
            "10% OFF coupon generated after successful order",

          isActive:
            true,

          type:
            "generated",

          status:
            "generated",

          customerName:
            customerName || "",

          customerMobile:
            customerMobile || "",

          orderId:
            orderId
              ? String(orderId)
              : "",

          items:
            items,

          totalAmount:
            Number(totalAmount) || 0

        });


      // ======================================================
      // SAVE COUPON
      // ======================================================

      const savedCoupon =
        await generatedCoupon.save();


      console.log(
        "Generated Coupon Saved:",
        savedCoupon
      );


      // ======================================================
      // RESPONSE
      // ======================================================

      res.status(201).json({

        message:
          "Coupon generated successfully",

        coupon:
          savedCoupon

      });


    } catch (error) {

      console.log(
        "GENERATE COUPON ERROR:",
        error
      );

      res.status(500).json({

        message:
          "Failed to generate coupon",

        error:
          error.message

      });

    }

  }
);


// ============================================================
// DELETE COUPON
// ============================================================

app.delete(
  "/api/coupons/:id",

  async (req, res) => {

    try {

      if (
        !mongoose.Types.ObjectId.isValid(
          req.params.id
        )
      ) {

        return res.status(400).json({

          message:
            "Invalid coupon ID"

        });

      }


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


    } catch (error) {

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


// ============================================================
//                         ORDER APIs
// ============================================================


// ============================================================
// GET ALL ORDERS
// ============================================================

app.get(
  "/api/orders",

  async (req, res) => {

    try {

      const orders =
        await Order
          .find()
          .sort({
            createdAt: -1
          });


      res.json(
        orders
      );


    } catch (error) {

      console.log(
        "GET ORDERS ERROR:",
        error
      );

      res.status(500).json({

        message:
          "Failed to get orders"

      });

    }

  }
);


// ============================================================
// GET SINGLE ORDER
// ============================================================

app.get(
  "/api/orders/:id",

  async (req, res) => {

    try {

      if (
        !mongoose.Types.ObjectId.isValid(
          req.params.id
        )
      ) {

        return res.status(400).json({

          message:
            "Invalid order ID"

        });

      }


      const order =
        await Order.findById(
          req.params.id
        );


      if (!order) {

        return res.status(404).json({

          message:
            "Order not found"

        });

      }


      res.json(
        order
      );


    } catch (error) {

      console.log(
        "GET SINGLE ORDER ERROR:",
        error
      );

      res.status(500).json({

        message:
          "Failed to get order"

      });

    }

  }
);


// ============================================================
// CREATE ORDER
// ============================================================

app.post(
  "/api/orders",

  async (req, res) => {

    try {

      console.log(
        "ORDER DATA:",
        req.body
      );


      const {
        customer,
        mobile,
        address,
        city,
        state,
        pincode,
        items,
        subtotal,
        deliveryFee,
        gst,
        discount,
        total,
        paymentMethod,
        couponCode
      } = req.body;


      // ======================================================
      // VALIDATION
      // ======================================================

      if (
        !customer ||
        !customer.trim()
      ) {

        return res.status(400).json({

          message:
            "Customer name is required"

        });

      }


      if (
        !mobile ||
        !mobile.trim()
      ) {

        return res.status(400).json({

          message:
            "Mobile number is required"

        });

      }


      if (
        !address ||
        !address.trim()
      ) {

        return res.status(400).json({

          message:
            "Address is required"

        });

      }


      if (
        !city ||
        !city.trim()
      ) {

        return res.status(400).json({

          message:
            "City is required"

        });

      }


      if (
        !state ||
        !state.trim()
      ) {

        return res.status(400).json({

          message:
            "State is required"

        });

      }


      if (
        !pincode ||
        !pincode.trim()
      ) {

        return res.status(400).json({

          message:
            "Pincode is required"

        });

      }


      if (
        !items ||
        !Array.isArray(items) ||
        items.length === 0
      ) {

        return res.status(400).json({

          message:
            "Order items are required"

        });

      }


      if (!paymentMethod) {

        return res.status(400).json({

          message:
            "Payment method is required"

        });

      }


      // ======================================================
      // GENERATE ORDER NUMBER
      // ======================================================

      const orderNumber =
        `ORD-${Date.now()}`;


      // ======================================================
      // CREATE ORDER
      // ======================================================

      const newOrder =
        new Order({

          orderNumber:
            orderNumber,

          customer:
            customer.trim(),

          mobile:
            mobile.trim(),

          address:
            address.trim(),

          city:
            city.trim(),

          state:
            state.trim(),

          pincode:
            pincode.trim(),

          items:
            items.map((item) => ({

              foodId:
                item._id ||
                item.id ||
                "",

              name:
                item.name,

              category:
                item.category ||
                "",

              price:
                Number(item.price) ||
                0,

              quantity:
                Number(item.quantity) ||
                1,

              image:
                item.image ||
                ""

            })),

          subtotal:
            Number(subtotal) ||
            0,

          deliveryFee:
            Number(deliveryFee) ||
            0,

          gst:
            Number(gst) ||
            0,

          discount:
            Number(discount) ||
            0,

          total:
            Number(total) ||
            0,

          paymentMethod:
            paymentMethod,

          status:
            "Pending",

          couponCode:
            couponCode ||
            ""

        });


      // ======================================================
      // SAVE ORDER
      // ======================================================

      const savedOrder =
        await newOrder.save();


      console.log(
        "Order Saved:",
        savedOrder
      );


      // ======================================================
      // RESPONSE
      // ======================================================

      res.status(201).json({

        message:
          "Order placed successfully",

        order:
          savedOrder

      });


    } catch (error) {

      console.log(
        "CREATE ORDER ERROR:",
        error
      );

      res.status(500).json({

        message:
          "Failed to create order",

        error:
          error.message

      });

    }

  }
);


// ============================================================
// UPDATE ORDER STATUS
// ============================================================

app.patch(
  "/api/orders/:id/status",

  async (req, res) => {

    try {

      if (
        !mongoose.Types.ObjectId.isValid(
          req.params.id
        )
      ) {

        return res.status(400).json({

          message:
            "Invalid order ID"

        });

      }


      const {
        status
      } = req.body;


      const allowedStatuses = [

        "Pending",
        "Preparing",
        "Delivered",
        "Cancelled"

      ];


      if (
        !allowedStatuses.includes(
          status
        )
      ) {

        return res.status(400).json({

          message:
            "Invalid order status"

        });

      }


      const updatedOrder =
        await Order.findByIdAndUpdate(

          req.params.id,

          {
            status:
              status
          },

          {
            new: true
          }

        );


      if (!updatedOrder) {

        return res.status(404).json({

          message:
            "Order not found"

        });

      }


      res.json({

        message:
          "Order status updated successfully",

        order:
          updatedOrder

      });


    } catch (error) {

      console.log(
        "UPDATE ORDER STATUS ERROR:",
        error
      );

      res.status(500).json({

        message:
          "Failed to update order status"

      });

    }

  }
);


// ============================================================
// DELETE ORDER
// ============================================================

app.delete(
  "/api/orders/:id",

  async (req, res) => {

    try {

      if (
        !mongoose.Types.ObjectId.isValid(
          req.params.id
        )
      ) {

        return res.status(400).json({

          message:
            "Invalid order ID"

        });

      }


      const deletedOrder =
        await Order.findByIdAndDelete(
          req.params.id
        );


      if (!deletedOrder) {

        return res.status(404).json({

          message:
            "Order not found"

        });

      }


      res.json({

        message:
          "Order deleted successfully"

      });


    } catch (error) {

      console.log(
        "DELETE ORDER ERROR:",
        error
      );

      res.status(500).json({

        message:
          "Failed to delete order"

      });

    }

  }
);


// ============================================================
//                         SERVER
// ============================================================

const PORT = 5000;

app.listen(
  PORT,

  () => {

    console.log(
      `Server running on http://localhost:${PORT}`
    );

  }
);