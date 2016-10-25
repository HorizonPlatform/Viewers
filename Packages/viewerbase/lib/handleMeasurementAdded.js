handleMeasurementAdded = function(e, eventData) {

  var measurementData = eventData.measurementData;
  
  switch (measurementData.toolType) {
    case 'seedAnnotate':
      var enabledElement = cornerstone.getEnabledElement(eventData.element);
      var imageId = enabledElement.image.imageId;

      // Get the studyInstanceUid and series metaData
      var study = cornerstoneTools.metaData.get('study', imageId);
      var series = cornerstoneTools.metaData.get('series', imageId);

      // Add the relevant metaData to this ImageMeasurement's toolData
      measurementData.clientId = ClientId;
      measurementData.imageId = imageId;
      measurementData.toolType = eventData.toolType;
      measurementData.patientId = study.patientId;
      measurementData.studyInstanceUid = study.studyInstanceUid;
      measurementData.seriesInstanceUid = series.seriesInstanceUid;
      
      measurementData._id = ImageMeasurements.insert(measurementData);
      break;
  }

};
