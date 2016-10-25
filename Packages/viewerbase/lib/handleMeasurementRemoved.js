handleMeasurementRemoved = function(e, eventData) {
  var measurementData = eventData.measurementData;
  
  switch (eventData.toolType) {
    case 'seedAnnotate':
      log.info('CornerstoneToolsMeasurementRemoved');
      ImageMeasurements.remove(measurementData._id);
      break;
  }
};
