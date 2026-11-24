import express from "express";
import pg from "pg";


const app = express();
const port = 3000;
const db = new pg.Client({
    user: "postgres",
    password: "xxxxxx",
    host: "localhost",
    port: 5432,
    database: "dashboard",
});

db.connect();

app.use(express.static("public"));

app.get("/", (req, res) =>{
  res.sendFile(import.meta.dirname + "/index.html");
});

app.get("/customers/count", async (req, res)=>{
    try{
        const result = await db.query(
            "SELECT count(*) FROM customers"
        );
        res.json(result.rows[0]);
    }
    catch(err){
        res.status(500).json({
        error: "Internal server error",
        message: err.message
        });
    }
});

app.get("/customers", async(req, res)=>{
    console.log("Retrieving data from the CUSTOMERS table...");
    try{
        const page = Number(req.query.page) || 1;
        const limit = 10;
        const offset = (page - 1) * limit;

        const customers = await db.query(
            "SELECT * FROM customers ORDER BY id LIMIT $1 OFFSET $2",
            [limit, offset]
        );
        const count = await db.query(
            "SELECT count(*) FROM customers"
        );
        const totalCustomers = Number(count.rows[0].count);
        const totalPages = Math.ceil(totalCustomers / limit);

        res.status(200).json({
            customers: customers.rows,
            currentPage: page,
            totalPages: totalPages
        });
    }
    catch(err){
        res.status(500).json({
            error: "Internal server error",
            message: err.message
        });
    }
});

app.get("/sales/total", async (req, res)=>{
    try{
        const result = await db.query(
            "SELECT sum(saleamount) FROM sales"
        );
        res.json(result.rows[0]);
    }
    catch(err){
        res.status(500).json({
        error: "Internal server error",
        message: err.message
        });
    }
});

app.get("/sales", async (req, res)=>{
    try{
        const result = await db.query(`
            SELECT products.name, sales.quantity, sales.saleamount
            FROM sales
            LEFT JOIN products ON
            sales.productid = products.id
            ORDER BY sales.id ASC
        `);
        res.json(result.rows);
    }
    catch(err){
        res.status(500).json({
        error: "Internal server error",
        message: err.message
        });
    }
});

app.get("/orders/count", async (req, res)=>{
    try{
        const result = await db.query(
            "SELECT count(quantity) FROM orders"
        );
        res.json(result.rows[0]);
    }
    catch(err){
        res.status(500).json({
        error: "Internal server error",
        message: err.message
        });
    }
});

app.get("/alerts/issues/count", async (req, res)=>{
    try{
        const result = await db.query(
            "SELECT count(id) FROM alerts WHERE type = 'issues'"
        );
        res.json(result.rows[0]);
    }
    catch(err){
        res.status(500).json({
        error: "Internal server error",
        message: err.message
        });
    }
});

app.get("/alerts/issues", async (req, res)=>{
    try{
        const result = await db.query(
            "SELECT * FROM alerts WHERE type = 'issues'"
        );
        res.json(result.rows);
    }
    catch(err){
        res.status(500).json({
        error: "Internal server error",
        message: err.message
        });
    }
});

app.get("/alerts/notifications/count", async (req, res)=>{
    try{
        const result = await db.query(
            "SELECT count(id) FROM alerts WHERE type = 'notifications'"
        );
        res.json(result.rows[0]);
    }
    catch(err){
        res.status(500).json({
        error: "Internal server error",
        message: err.message
        });
    }
});

app.get("/alerts/notifications", async (req, res)=>{
    try{
        const result = await db.query(
            "SELECT * FROM alerts WHERE type = 'notifications'"
        );
        res.json(result.rows);
    }
    catch(err){
        res.status(500).json({
        error: "Internal server error",
        message: err.message
        });
    }
});

app.get("/alerts/tasks", async (req, res)=>{
    try{
        const result = await db.query(
            "SELECT * FROM alerts WHERE type = 'tasks'"
        );
        res.json(result.rows);
    }
    catch(err){
        res.status(500).json({
        error: "Internal server error",
        message: err.message
        });
    }
});

app.listen(port, ()=> {
    console.log(`Server started listening on port ${port}`);
});