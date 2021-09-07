const express = require('express')
const app = express()
const morgan = require('morgan')

const wallet =require('./routes/wallet')
const transaction = require('./routes/transaction')

app.use(morgan('tiny'))
app.use(express.urlencoded({extended:false}))
// to parse json
app.use(express.json())



app.get('/',(req,res)=>{
    console.log("helLo world")
    res.status(200).send('Hello world')
})

app.use('/wallet',wallet)
app.use('/transaction',transaction)


module.exports = app.listen(5000, ()=>{
    console.log("Fabric app server running port 5000")
})