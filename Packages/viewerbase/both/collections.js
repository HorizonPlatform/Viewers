import { Mongo } from 'meteor/mongo';

ImageMeasurements = new Mongo.Collection('imageMeasurements');

ImageMeasurements.allow({
  insert: function() {
      return true;
  },
  update: function() {
      return true;
  },
  remove: function(){
    return true;
  }
});