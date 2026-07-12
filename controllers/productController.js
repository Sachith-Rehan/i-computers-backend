import Product from "../models/product.js";

//create product
export async function createProduct(req,res){
    
    if(req.user == null){
        res.status(401).json({message : "unauthorized"});
        return;
    }


    if(req.user.isAdmin == false){
        res.status(403).json({message : "only admin can create product"});
        return;
    }
    
    const product = await Product.findOne({productId : req.body.productId});

    if(product != null){
        res.status(400).json({message : "product with this productId already exists"});
        return;
    }
    
    const newProduct = new Product(req.body);
    
    try{
        await newProduct.save();
        res.json({message : "product created successfully"});

    } catch (error) {
        res.status(500).json({message : "error creating product"});
    }
}
  
//read product

export async function getAllProducts(req,res){

    
    try {

        if(req.user != null && req.user.isAdmin){ 
            const products = await Product.find();
            res.json(products);
        
        }else{
            const products = await Product.find({isAvailable : true});
            res.json(products);
        }

    } catch (error) {
        res.status(500).json({message : "error fetching products"});
    }
}
//update product

export async function updateProduct(req,res){
        if(req.user != null && req.user.isAdmin ){
            
            try{
                if(req.body.productId != null){
                    res.status(400).json({message : "productId cannot be updated"});
                    return;
                }
                //await Product.updateOne({productId : req.params.productId} , req.body);
               
                await Product.findOneAndUpdate({ productId: req.params.productId },req.body);
                
                res.json({message : "product updated successfully"});

            }catch(error){
                res.status(500).json({message : "error updating product"});
            }
            
        }else{
            res.status(403).json({message : "only admin can update product"});
        }
    
}


//delete product

export async function deleteProduct(req,res){
    if(req.user != null && req.user.isAdmin == true){
        try{
            const product = await Product.findOne({productId : req.params.productId});

            if(product == null){
                res.status(404).json({message : "product not found"});
                return;
            }

            await Product.deleteOne({productId : req.params.productId});
            res.json({message : "product deleted successfully"});


        }catch(err){
            res.status(500).json({message : "error deleting product"});
        }
    }else{
        res.status(403).json({message : "only admin can delete product"});
    }
}    


export async function getProductById(req,res){

    try{
        
        const product = await Product.findOne({productId : req.params.productId});

        if(product == null){
            res.status(404).json({message : "product not found"});
            return;
        }
        
        if(product.isAvailable){
            res.json(product);
            
        }else{
            if(req.user != null && req.user.isAdmin){
                res.json(product);
            }else{
                res.status(403).json({message : "only admin can access unavailable product"});
            }
        }
        

    }catch(error){
        res.status(500).json({message : "error fetching product"});
    }
}