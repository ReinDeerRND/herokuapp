const express=require('express');
const app=express();
var path = require('path');

const PORT=process.env.PORT||80 //5000
const queryString="SELECT * FROM goods;"

const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req,res)=>{
    res.sendFile(__dirname+"/goods.html");
});

app.get('/db', async (req, res) => {
    try {
      const client = await pool.connect();
      const result = await client.query(queryString);
      const results = { 'results': (result) ? result.rows : null};
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');   
      res.send(results);
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error of connection" + err);     
    }
  });

app.listen(PORT, ()=>{
    console.log("Sever nas been started...");
});