const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

//allow cross-origin requests
app.use(cors());

mongoose.connect("mongodb://localhost:27017/graphReact", { useNewUrlParser: true } );
mongoose.connection.once('open', () => {
    console.log('connected to database');
});


app.use('/graphql', graphqlHTTP({  // handle any graphql request  (running : http://localhost:4000/graphql) before u right any other code you will get an error telling you that you mus have a schema
    schema: schema,
    graphiql: true  // we put localhost:4000/graphql? in the browser we should look at the graphiql tool
}));

app.listen(4000, () => {
    console.log('now listening for requests on port 4000');
});