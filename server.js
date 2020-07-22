var express = require("express")
var app = express()
var db = require("./database.js")
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var PORT = 80

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
});

app.use(function(req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});


app.get("/", (req, res, next) => {
    var sql = "select * from data"
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "data": rows
        })
    });
});

app.get('/api/random', (req, res, next) => {

    var array = []
    for (var i = 1; i <= 10; i++) {
        array[i] = between()
        db.run(`UPDATE data set number = ${array[i]} WHERE id = ${i}`, function(err, result) {
            if (err) {
                res.status(400).json({ "error": res.message })
                return;
            }
        })
    }

    res.json({
        "message": "success",
    })

    function between() {
        return Math.floor(
            Math.random() * (99 - 10 + 1) + 10
        )
    }
})

app.get('/api/clear', (req, res, next) => {

    db.run(`UPDATE data set number = ""`, function(err, resultClear) {
        if (err) {
            res.status(400).json({ "error": res.message })
            return;
        }
        res.json({
            "message": "success",
        })
    })

})

app.get('/api/divide', (req, res, next) => {

    var ar1 = []
    var numb = 0;
    db.all("SELECT * from data", (err, resultData) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        for (var i = 0; i < 10; i++) {
            for (var j = 0; j < 10; j++) {
                if (i != j) {
                    if (resultData[i].number > resultData[j].number) {
                        if ((resultData[i].number % resultData[j].number) == 0) {
                            ar1.push({ nm1: resultData[i].number, nm2: resultData[j].number })
                            numb++;
                        }

                    }
                }
            }
        }
        res.json({
            "message": "success",
            "ar1": ar1,
            "number": numb
        })
    })

})

app.use(function(req, res) {
    res.status(404);
});