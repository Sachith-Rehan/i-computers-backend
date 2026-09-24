import order from "../models/order.js"
import product from "../models/product.js"

export async function createOrder(req, res) {
      try{
            if(req.user == null){
                  res.status(401).json({message : "Unauthorized"})
            }

            const orderData = {
                  orderId : "ODR000001",
                  firstName : req.body.firstName || req.user.firstName,
                  lastName : req.body.lastName || req.user.lastName,
                  email : req.body.email ,
                  addressLine1 : req.body.addressLine1 ,
                  addressLine2 : req.body.addressLine2 ,
                  city : req.body.city ,
                  phone : req.body.phone ,
                  items : [],
                  totalAmount : 0

            }

            const lastOrder = await order.findOne().sort({date : -1})

            if (lastOrder != null){
                  const lastOrderId = lastOrder.orderId
                  const lastOrderNumberInString = lastOrderId.replace("ORD", "")
                  const lastOrderNumber = parseInt(lastOrderNumberInString)
                  const newOrdernumber = lastOrderNumber + 1
                  const newOrderNumberString = newOrdernumber.toString().padStart(6, "0")

                  orderData.orderId = "ORD" + newOrderNumberString

            }

            for(let i=0 ; i<req.body.items.length; i++){
                  const product = await product.findOne({productId : req.body.items[i].productId})

                  if(product ==null){
                        res.status(400).json({message : "Product with id " + req.body.items[i].productId + "is not found"})
                        return
                  }

                  if(product.isAvailable == false){
                        res.status(400).json({message : "Product with id " + req.body.items[i].productId + "is not available"})
                        return
                  }

                  if(req.body.items[i].qty > product.stock){
                        res.status(400).json({message : "Product with id " + req.body.items[i].productId + "is hane not enough stock"})
                        return
                  }

                  orderData.items.push({
                        product : {
                              productId : product.productId,
                              name : product.name,
                              image : product.images[0], 
                              price : product.price,
                              labelledPrice: labelledPrice
                        },
                        qty : req.body.items[i].qty    
                  })

                  orderData.totalAmount += product.price * req.body.items[i].qty
            }

            const newOrder = new order(orderData)
            await newOrder.save()

            for(let i =0; i< req.body.items[i].length; i++){
                  await product.updateOne(
                        {productId : req.body.items[i].productId},
                        {$inc : {stock : -req.body.items[i].qty}}
                  )
            }

            res.json({message : "Order created successfully", orderId :newOrder.productId})

      }catch(err){

      }
}