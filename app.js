var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require('body-parser');
const Joi = require('joi');

var indexRouter = require('./routes/index');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);


// Všechny media
let all_media = [];

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

  //Kontrola schematu + error
  const { error } = validateMedia(req.body); // result.error
  if (error != null) {
    res.send(error.details).sendStatus(400);
    console.log("Nedodrzeni sablony")
    return;
  }

  const media = {
    guid: req.body.guid,
    title: req.body.title,
    type: req.body.type,
    kind: req.body.kind,
    number_of_discs: req.body.number_of_discs,
    release_year: req.body.release_year
  };
  all_media.push(media);
  res.send(media);
});

//Uprava Media
app.put('/api/v1/media/:guid', async (req,res)=> {
  //Validace
  const media = all_media.find(c => c.guid === req.params.guid);
  if(!media) res.status(404).send("Media record was not found")



  //Kontrola schematu + error
  const { error } = validateMedia(req.body); // result.error
  if (error != null) {
    res.send(error.details).sendStatus(400);
    console.log("Nedodrzeni sablony")
    return;
  }

  //Update
  media.title = req.body.title;
  media.type = req.body.type;
  media.kind = req.body.kind;
  media.number_of_discs = req.body.number_of_discs;
  media.release_year = req.body.release_year;
  res.send(media);

  /*
   const guid = req.params.guid;
    const newMedia = req.body;

  for (let i = 0; i < all_media.length; i++) {
    let media = all_media[i]
    if (media.guid === guid) {
      all_media[i] = newMedia;
    }else{
      res.status(404).send('Media record was not found');
    }
  }*/
});

function validateMedia(media){
  const schema = {
    title:Joi.string().required(),
    type:Joi.string().required(),
    kind:Joi.string().required(),
    number_of_discs:Joi.integer,
    release_year:Joi.integer,
  }
  return Joi.validate(media, schema);
}

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

module.exports = app;
