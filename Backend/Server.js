const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const Food = require("./Models/Food");
const Coupon = require("./Models/Coupon");
const Order = require("./Models/Order");
const Restaurant = require("./Models/Restaurant");
const Notification = require("./Models/Notification");
const Contact = require("./Models/Contact");

const app = express();

// ============================================================
// MIDDLEWARE
// ============================================================

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  "/uploads",
  express.static(path.join(__dirname, "Uploads"))
);

// ============================================================
// MONGODB CONNECTION
// ============================================================

mongoose
  .connect("mongodb://127.0.0.1:27017/FoodCouponSystem")
  .then(() => {
    console.log("MongoDB Connected Successfully");
  })
  .catch((error) => {
    console.log("MongoDB Connection Error:", error);
  });

// ============================================================
// MULTER CONFIGURATION
// ============================================================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "Uploads/");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() +
        "-" +
        Math.round(Math.random() * 1e9) +
        path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
});

// ============================================================
// TEST API
// ============================================================

app.get("/", (req, res) => {
  res.json({
    message: "Food Coupon System Backend Running",
  });
});

// ============================================================
// FOOD APIs
// ============================================================

// GET ALL FOODS

app.get("/api/foods", async (req, res) => {
  try {
    const { restaurantId } = req.query;

    let foods;

    if (restaurantId) {
      foods = await Food.find({
        restaurantId: restaurantId,
      }).sort({ createdAt: -1 });
    } else {
      foods = await Food.find().sort({
        createdAt: -1,
      });
    }

    res.json(foods);
  } catch (error) {
    console.log("GET FOOD ERROR:", error);

    res.status(500).json({
      message: "Failed to get foods",
    });
  }
});

// ADD FOOD

app.post(
  "/api/foods",
  upload.single("image"),
  async (req, res) => {
    try {
      const {
        name,
        price,
        category,
        restaurantId,
        restaurantName,
        description,
      } = req.body;

      if (!name || !price || !category) {
        return res.status(400).json({
          message: "Name, price and category are required",
        });
      }

      const food = new Food({
        name,
        price: Number(price),
        category,
        restaurantId,
        restaurantName,
        description,
        image: req.file
          ? `/uploads/${req.file.filename}`
          : "",
      });

      const savedFood = await food.save();

      res.status(201).json({
        message: "Food added successfully",
        food: savedFood,
      });
    } catch (error) {
      console.log("ADD FOOD ERROR:", error);

      res.status(500).json({
        message: "Failed to add food",
        error: error.message,
      });
    }
  }
);

// DELETE FOOD

app.delete("/api/foods/:id", async (req, res) => {
  try {
    const food = await Food.findByIdAndDelete(
      req.params.id
    );

    if (!food) {
      return res.status(404).json({
        message: "Food not found",
      });
    }

    res.json({
      message: "Food deleted successfully",
    });
  } catch (error) {
    console.log("DELETE FOOD ERROR:", error);

    res.status(500).json({
      message: "Failed to delete food",
    });
  }
});

// ============================================================
// RESTAURANT APIs
// ============================================================

// GET ALL RESTAURANTS

app.get("/api/restaurants", async (req, res) => {
  try {
    const restaurants = await Restaurant.find().sort({
      createdAt: -1,
    });

    res.json(restaurants);
  } catch (error) {
    console.log("GET RESTAURANTS ERROR:", error);

    res.status(500).json({
      message: "Failed to get restaurants",
    });
  }
});

// GET SINGLE RESTAURANT

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
          message: "Invalid restaurant ID",
        });
      }

      const restaurant =
        await Restaurant.findById(req.params.id);

      if (!restaurant) {
        return res.status(404).json({
          message: "Restaurant not found",
        });
      }

      res.json(restaurant);
    } catch (error) {
      console.log(
        "GET SINGLE RESTAURANT ERROR:",
        error
      );

      res.status(500).json({
        message: "Failed to get restaurant",
      });
    }
  }
);

// ADD RESTAURANT

app.post(
  "/api/restaurants",
  upload.single("image"),
  async (req, res) => {
    try {
      const {
        name,
        location,
        description,
      } = req.body;

      if (!name) {
        return res.status(400).json({
          message: "Restaurant name is required",
        });
      }

      const restaurant = new Restaurant({
        name,
        location,
        description,
        image: req.file
          ? `/uploads/${req.file.filename}`
          : "",
      });

      const savedRestaurant =
        await restaurant.save();

      res.status(201).json({
        message: "Restaurant added successfully",
        restaurant: savedRestaurant,
      });
    } catch (error) {
      console.log(
        "ADD RESTAURANT ERROR:",
        error
      );

      res.status(500).json({
        message: "Failed to add restaurant",
        error: error.message,
      });
    }
  }
);

// UPDATE RESTAURANT

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
          message: "Invalid restaurant ID",
        });
      }

      const updateData = {
        name: req.body.name,
        location: req.body.location,
        description: req.body.description,
      };

      if (req.file) {
        updateData.image =
          `/uploads/${req.file.filename}`;
      }

      const restaurant =
        await Restaurant.findByIdAndUpdate(
          req.params.id,
          updateData,
          {
            new: true,
          }
        );

      if (!restaurant) {
        return res.status(404).json({
          message: "Restaurant not found",
        });
      }

      res.json({
        message: "Restaurant updated successfully",
        restaurant,
      });
    } catch (error) {
      console.log(
        "UPDATE RESTAURANT ERROR:",
        error
      );

      res.status(500).json({
        message: "Failed to update restaurant",
      });
    }
  }
);

// DELETE RESTAURANT

app.delete(
  "/api/restaurants/:id",
  async (req, res) => {
    try {
      const restaurant =
        await Restaurant.findByIdAndDelete(
          req.params.id
        );

      if (!restaurant) {
        return res.status(404).json({
          message: "Restaurant not found",
        });
      }

      res.json({
        message: "Restaurant deleted successfully",
      });
    } catch (error) {
      console.log(
        "DELETE RESTAURANT ERROR:",
        error
      );

      res.status(500).json({
        message: "Failed to delete restaurant",
      });
    }
  }
);

// ============================================================
// COUPON APIs
// ============================================================

// GET ALL COUPONS

app.get("/api/coupons", async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({
      createdAt: -1,
    });

    res.json(coupons);
  } catch (error) {
    console.log("GET COUPONS ERROR:", error);

    res.status(500).json({
      message: "Failed to get coupons",
    });
  }
});

// CREATE ADMIN COUPON

app.post("/api/coupons", async (req, res) => {
  try {
    const {
      code,
      discount,
      minOrderAmount,
      validFrom,
      validUntil,
      store,
      description,
      type,
      status,
    } = req.body;

    if (!code || discount === undefined) {
      return res.status(400).json({
        message:
          "Coupon code and discount are required",
      });
    }

    if (
      Number(discount) < 1 ||
      Number(discount) > 100
    ) {
      return res.status(400).json({
        message:
          "Discount must be between 1% and 100%",
      });
    }

    const existingCoupon =
      await Coupon.findOne({
        code: code.toUpperCase(),
      });

    if (existingCoupon) {
      return res.status(400).json({
        message: "Coupon code already exists",
      });
    }

    const coupon = new Coupon({
      code: code.toUpperCase(),
      discount: Number(discount),
      minOrderAmount:
        Number(minOrderAmount) || 0,
      validFrom,
      validUntil,
      store,
      description,
      type,
      status,
      isActive: true,
    });

    const savedCoupon = await coupon.save();

    res.status(201).json({
      message: "Coupon created successfully",
      coupon: savedCoupon,
    });
  } catch (error) {
    console.log(
      "CREATE COUPON ERROR:",
      error
    );

    res.status(500).json({
      message: "Failed to create coupon",
      error: error.message,
    });
  }
});

// GENERATE CUSTOMER COUPON

app.post(
  "/api/coupons/generate",
  async (req, res) => {
    try {
      const {
        customerName,
        customerMobile,
        orderId,
        items,
        totalAmount,
      } = req.body;

      const randomNumber = Math.floor(
        100000 + Math.random() * 900000
      );

      const couponCode =
        `SFC-${randomNumber}`;

      const validUntil = new Date();

      validUntil.setDate(
        validUntil.getDate() + 7
      );

      const coupon = new Coupon({
        code: couponCode,
        discount: 10,
        minOrderAmount: 0,
        validFrom: new Date(),
        validUntil,
        store: "All Restaurants",
        description:
          "Generated coupon after successful order",
        isActive: true,
        type: "Generated",
        status: "Active",
        customerName,
        customerMobile,
        orderId,
        items,
        totalAmount,
      });

      const savedCoupon =
        await coupon.save();

      res.status(201).json({
        message:
          "Coupon generated successfully",
        coupon: savedCoupon,
      });
    } catch (error) {
      console.log(
        "GENERATE COUPON ERROR:",
        error
      );

      res.status(500).json({
        message: "Failed to generate coupon",
        error: error.message,
      });
    }
  }
);

// DELETE COUPON

app.delete(
  "/api/coupons/:id",
  async (req, res) => {
    try {
      const coupon =
        await Coupon.findByIdAndDelete(
          req.params.id
        );

      if (!coupon) {
        return res.status(404).json({
          message: "Coupon not found",
        });
      }

      res.json({
        message: "Coupon deleted successfully",
      });
    } catch (error) {
      console.log(
        "DELETE COUPON ERROR:",
        error
      );

      res.status(500).json({
        message: "Failed to delete coupon",
      });
    }
  }
);

// ============================================================
// ORDER APIs
// ============================================================

// GET ALL ORDERS

app.get("/api/orders", async (req, res) => {
  try {
    const orders = await Order.find().sort({
      createdAt: -1,
    });

    res.json(orders);
  } catch (error) {
    console.log("GET ORDERS ERROR:", error);

    res.status(500).json({
      message: "Failed to get orders",
    });
  }
});

// GET SINGLE ORDER

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
          message: "Invalid order ID",
        });
      }

      const order =
        await Order.findById(req.params.id);

      if (!order) {
        return res.status(404).json({
          message: "Order not found",
        });
      }

      res.json(order);
    } catch (error) {
      console.log(
        "GET SINGLE ORDER ERROR:",
        error
      );

      res.status(500).json({
        message: "Failed to get order",
      });
    }
  }
);

// CREATE ORDER

app.post("/api/orders", async (req, res) => {
  try {
    const {
      name,
      mobile,
      address,
      city,
      state,
      pincode,
      paymentMethod,
      items,
      totalAmount,
    } = req.body;

    if (
      !name ||
      !mobile ||
      !address ||
      !city ||
      !state ||
      !pincode ||
      !paymentMethod
    ) {
      return res.status(400).json({
        message:
          "Please provide all required details",
      });
    }

    const orderNumber =
      `ORD-${Date.now()}`;

    const order = new Order({
      orderNumber,
      name,
      mobile,
      address,
      city,
      state,
      pincode,
      paymentMethod,
      items,
      totalAmount,
      status: "Pending",
    });

    const savedOrder =
      await order.save();

    res.status(201).json({
      message: "Order placed successfully",
      order: savedOrder,
    });
  } catch (error) {
    console.log(
      "CREATE ORDER ERROR:",
      error
    );

    res.status(500).json({
      message: "Failed to place order",
      error: error.message,
    });
  }
});

// UPDATE ORDER STATUS

app.put(
  "/api/orders/:id/status",
  async (req, res) => {
    try {
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({
          message: "Status is required",
        });
      }

      const order =
        await Order.findByIdAndUpdate(
          req.params.id,
          {
            status,
          },
          {
            new: true,
          }
        );

      if (!order) {
        return res.status(404).json({
          message: "Order not found",
        });
      }

      res.json({
        message:
          "Order status updated successfully",
        order,
      });
    } catch (error) {
      console.log(
        "UPDATE ORDER STATUS ERROR:",
        error
      );

      res.status(500).json({
        message:
          "Failed to update order status",
      });
    }
  }
);

// DELETE ORDER

app.delete(
  "/api/orders/:id",
  async (req, res) => {
    try {
      const order =
        await Order.findByIdAndDelete(
          req.params.id
        );

      if (!order) {
        return res.status(404).json({
          message: "Order not found",
        });
      }

      res.json({
        message: "Order deleted successfully",
      });
    } catch (error) {
      console.log(
        "DELETE ORDER ERROR:",
        error
      );

      res.status(500).json({
        message: "Failed to delete order",
      });
    }
  }
);

// ============================================================
// NOTIFICATION APIs
// ============================================================

// GET NOTIFICATIONS

app.get(
  "/api/notifications",
  async (req, res) => {
    try {
      const notifications =
        await Notification.find().sort({
          createdAt: -1,
        });

      res.json(notifications);
    } catch (error) {
      console.log(
        "GET NOTIFICATIONS ERROR:",
        error
      );

      res.status(500).json({
        message: "Failed to get notifications",
      });
    }
  }
);

// MARK NOTIFICATION AS READ

app.put(
  "/api/notifications/:id/read",
  async (req, res) => {
    try {
      const notification =
        await Notification.findByIdAndUpdate(
          req.params.id,
          {
            isRead: true,
          },
          {
            new: true,
          }
        );

      if (!notification) {
        return res.status(404).json({
          message: "Notification not found",
        });
      }

      res.json({
        message: "Notification marked as read",
        notification,
      });
    } catch (error) {
      console.log(
        "MARK NOTIFICATION READ ERROR:",
        error
      );

      res.status(500).json({
        message:
          "Failed to mark notification as read",
      });
    }
  }
);

// MARK ALL NOTIFICATIONS AS READ

app.put(
  "/api/notifications/read-all",
  async (req, res) => {
    try {
      await Notification.updateMany(
        {},
        {
          isRead: true,
        }
      );

      res.json({
        message:
          "All notifications marked as read",
      });
    } catch (error) {
      console.log(
        "MARK ALL NOTIFICATIONS ERROR:",
        error
      );

      res.status(500).json({
        message:
          "Failed to update notifications",
      });
    }
  }
);

// CONTACT MESSAGE APIs
app.post(
  "/api/contact",
  async (req, res) => {
    try {
      console.log("CONTACT DATA:", req.body);

      const {
        name,
        email,
        subject,
        message,
      } = req.body;

      if (!name || !name.trim()) {
        return res.status(400).json({
          message: "Name is required",
        });
      }

      if (!email || !email.trim()) {
        return res.status(400).json({
          message: "Email is required",
        });
      }

      if (!subject || !subject.trim()) {
        return res.status(400).json({
          message: "Subject is required",
        });
      }

      if (!message || !message.trim()) {
        return res.status(400).json({
          message: "Message is required",
        });
      }

      const newContact = new Contact({
        name: name.trim(),
        email: email.trim(),
        subject: subject.trim(),
        message: message.trim(),
        status: "Unread",
      });

      const savedContact = await newContact.save();

      console.log(
        "Contact message saved:",
        savedContact
      );

      // Create notification separately
      // so notification error does not fail contact message
      try {
        await Notification.create({
          title: "New Contact Message 📩",
          message: `${savedContact.name} sent a new message.`,
          type: "contact",
        });
      } catch (notificationError) {
        console.log(
          "CONTACT NOTIFICATION ERROR:",
          notificationError.message
        );
      }

      res.status(201).json({
        message: "Message sent successfully",
        contact: savedContact,
      });
    } catch (error) {
      console.log(
        "CREATE CONTACT ERROR:",
        error
      );

      res.status(500).json({
        message: "Failed to send message",
        error: error.message,
      });
    }
  }
);

app.get(
  "/api/contacts",
  async (req, res) => {
    try {
      const contacts =
        await Contact.find().sort({
          createdAt: -1,
        });

      res.json(contacts);
    } catch (error) {
      console.log(
        "GET CONTACT MESSAGES ERROR:",
        error
      );

      res.status(500).json({
        message:
          "Failed to get contact messages",
      });
    }
  }
);

app.get(
  "/api/contacts/:id",
  async (req, res) => {
    try {
      if (
        !mongoose.Types.ObjectId.isValid(
          req.params.id
        )
      ) {
        return res.status(400).json({
          message: "Invalid contact ID",
        });
      }

      const contact =
        await Contact.findById(
          req.params.id
        );

      if (!contact) {
        return res.status(404).json({
          message:
            "Contact message not found",
        });
      }

      res.json(contact);
    } catch (error) {
      console.log(
        "GET SINGLE CONTACT ERROR:",
        error
      );

      res.status(500).json({
        message:
          "Failed to get contact message",
      });
    }
  }
);

app.put(
  "/api/contacts/:id/read",
  async (req, res) => {
    try {
      if (
        !mongoose.Types.ObjectId.isValid(
          req.params.id
        )
      ) {
        return res.status(400).json({
          message: "Invalid contact ID",
        });
      }

      const updatedContact =
        await Contact.findByIdAndUpdate(
          req.params.id,
          {
            status: "Read",
          },
          {
            new: true,
          }
        );

      if (!updatedContact) {
        return res.status(404).json({
          message:
            "Contact message not found",
        });
      }

      res.json({
        message: "Message marked as read",
        contact: updatedContact,
      });
    } catch (error) {
      console.log(
        "MARK CONTACT READ ERROR:",
        error
      );

      res.status(500).json({
        message:
          "Failed to mark message as read",
      });
    }
  }
);

app.delete(
  "/api/contacts/:id",
  async (req, res) => {
    try {
      if (
        !mongoose.Types.ObjectId.isValid(
          req.params.id
        )
      ) {
        return res.status(400).json({
          message: "Invalid contact ID",
        });
      }

      const deletedContact =
        await Contact.findByIdAndDelete(
          req.params.id
        );

      if (!deletedContact) {
        return res.status(404).json({
          message:
            "Contact message not found",
        });
      }

      res.json({
        message:
          "Contact message deleted successfully",
      });
    } catch (error) {
      console.log(
        "DELETE CONTACT ERROR:",
        error
      );

      res.status(500).json({
        message:
          "Failed to delete contact message",
      });
    }
  }
);

// ============================================================
// START SERVER
// ============================================================

const PORT = 5000;

app.listen(PORT, () => {
  console.log(
    `Server running on http://localhost:${PORT}`
  );
});