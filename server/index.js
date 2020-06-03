require('dotenv').config()
const express = require('express')
const massive = require('massive')
const app = express()
const session = require('express-session')
const {SERVER_PORT, SESSION_SECRET, CONNECTION_STRING} = process.env
const authCtrl = require('./controllers/authController')
const treasureCtr1 = require('./controllers/treasureController')
const auth = require('./middleware/authMiddleware')

app.use(express.json())

app.use(session({
    resave: true,
    saveUninitialized: false,
    secret: SESSION_SECRET
}))


app.post('/auth/register', authCtrl.register)
app.post('/auth/login', authCtrl.login)
app.delete('/auth/logout', authCtrl.logout)

app.get('/api/treasure/dragon', treasureCtr1.dragonTreasure)
app.get('/api/treasure/user', auth.userOnly, treasureCtr1.getUserTreasure)
app.post('/api/treasure/user', auth.userOnly, treasureCtr1.addUserTreasure)
app.get('/api/treasure/all', auth.userOnly, auth.adminsOnly, treasureCtr1.getAllTreasure)


massive({
    connectionString: CONNECTION_STRING,
    ssl: {rejectUnauthorized: false}
}).then(db=>{
    app.set('db', db)
    console.log('DB is connected and')
    app.listen(SERVER_PORT, () => console.log(`Gettin the Gold at ${SERVER_PORT}`) )
})


