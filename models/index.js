var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/tripplanner');
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));

var Place, Hotel,ThingsToDo,Restaurant;
var Schema = mongoose.Schema;

var placeSchema = new Schema({
  address: String,
  city: String,
  state: String,
  phone: String,
  location: [Number, Number]
});
var hotelSchema = new Schema({
  name: String,
  place: [placeSchema],
  num_stars: Number,
  amenities: String
});
var thingToDoSchema = new Schema({
  name: String,
  place: [placeSchema],
  age_range: String
});
var restaurantSchema = new Schema({
  name: String,
  place: [placeSchema],
  cuisine: String,
  price: {type: Number,max: 5,min:1}
});

Place = mongoose.model('Place', placeSchema);
Hotel = mongoose.model('Hotel', hotelSchema);
ThingsToDo = mongoose.model('ThingsToDo',thingToDoSchema);
Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = {'Place': Place,
                  'Hotel':Hotel,
                  'ThingsToDo':ThingsToDo,
                  'Restaurant': Restaurant
                  };
