/**
 * requieres
 */
const express = requiere('express')
const bodyParse = require('body-parse')
const mongose = require('mongose')

/**
 * products
 * import
 */
const Product = require('/models/product')
const product = require('./models/product')


/**
 * server
 */
const app = express()
const port = process.env.PORT || 9000

/**
 * middlewares
 */

 app.use(bodyParse.urlencoded({extendend: false}))
 app.use(bodyParse.json())

app.get('api/product',(req, res) => {

    Product.find({}, (err, products) =>{
        if (err) return res.status(500).send({
              menssage: `Error when requesting: ${err}`
        })

        if(!product) return res.status(404).send({
                 message: ` there are no product`
       })

        res.status(200).send({products})
    })
})

app.get('api/product/:productId',(req, res) => {

    let productId = req.params.productID
   Product.findById(productId, (err, Product) => {
       if(err) return res.status(500).send({
       message: `Error when requesing: ${err}`
       })

       if(!product) return res.status(404).send({
        messege: `product does not exist`
        })
 
       res.status(200).send({product})
   })

   

})

app.post('/api/products', (req, res) => {
    //console.log(res.body)
   //usar el esquema Schema and register product in the data base 

   let product = new Product
   product.name = req.body.name
   product.price = req.body.name
   product.category = req.body.category
   product.image = req.body.image

   product.save( (err, productStored) => {
       if (err) res.status(500).send( {messege: `save error: ${err}`})
       res.status(200).send({product: productStored})

   })

})

app.put('/api/products/:productId', (req, res) => {
     
    let productId = req.params.productID
    let updateData = req.body

    Product.findByIdAndUpdate(productId, updateData,(err,productUpddate) => {
        if(err) return res.status(500).send({
             message: `failed to update: ${err}`
        })

        res.status(200).send({product: productUpddate })
    })
    

})

app.delete('/api/products/:productId', (req, res) => {

    let productid = req.params.productID

    Product.findById(productId, (err, product)=>{
        if (err) return res.status(500).send({
            messege: `Error deleting ${err}`
        })

        if(!product) return res.status(404).send({
                  message: `producto not exist `
        })

        product.remove( err => {
              if(err) return res.status(500).send({
                  message: `Error deleting: ${err}`
              })
              res.status(200).send({
                  messege:`Product removed`
              })

        })
    })

})
/**
 * server connect 
 */
mongose.connect('mongodb://localhost:27017//productswcg',(err, res)=>{
  if (err) throw err
  console.log('Database connection ok')

  const server = app.Listen(port, () => {
      console.log( `Listen http://localhost:${server.address().port}`)
  })
})