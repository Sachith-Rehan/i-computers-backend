import mongoose from 'mongoose';
 
const ProductSchema = new mongoose.Schema({
    productId: {
        type: String,
        required: true,
        unique: true
    },
    name: { 
        type: String, 
        required: true 
    },
    altNames: {
        type: [String],
        default: [],
        required: true
    },
    price: { 
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    labelledPrice: {
        type: String,
        required: true
    },
    images: {
        type: [String],
        default: ["/default-product-1.png", "/default-product-2.png"],
        required: true
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    category: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true,
        default: 0   
    },
    brand: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    }            

})

export default mongoose.model('Product', ProductSchema);