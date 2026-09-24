import Order from "../models/order.js";
import Product from "../models/product.js";

export async function createOrder(req, res) {
    try {

        // Check authentication
        if (req.user == null) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        const orderData = {
            orderId: "ORD000001",

            firstName: req.body.firstName || req.user.firstName,
            lastName: req.body.lastName || req.user.lastName,

            email: req.body.email || req.user.email,

            addressLine1: req.body.addressLine1,
            addressLine2: req.body.addressLine2,
            city: req.body.city,
            phone: req.body.phone,

            items: [],
            totalAmount: 0
        };

        // Find latest order
        const lastOrder = await Order.findOne().sort({
            date: -1
        });

        if (lastOrder != null) {

            const lastOrderId = lastOrder.orderId;

            const lastOrderNumberInString =
                lastOrderId.replace("ORD", "");

            const lastOrderNumber =
                parseInt(lastOrderNumberInString);

            const newOrderNumber =
                lastOrderNumber + 1;

            const newOrderNumberString =
                newOrderNumber.toString().padStart(6, "0");

            orderData.orderId =
                "ORD" + newOrderNumberString;
        }

        // Validate products
        for (let i = 0; i < req.body.items.length; i++) {

            const requestedItem = req.body.items[i];

            const foundProduct = await Product.findOne({
                productId: requestedItem.productId
            });

            if (foundProduct == null) {
                return res.status(400).json({
                    message:
                        "Product with id " +
                        requestedItem.productId +
                        " is not found"
                });
            }

            if (foundProduct.isAvailable == false) {
                return res.status(400).json({
                    message:
                        "Product with id " +
                        requestedItem.productId +
                        " is not available"
                });
            }

            if (requestedItem.qty > foundProduct.stock) {
                return res.status(400).json({
                    message:
                        "Product with id " +
                        requestedItem.productId +
                        " does not have enough stock"
                });
            }

            orderData.items.push({
                product: {
                    productId: foundProduct.productId,
                    name: foundProduct.name,
                    image: foundProduct.images[0],
                    price: foundProduct.price,
                    labelledPrice: foundProduct.labelledPrice
                },

                qty: requestedItem.qty
            });

            orderData.totalAmount +=
                foundProduct.price * requestedItem.qty;
        }

        // Save order
        const newOrder = new Order(orderData);

        await newOrder.save();

        // Reduce product stock
        for (let i = 0; i < req.body.items.length; i++) {

            await Product.updateOne(
                {
                    productId: req.body.items[i].productId
                },
                {
                    $inc: {
                        stock: -req.body.items[i].qty
                    }
                }
            );
        }

        return res.status(201).json({
            message: "Order created successfully",
            orderId: newOrder.orderId
        });

    } catch (err) {

        console.log(err);

        return res.status(500).json({
            message: err.message
        });
    }
}