var createError = require('http-errors');
var express = require('express');
var path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

var indexRouter = require('./routes/index');

var app = express();

// Všechny media
let all_media = [];

app.use(cors());

// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


//Všechny media
app.get('/api/v1/media', async (req,res)=> {
  return res.json(all_media);
});

//Media podle GUID
app.get('/api/v1/media/:guid', async (req,res)=> {
  const guid = req.params.guid;
  for (let media of all_media) {
    if (media.guid === guid) {
      res.json(media);
      return;
    }
  }
  // Error
  res.status(404).send('Media record was not found');
});

//Vložení Media
app.post('/api/v1/media', async (req,res)=> {
  const media = req.body;
  all_media.push(media);

  res.send('Media Added');
});

//Uprava Media
app.put('/api/v1/media/:guid', async (req,res)=> {

  const guid = req.params.guid;
  const newMedia = req.body;

for (let i = 0; i < all_media.length; i++) {
  let media = all_media[i]
  if (media.guid === guid) {
    all_media[i] = newMedia;
  }else{
    res.status(404).send('Media record was not found');
  }
}
  res.send('Media is edited');
});

//Odstraneni media podle GUID
app.delete('/api/v1/media/:guid', async (req,res)=> {

  const guid = req.params.guid;

  all_media = all_media.filter(i => {
    if (i.guid !== guid) {
      return true;
    }
    res.status(404).send('Media record was not found');
    return false;
  });

  res.send('Media is deleted');
});
/*
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

*/
module.exports = app;
