const knex = require('knex')
const path = require('path')
const fs = require('fs').promises

class Cont_Mensajes{
  constructor(filename){
    this.filename = filename
    this.db= knex({
      client: 'sqlite3',
      connection:{
        filename: './db/mensajes.sqlite'
      }
    })
  }

  async save(new_object){
    try{
      
      const result = await this.db('mensajes').insert(new_object)

      return result[0]
    }catch(e){
      console.log(e)
    }

  }

  async getById(id){
    try{
      const obj = await this.db('mensajes')
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
      await this.db.schema.dropTableIfExists('mensajes')
  
      await this.db.schema.createTable('mensajes', (table)=>{
        table.increments('id')
        table.string('email')
        table.string('mensaje')
        table.string('fecha')
      })
  
      const raw = await fs.readFile(path.join(__dirname,this.filename), 'utf-8')
      const mensajes = JSON.parse(raw)
  
      for(const m of mensajes){
        console.log(m)
        await this.db('mensajes').insert(m)
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
      const data = await this.db('mensajes')

      return data
    }catch(e){
      console.log(e)
    }
  }

  async uptadeById(id, mensaje){
    await this.db('mensajes')
      .where({id})
      .update(mensaje)
  }

  async deleteById(id){
    try{
    
      const result = await this.db('mensajes')
      .where({id})
      .del()

    return result[0]
    }catch(e){  
      console.log(e)
    }
  }

  async deleteAll(){
    try{
      await this.db.schema.dropTableIfExists('mensajes')
  
      await this.db.schema.createTable('mensajes', (table)=>{
        table.increments('id')
        table.string('email')
        table.string('mensaje')
        table.string('fecha')
      })

      console.log('nueva tabla vacía creada')
    }catch(e){
      console.log(e)
    }
  }


}


module.exports = Cont_Mensajes