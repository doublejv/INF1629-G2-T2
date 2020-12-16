const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const { spawn } = require('child_process');

const app = express();

app.use(fileUpload({
  createParentPath: true
}));
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));

app.post('/execute', (req, res) => {
  try {
    if(!req.files) {
      console.log('no file')
      res.send({
        status: false,
        message: 'No file uploaded'
      });
      return
    }
    
    let termFile = req.files.termFile;
    termFile.mv(`../term_words.txt`);
    let blackListFile = req.files.blackListFile;
    blackListFile.mv('../stop_words.txt');
  
    var pythonResult;
    
    const python = spawn('python', ['term-frequency.py', `../term_words.txt`]);
    
    python.stdout.on('data', function (data) {
      console.log('Pipe data from python script ...');
      pythonResult = data.toString();
    });

    python.on('close', code => {
      if (code !== 0) {
        res.status(500).send('Could not execute python script.');
        return
      }

      res.send(pythonResult);
    });
  } catch (err) {
    console.log(err)
    res.status(500).send(err);
  }
})

const port = 8000
app.listen(port, () => {
  console.log(`App running on http://localhost:${port}`)
})
