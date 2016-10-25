import { Meteor } from 'meteor/meteor';

//Meteor.publish('seeds', () => {
//  return Measurements.find();
//});


Meteor.publish('singlePatientImageMeasurements', function(patientId) {
  return ImageMeasurements.find({
    patientId: patientId
  });
});

//Meteor.publish('singleImageMeasurements', function(imageId) {
//  return ImageMeasurements.find({
//    imageId: imageId
//  });
//});

/*
// Temporary fix to drop all Collections on server restart
// http://stackoverflow.com/questions/23891631/meteor-how-can-i-drop-all-mongo-collections-and-clear-all-data-on-startup
Meteor.startup(function() {
    for (var property in global) {
        var object = global[property];
        if (object instanceof Meteor.Collection) {
            object.remove({});
        }
    }
});
*/