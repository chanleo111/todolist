import mysql from 'mysql2';
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

app.listen(3001, () => {
    console.log('ok, server is running on port 3001');
})
const db=mysql.createPool({
    host:"localhost",
    user:"root",
    password:"root",
    database:"todolist",
    port:3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})

app.get("/tasks", async (req,res) => {
    try {
        const [rows] = await db.promise().query("SELECT * FROM task");
        if(!res){
            res.send(rows);
        }
    } catch (error) {
        console.error('Fetch error:', error);
        res.status(500).send({ message: 'Error fetching task' });
    }
});

app.get("/health", async (req, res) => {
    try {
        const connection = await db.promise().getConnection();
        connection.release();
        res.send('Database connection is healthy');
    } catch (error) {
        console.error('Health check failed:', error);
        res.status(500).send('Database connection failed');
    }
});
db.on('error',(error) => {
    console.log('database error,error');
})
app.post("/create",(req,res)=>{
    const task = req.body.task;
    const date = req.body.date;
    if(!task || !date){
        return res.status(400).send('Task and date');
    }
    db.query("INSERT INTO Task(task,date) value(?,?)",
        [task,date],
        (error, result) =>{
        if(error){
            console.log('query error:'+error);
        }else{
            res.send({id:result.insertId ,task,date});
        }
    })
})

app.post("/delete:id",(req,res)=>{
    const id =req.params;
    db.query("DELETE FROM Task where id=?",[id]
    ,(error,result) =>{
        if(error){
            console.log('delete task fail');
        }else{
            console.log('delete success');
        }
    })
})


