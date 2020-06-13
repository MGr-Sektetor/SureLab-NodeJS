var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require('body-parser');
const Joi = require('@hapi/joi');

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
let all_media = [{
  "guid":"458676886786-asfa878646566586",
  "title":"Penis",
  "type":"kokot",
  "kind":"curak",
  "number_of_discs":2020,
  "release_year":2019
},{
  "guid":"458676886786-asfa8786465665aafa86",
  "title":"test",
  "type":"test",
  "kind":"test",
  "number_of_discs":2010,
  "release_year":2009
},];

// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Všechny media
app.get('/api/v1/media', async (req,res)=> {
  return res.json(all_media);
});

//Media podle GUID
app.get('/api/v1/media/:guid', async (req,res)=> {
  const media = all_media.find(c => c.guid === req.params.guid);
  if(!media) return res.status(404).send("Media record was not found");
  res.send(media)

});

//Vložení Media
app.post('/api/v1/media', async(req,res)=> {

  //Kontrola schematu
  const schema = Joi.object({
    guid:Joi.string().required(),
    title:Joi.string().required(),
    type:Joi.string().required(),
    kind:Joi.string().required(),
    number_of_discs:Joi.number().integer(),
    release_year:Joi.number().integer().min(1900),
  }).required();

//Validace
  const result = schema.validate(req.body)
  //if (result.error != null) {
  //Vlozeni
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
  /*}else{
    console.log(result.error.details);
    res.send(result.error.details).sendStatus(400);
    console.log("Nedodrzeni sablony")
    return;
  }*/


});

//Uprava Media
app.put('/api/v1/media/:guid', async (req,res)=> {
  //Validace
  const media = all_media.find(c => c.guid === req.params.guid);
  if(!media) return res.status(404).send("Media record was not found");

    //Kontrola schematu
  const schema = Joi.object({
    guid:Joi.string().required(),
    title:Joi.string().required(),
    type:Joi.string().required(),
    kind:Joi.string().required(),
    number_of_discs:Joi.number().integer(),
    release_year:Joi.number().integer().min(1900),
  }).required();

    //Update
  const result = schema.validate(req.body)
  if (result.error != null) {
    media.title = req.body.title;
    media.type = req.body.type;
    media.kind = req.body.kind;
    media.number_of_discs = req.body.number_of_discs;
    media.release_year = req.body.release_year;
    res.send(media);
  }else{
    console.log(result.error);
   return res.send(result.error.details).sendStatus(400);
  }

});



//Odstraneni media podle GUID
app.delete('/api/v1/media/:guid', async (req,res)=> {

  const media = all_media.find(c => c.guid === req.params.guid);
  if(!media)  return res.status(404).send("Media record was not found");

  const index = all_media.indexOf(media);
  all_media.splice(index, 1);
  res.send(media);

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
 // res.render('error');
});



module.exports = app;
