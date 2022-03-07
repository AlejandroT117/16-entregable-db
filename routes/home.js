const { Router } = require('express')

const Contenedor = require('../models/products')
const productos = new Contenedor()

const router = Router()

/* GET DATA */


router.get('/', async (req, res)=>{

  res.render('main')
})


router.get('/:id', async(req, res)=>{
  const {id} = req.params

  const producto= await productos.getById(id)

  res.render('unique', {producto})
})



module.exports = router