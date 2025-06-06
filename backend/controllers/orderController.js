const asyncHandler = require('express-async-handler')
const Cart = require('../models/cartModel')
const { User } = require('../models/usersModel')
const Order = require('../models/orderModel')
const calculateCartTotal = require('../utils/calcCartTotal')
const Product = require('../models/productModel')
const sendEmail = require('../utils/sendEmail')

const Razorpay = require('razorpay')
const crypto = require('crypto')

// Razorpay

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
})

// Get Checkout Data
const clearCart = async (userId) => {
    const cart = await Cart.findOne({ userId });
    if (cart) {
      cart.items = [];
      await cart.save();
      console.log(`Cart cleared for user: ${userId}`);
    }
  };
  
  
const sendOrderEmail = async (user, order, products) => {
    const productDetails = products.map(product =>
      `<div style="border: 1px solid #fff; border-radius: 8px;">
        <img src="${product.image}" width="80px" style="border-radius:8px;">
        <p><strong>Product:</strong> ${product.name}</p>
        <p><strong>Price:</strong> Rs. ${product.price}</p>
      </div>`
    ).join('');
  
    await sendEmail({
      to: user.email,
      subject: 'ORDER CONFIRMED - SHOPPERS',
      text: `Your order has been confirmed successfully.`,
      html: `
        <div>
          <h1 style="color: #FF6F61;">SHOPPERS!</h1>
          <h1>Thank you for Shopping with us!</h1>
          <p>Your order is now confirmed.</p>
          <div>
            <h4>Shipping Address:</h4>
            <p>${order.shippingInfo.street}, ${order.shippingInfo.city}, 
            ${order.shippingInfo.state}, ${order.shippingInfo.country}, ${order.shippingInfo.zipCode}</p>
          </div>
          <div>
            <h4>Order Details :</h4>
            <div>${productDetails}</div>
            <p style="text-align:end">Total Amount: <b>Rs.${order.totalAmount}</b></p>
          </div>
        </div>`
    });
  
    console.log(`Email sent to ${user.email}`);
  };
  
  
  // 👉 Place Order
  const placeOrder = asyncHandler(async (req, res) => {
    const userId = req.user;
    const { addressId, paymentMethod } = req.body;
  
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    if(!paymentMethod){
      throw new Error('Select a Payment Method Please...')
    }
  
    const cart = await Cart.findOne({ userId });
    if (!cart || cart.items.length === 0) throw new Error('Cart is empty');
  
    const products = await Product.find({ _id: { $in: cart.items.map(item => item.productId) } });
  
    const address = user.addresses.id(addressId);
    if (!address) throw new Error('Invalid Address');
  
    const totalAmount = await calculateCartTotal(userId);
  
    let orderData = {
      userId,
      items: cart.items,
      shippingInfo: address,
      paymentMethod,
      totalAmount,
      status: paymentMethod === "Razorpay" ? "Pending" : "Confirmed"
    };
  
    if (paymentMethod === "Razorpay") {
      const razorpayOrder = await razorpay.orders.create({
        amount: totalAmount * 100,
        currency: "INR",
        receipt: `order_${Date.now()}`,
        payment_capture: 1
      });
  
      orderData.razorpayOrderId = razorpayOrder.id;
      const order = await Order.create(orderData);
  
      res.json({
        success: true,
        razorpayOrderId: razorpayOrder.id,
        totalAmount,
        key: process.env.RAZORPAY_KEY_ID,
        internalOrderId: order._id.toString()
      });
      return;
    }
  
    // For COD orders, create order immediately.
    const order = await Order.create(orderData);
  
    // Clear cart and send email
    await clearCart(userId);
    await sendOrderEmail(user, order, products);
  
    res.status(201).json({
      message: "Order placed Successfully",
      order
    });
  });
  
  
  // 👉 Verify Payment
  const verifyPayment = asyncHandler(async (req, res) => {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      internalOrderId
    } = req.body;
  
    const secret = process.env.RAZORPAY_KEY_SECRET;
    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generatedSignature = hmac.digest("hex");
  
    if (generatedSignature !== razorpay_signature) {
      console.error("❌ Payment Verification Failed!");
      res.status(400).json({ success: false, message: "Payment verification failed" });
      return;
    }
  
    console.log("✅ Payment Verified Successfully!");
  
    const order = await Order.findById(internalOrderId).populate('userId');
    if (!order) throw new Error("Order not found");
  
    order.status = "Confirmed";
    order.paymentStatus = "Paid";
    await order.save();
  
    await clearCart(order.userId);
    const products = await Product.find({ _id: { $in: order.items.map(item => item.productId) } });
    await sendOrderEmail(order.userId, order, products);
  
    res.json({
      success: true,
      message: "Payment verified, order confirmed, cart cleared, and email sent"
    });
  });
  
// query to find orders now.
// const order = await Order.findOne({ _id: internalOrderId, razorpayOrderId: razorpay_order_id });


// Get Customer Orders 

const GetCustomerOrders = asyncHandler(async (req, res) => {
    const userId = req.user
    const orders = await Order.find({ userId })

    if(!orders){
        res.status(400)
        throw new Error('Orders Not found')
    }

    res.status(200).json({ orders })
})

// Users Order Info By Id
const OrderInfoById = asyncHandler(async (req, res) => {
    const orderId = req.params.id
    const order = await Order.findById(orderId)

    if(!order){
        res.status(400)
        throw new Error('Order not found')
    }

    res.status(200).json({order})

})

const OrderStatus = asyncHandler(async (req, res) => {
  const orderId = req.params.id;
  const order = await Order.findById(orderId);
  
  if (!order) {
      res.status(400);
      throw new Error('Order not found');
  }

  const user = await User.findById(order.userId);
  if (!user) {
      res.status(400);
      throw new Error('User not found');
  }

  const { status } = req.body;
  order.status = status;

  const cart = await Cart.findOne({ userId: order.userId });
  if (!cart || cart.items.length === 0) throw new Error('Cart is empty');

  const products = await Product.find({ _id: { $in: cart.items.map(item => item.productId) } });
  const productDetails = products.map(product =>
    `<div style="border: 1px solid #fff; border-radius: 8px; padding: 8px; margin: 4px;">
      <img src="${product.image}" width="80px" style="border-radius:8px;">
      <p><strong>Product:</strong> ${product.name}</p>
      <p><strong>Price:</strong> Rs. ${product.price}</p>
    </div>`
  ).join('');

  let emailSubject, emailText, emailHtml;

  switch (status) {
      case "Confirmed":
          emailSubject = "ORDER CONFIRMED - SHOPPERS";
          emailText = "Your order has been confirmed successfully.";
          emailHtml = `<h1 style="color: #4CAF50;">Your Order is Confirmed!</h1>`;
          break;
      case "Pending":
          emailSubject = "ORDER PENDING - SHOPPERS";
          emailText = "Your order is currently pending.";
          emailHtml = `<h1 style="color: #FFA500;">Your Order is Pending</h1>`;
          break;
      case "Shipped":
          emailSubject = "ORDER SHIPPED - SHOPPERS";
          emailText = "Your order has been shipped.";
          emailHtml = `<h1 style="color: #1E90FF;">Your Order is Shipped</h1>`;
          break;
      case "Delivered":
          emailSubject = "ORDER DELIVERED - SHOPPERS";
          emailText = "Your order has been delivered.";
          emailHtml = `<h1 style="color: #008000;">Your Order is Delivered!</h1>
             <div>
              <h4>to your Shipping Address:</h4>
              <p>${order.shippingInfo.street}, ${order.shippingInfo.city}, 
              ${order.shippingInfo.state}, ${order.shippingInfo.country}, ${order.shippingInfo.zipCode}</p>
            </div>
          `;
          break;
      case "Cancelled":
          emailSubject = "ORDER CANCELLED - SHOPPERS";
          emailText = "Your order has been cancelled.";
          emailHtml = `<h1 style="color: #FF6F61;">Your Order is Cancelled!</h1>`;
          break;
      default:
          res.status(400);
          throw new Error('Invalid order status');
  }

  await sendEmail({
      to: user.email,
      subject: emailSubject,
      text: emailText,
      html: `
          <h1 style="color: #FF6F61;">SHOPPERS!</h1>
          ${emailHtml}
          <h4>Order Details :</h4>
          <div>${productDetails}</div>
          <span style="text-align: end; font-weight: bold;">Total Price : Rs. ${order.totalAmount}</span>
      `
  });

  await order.save();
  res.status(201).json({
      message: status === "Cancelled" ? "Order Cancelled" : "Order Status Updated",
      order
  });
});

const GetMyOrders = asyncHandler(async (req, res) => {
  const userId = req.user;

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const total = await Order.countDocuments({ userId });

  const orders = await Order.find({ userId })
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 }); 

  res.status(200).json({
      orders,
      total,
      page,
      pages: Math.ceil(total / limit),
  });
});


module.exports = {
    placeOrder,
    GetCustomerOrders,
    OrderInfoById,
    OrderStatus,
    GetMyOrders,
    verifyPayment
}