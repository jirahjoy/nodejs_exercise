const async = require('hbs/lib/async');
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    port: process.env.DATABASE_PORT,
    database: process.env.DATABASE
});

// display list
exports.getList = (req, res) =>{
    db.query('SELECT  p.product_id, p.product_name, p.product_description, p.quantity, GROUP_CONCAT(s.supplier_name) as supplier_name from product_supplier ps INNER JOIN products p ON p.product_id = ps.product_id INNER JOIN supplier s ON s.supplier_id = ps.supplier_id GROUP BY p.product_id',
    (error, result)=>{
        return res.status(401).render('productList', {products:result, message:req.query.success})
    })
}

exports.getSupplier = (req, res) =>{
    db.query('SELECT * FROM supplier', 
    (error, result) =>{
        if(error){
            console.log(error);
        } else{
            return res.render('index',{suppliers: result});
        }
    })
}

exports.displayFormProduct = (req, res) =>{

}
exports.addProducts = (req, res) =>{
    const {product_name, product_description, quantity, supplier} = req.body;
    db.query('INSERT INTO products(product_name, product_description, quantity) VALUES(?, ?, ?)',  [product_name, product_description, quantity],
    (error, result) =>{
        if(error){
            console.log(error);
        } else{
            let newProdId = result.insertId;
            if(Array.isArray(supplier)){
                supplier.forEach(id =>{
                    db.query('INSERT INTO product_supplier(product_id, supplier_id) VALUES(?, ?)', [newProdId, id],
                    (error)=>{
                        if(error){
                            console.log(error);
                        }
                        else{
                           
                        }
                       });   
                })
                return res.redirect('/auth/getList?success="Record successfully added"');
            } else{
                db.query('INSERT INTO product_supplier(product_id, supplier_id) VALUES(?, ?)', [newProdId, supplier],
                (error)=>{
                    if(error){
                        console.log(error);
                    }
                    else{
                        return res.redirect('/auth/getList?success="Record successfully added"');
                    }
                }); 
            }
           
        }
    } )
}


exports.deleteForm = (req, res) =>{
    console.log(req);
    const productId = req.params.product_id;
    db.query('DELETE FROM products WHERE product_id = ?', productId,
    (error, result)=>{
        if(error){
            console.log(error);
        } else{
            return res.redirect('/auth/getList?success="Record has been deleted"');
        }

    })

}

exports.editProducts = (req, res) =>{
    const productId = req.params.product_id;
    let supplierList = [];
    db.query('SELECT * FROM supplier', 
    (error, result) =>{
        if(error){
            console.log(error);
        } else{
            supplierList = result;
        }
    })
    db.query('SELECT * FROM products WHERE product_id = ?', productId,
    (error, result)=>{
        if(error){
            console.log(error);
        }else{
            console.log(result[0]);
            db.query('SELECT supplier_id FROM product_supplier WHERE product_id = ?', productId,
            (error, supplier)=>{
                if(error){
                    console.log(error);
                }else{

                    supplier = supplier.map((s)=> s.supplier_id);
                    return res.render('updateProduct', {selectedSuppliers: supplier, supplierList: supplierList, products: result[0], message:req.query.success})
                    
                }
            })
            // return res.render('updateProduct', {products: result[0]})
        }
    })
}

exports.editProductsItems = (req, res)=>{
    
    const {product_id, product_name, product_description, quantity, supplier} = req.body;
    
    if(
        supplier === undefined){
        return res.redirect('/auth/updateForm/' + product_id + '?success="Error, please select a supplier name."');
    }
    db.query('UPDATE products SET product_name = ?, product_description = ?, quantity = ? WHERE product_id = ?',  [product_name, product_description, quantity, product_id],
    (error, result) =>{
        if(error){
            console.log(error);
        } else{
            db.query('DELETE FROM product_supplier WHERE product_id = ?', product_id,
            (error, result)=>{
                if(error){
                    console.log(error);
                } 
            })
            if(Array.isArray(supplier)){
                supplier.forEach(id =>{
                    db.query('INSERT INTO product_supplier(product_id, supplier_id) VALUES(?, ?)', [product_id, id],
                    (error)=>{
                        if(error){
                            console.log(error);
                        }
                       });   
                })
                return res.redirect('/auth/getList?success="Record successfully updated"');
            } else{
                console.log(supplier);
                db.query('INSERT INTO product_supplier(product_id, supplier_id) VALUES(?, ?)', [product_id, supplier],
                (error)=>{
                    if(error){
                        console.log(error);
                    }
                    else{
                        return res.redirect('/auth/getList?success="Record successfully updated"');
                    }
                }); 
            }
           
        }
    } )
}