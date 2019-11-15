require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());


app.use(express.static('dist'));
app.use(express.static('assets'));
app.use(express.static('static'));



app.get('/mapbox_token', (req, res) => {
  return res.send(process.env.MAPBOX_TOKEN)
});


// Listen for HTTP requests on port 3000
app.listen(port, () => {
	console.log('listening on %d', port);
});