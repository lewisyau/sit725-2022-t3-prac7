var express = require("express")
var app = express()
var cors = require("cors")
let projectCollection;

let http = require('http').createServer(app);
let io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors())

// let io = require('socket.io')(http);
io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  setInterval(()=>{
    socket.emit('number', parseInt(Math.random()*10));
  }, 1000);

});

//mongoDb connection...
const MongoClient = require('mongodb').MongoClient;

//add database connections...
const uri = 'mongodb+srv://cwyau:Mdb123456@cluster0.8bjo9wu.mongodb.net/?retryWrites=true&w=majority'
const client = new MongoClient(uri, { useNewUrlParser: true })

// insert project...
const insertProjects = (project, callback) => {
    projectCollection.insert(project, callback);
}

const getProjects = (callback) => {
    projectCollection.find({}).toArray(callback);
}

const createColllection = (collectionName) => {
    client.connect((err, db) => {
        projectCollection = client.db().collection(collectionName);
        if (!err) {
            console.log('MongoDB Connected')
        }
        else {
            console.log("DB Error: ", err);
            process.exit(1);
        }
    })
}

const cardList = [
    {
        title: "Landscape 2",
        image: "images/image_2A.jpg",
        link: "About Landscape 2",
        desciption: "Demo desciption about Landscape 2"
    },
    {
        title: "Landscape 3",
        image: "images/image_3A.jpg",
        link: "About Landscape 3",
        desciption: "Demo desciption about Landscape 3"
    }
]

app.get('/api/projects', (req, res) => {
    getProjects((err, result) => {
        if (err) {
            res.json({ statusCode: 400, message: err })
        }
        else {
            res.json({ statusCode: 200, message: "Success", data: result })
        }
    })
})

// post api....
app.post('/api/projects', (req, res) => {
    console.log("New Project added", req.body)
    var newProject = req.body;
    insertProjects(newProject, (err, result) => {
        if (err) {
            res.json({ statusCode: 400, message: err })
        }
        else {
            res.json({ statusCode: 200, message: "Project Successfully added", data: result })
        }
    })
})

var port = process.env.port || 3000;
http.listen(port, () => {
    console.log("App listening to http://localhost:" + port)
    createColllection("View")
})