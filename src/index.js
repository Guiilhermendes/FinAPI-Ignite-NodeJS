const express = require('express');
const { v4: uuidv4 } = require('uuid');
const app = express();
app.use(express.json());

const customers = [];

// Middleware
function verifyIfExistsAccountCPF(req, res, next) {
    const { cpf } = req.headers;
    const customer = customers.find(el => el.cpf === cpf);
    if (!customer) return res.status(400).json({ error: 'Customer not found!' });
    req.customer = customer;
    return next();
}

app.post("/account", (req, res) => {
    const { cpf, name } = req.body;

    const customersAlreadyExist = customers.some(el => el.cpf === cpf)
    if (customersAlreadyExist) return res.status(400).json({ error: 'Customer already exists!' })

    customers.push({
        cpf,
        name,
        id: uuidv4(),
        statement: []
    })

    return res.status(201).send("That's ok man")
});

app.get("/statement", verifyIfExistsAccountCPF, (req, res) => {
    const { customer } = req
    return res.json(customer.statement);
});

app.listen(3333);