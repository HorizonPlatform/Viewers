Meteor.methods({
  removeImageMeasurementsByPatientId: function(patientId) {
    ImageMeasurements.remove({
      patientId: patientId
    });
  }
});
