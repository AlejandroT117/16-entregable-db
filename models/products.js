const knex = require('knex')
const path = require('path')

const fs = require('fs').promises

class Contenedor{
  constructor(filename){
    this.filename = filename
    this.db=knex({
      client:'mysql',
      connection:{
        host:'localhost',
        port:3306,
        user:'root',
        password:'',
        database:'productos_db'
      }
    })
  }

  async save(new_object){
    try{
      const result = await this.db('productos').insert(new_object)

      return result[0]
    }catch(e){
      console.log(e)
    }

  }

  async getById(id){
    try{
      const obj = await this.db('productos')
      .where({id})
      .first()

      if(!obj){
        return null
      }

      return obj
    }catch(e){
      console.log(e)
    }
  }

  async loadData(){
    try{
      await this.db.schema.dropTableIfExists('productos')
  
      await this.db.schema.createTable('productos', (table)=>{
        table.increments('id')
        table.string('nombre')
        table.integer('precio')
        table.string('img')
        table.integer('stock')
      })
  
      const raw = await fs.readFile(path.join(__dirname,this.filename), 'utf-8')
      const productos = JSON.parse(raw)
  
      for(const p of productos){
        console.log(p)
        await this.db('productos').insert(p)
      }
  
      console.log('data cargada a db')

    }catch(e){
      console.log(e)
      throw e;
    }finally{
      this.db.destroy()
    }
  }

  async getAll() {
    try{
      const data = await this.db('productos')

      return data
    }catch(e){
      console.log('Error al obtener datos: ' + e)
    }
  }

  
  async uptadeById(id, producto){
    await this.db('productos')
      .where({id})
      .update(producto)
  }

  async deleteById(id){
    try{
      const result = await this.db('productos')
        .where({id})
        .del()

      console.log(`Número de registros borrados: ${result}`)
    }catch(e){  
      console.log(e)
    }
  }

  async deleteAll(){
    try{
      await this.db.schema.dropTableIfExists('productos')
  
      await this.db.schema.createTable('productos', (table)=>{
        table.increments('id')
        table.string('nombre')
        table.integer('precio')
        table.string('img')
        table.integer('stock')
      })

      console.log('Nueva tabla vacía creada')
    }catch(e){
      console.log(e)
    }
  }


}


module.exports = Contenedor