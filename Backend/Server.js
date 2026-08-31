const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const Food = require("./Models/Food");
const Coupon = require("./Models/Coupon");
const Order = require("./Models/Order");

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
        await Food.find()
          .sort({
            createdAt: -1
          });

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
// COUPON APIs
// =====================================


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
// ADD ADMIN COUPON
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


      if (!code) {

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


      // =====================================
      // CHECK DUPLICATE
      // =====================================

      const existingCoupon =
        await Coupon.findOne({

          code:
            code.toUpperCase().trim()

        });


      if (existingCoupon) {

        return res.status(400).json({

          message:
            "Coupon code already exists"

        });

      }


      // =====================================
      // CREATE COUPON
      // =====================================

      const newCoupon =
        new Coupon({

          code:
            code.toUpperCase().trim(),

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
            description,

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
// GENERATE CUSTOMER COUPON
// =====================================

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


      // =====================================
      // VALIDATION
      // =====================================

      if (
        !items ||
        !Array.isArray(items) ||
        items.length === 0
      ) {

        return res.status(400).json({
          message: "Cart is empty"
        });

      }


      // =====================================
      // STORE
      // =====================================

      const couponStore =
        store || "Smart Food Coupon";


      // =====================================
      // GENERATE UNIQUE CODE
      // =====================================

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
            code: couponCode
          });

      } while (existingCoupon);


      // =====================================
      // DISCOUNT
      // =====================================

      const discount = 10;


      // =====================================
      // VALID FROM
      // =====================================

      const validFrom =
        new Date();


      // =====================================
      // VALID UNTIL - 7 DAYS
      // =====================================

      const validUntil =
        new Date();

      validUntil.setDate(
        validUntil.getDate() + 7
      );


      // =====================================
      // CREATE COUPON
      // =====================================

      const generatedCoupon =
        new Coupon({

          code: couponCode,

          discount: discount,

          // Next order માટે minimum amount નથી
          minOrderAmount: 0,

          validFrom: validFrom,

          validUntil: validUntil,

          store: couponStore,

          description:
            "10% OFF coupon generated after successful order",

          isActive: true,

          type: "generated",

          status: "generated",

          customerName:
            customerName || "",

          customerMobile:
            customerMobile || "",

          orderId:
            orderId ? String(orderId) : "",

          items: items,

          totalAmount:
            Number(totalAmount) || 0

        });


      // =====================================
      // SAVE TO MONGODB
      // =====================================

      const savedCoupon =
        await generatedCoupon.save();


      console.log(
        "Generated Coupon Saved:",
        savedCoupon
      );


      // =====================================
      // SEND RESPONSE
      // =====================================

      res.status(201).json({

        message:
          "Coupon generated successfully",

        coupon:
          savedCoupon

      });

    }

    catch (error) {

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

// =====================================
// GET ALL ORDERS
// =====================================

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

      res.json(orders);

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


// =====================================
// CREATE ORDER
// =====================================

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


      // =====================================
      // VALIDATION
      // =====================================

      if (
        !customer ||
        !mobile ||
        !address ||
        !city ||
        !state ||
        !pincode
      ) {

        return res.status(400).json({

          message:
            "All customer details are required"

        });

      }


      if (
        !items ||
        !Array.isArray(items) ||
        items.length === 0
      ) {

        return res.status(400).json({

          message:
            "Order must contain at least one item"

        });

      }


      // =====================================
      // GENERATE ORDER NUMBER
      // =====================================

      const orderNumber =
        `ORD-${Date.now()}`;


      // =====================================
      // CREATE ORDER
      // =====================================

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
            items,

          subtotal:
            Number(subtotal) || 0,

          deliveryFee:
            Number(deliveryFee) || 0,

          gst:
            Number(gst) || 0,

          discount:
            Number(discount) || 0,

          total:
            Number(total) || 0,

          paymentMethod:
            paymentMethod,

          couponCode:
            couponCode || "",

          status:
            "Pending"

        });


      // =====================================
      // SAVE ORDER
      // =====================================

      const savedOrder =
        await newOrder.save();


      console.log(
        "Order saved successfully:",
        savedOrder
      );


      // =====================================
      // RESPONSE
      // =====================================

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


// =====================================
// UPDATE ORDER STATUS
// =====================================

app.put(
  "/api/orders/:id/status",
  async (req, res) => {

    try {

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
        !allowedStatuses.includes(status)
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


// =====================================
// DELETE ORDER
// =====================================

app.delete(
  "/api/orders/:id",
  async (req, res) => {

    try {

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
// ORDER APIs
// =====================================


// =====================================
// CREATE ORDER
// =====================================

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


      // =====================================
      // VALIDATION
      // =====================================

      if (!customer) {

        return res.status(400).json({

          message:
            "Customer name is required"

        });

      }


      if (!mobile) {

        return res.status(400).json({

          message:
            "Mobile number is required"

        });

      }


      if (!address) {

        return res.status(400).json({

          message:
            "Address is required"

        });

      }


      if (!city) {

        return res.status(400).json({

          message:
            "City is required"

        });

      }


      if (!state) {

        return res.status(400).json({

          message:
            "State is required"

        });

      }


      if (!pincode) {

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


      // =====================================
      // GENERATE ORDER NUMBER
      // =====================================

      const orderNumber =
        `ORD-${Date.now()}`;


      // =====================================
      // CREATE ORDER
      // =====================================

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
                item.category || "",

              price:
                Number(item.price) || 0,

              quantity:
                Number(item.quantity) || 1,

              image:
                item.image || ""

            })),

          subtotal:
            Number(subtotal) || 0,

          deliveryFee:
            Number(deliveryFee) || 0,

          gst:
            Number(gst) || 0,

          discount:
            Number(discount) || 0,

          total:
            Number(total) || 0,

          paymentMethod:
            paymentMethod,

          status:
            "Pending",

          couponCode:
            couponCode || ""

        });


      // =====================================
      // SAVE ORDER
      // =====================================

      const savedOrder =
        await newOrder.save();


      console.log(
        "Order Saved:",
        savedOrder
      );


      // =====================================
      // SEND RESPONSE
      // =====================================

      res.status(201).json({

        message:
          "Order placed successfully",

        order:
          savedOrder

      });

    }

    catch (error) {

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


// =====================================
// GET ALL ORDERS
// =====================================

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

    }

    catch (error) {

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


// =====================================
// GET SINGLE ORDER
// =====================================

app.get(
  "/api/orders/:id",

  async (req, res) => {

    try {

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

    }

    catch (error) {

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


// =====================================
// UPDATE ORDER STATUS
// =====================================

app.patch(
  "/api/orders/:id/status",

  async (req, res) => {

    try {

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

    }

    catch (error) {

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


// =====================================
// DELETE ORDER
// =====================================

app.delete(
  "/api/orders/:id",

  async (req, res) => {

    try {

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

    }

    catch (error) {

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