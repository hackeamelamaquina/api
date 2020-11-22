const { json } = require('express');
const express = require('express');
const mysql = require('mysql');
const PORT = process.env.PORT || 3051;



const app = express();

app.use(express.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

const connection = mysql.createConnection({
  host: 'us-cdbr-east-02.cleardb.com',
  user: 'bd915f489612d4',
  password: 'a96aadd6',
  database: 'heroku_f8856b73e998362'
});

app.get('/', (req, res) => {
  res.send('Welcome to my API!');
});
app.put('/costos/', (req, res) => {
 // const { id } = req.params; 
  const { nombre, precio, id, accion } = req.body;
  var sql = "";  
  if (accion == 1) {
   sql = `insert into cotcostos (ProductoNombre, costo) values( '${nombre}','${precio}')`;
  }else if (accion == 2){
    sql = `UPDATE cotcostos SET ProductoNombre = '${nombre}', costo='${precio}' WHERE id =${id}`;
  }else{
    sql = `DELETE FROM cotcostos WHERE id =${id}`;
  }
  const sql2 = sql
  console.log("datos: " + req.body.accion)

  connection.query(sql2, error => {
    if (error) throw error;
    res.json({msg : "Completado"});   
    //console.log(`Costo ${id} actulizado!`)
  });
});
app.get('/costos', (req, res) => {
  const sql = 'CALL CotCostosTraeDatos()';
  connection.query(sql, (error, results) => {
    if (error) throw error;
    if (results.length > 0) {
      res.json(results[0]);
     // console.log(results[0]);
    } else {
      res.send('Not result');
    }
  });
});
app.post('/login', (req, res) => { 
  const { usuario, psw } = req.body;
  console.log(req.body)
  const sql = `CALL login( '${usuario}','${psw}')`;
  connection.query(sql, (error, results) => {
    if (error) throw error;
    if (results.length > 0) {
      res.send(results[0]);
      console.log(results[0]);
    } else {
      res.send('Not result');
    }
  });
});
app.post('/verificaToken', (req, res) => { 
  const { vtoken } = req.body;
  console.log(req.body)
  const sql = `CALL verificaToken( '${vtoken}')`;
  connection.query(sql, (error, results) => {
    if (error) throw error;
    if (results.length > 0) {
      res.send(results[0]);
      console.log(results[0]);
    } else {
      res.send('Not result');
    }
  });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
console.log("Server Http on");