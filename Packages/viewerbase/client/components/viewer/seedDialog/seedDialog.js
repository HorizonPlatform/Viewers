import { OHIF } from 'meteor/ohif:core';

var config = {
  getTextCallback : getTextCallback,
  changeTextCallback : changeTextCallback,
  drawHandles : false,
  drawHandlesOnHover : true,
  currentLetter: 'A',
  currentNumber: 0,
  showCoordinates: true,
  countUp: true
}

// Define a callback to get your text annotation
// This could be used, e.g. to open a modal
function getTextCallback(doneGetTextCallback) {
  
  if ( config.countUp ) {
    config.currentNumber++;
  } else {
    config.currentNumber--;
  }
  
  var text = config.currentLetter + config.currentNumber;
  doneGetTextCallback(text);
}

// Define a callback to edit your text annotation
// This could be used, e.g. to open a modal
function changeTextCallback(data, eventData, doneChangingTextCallback) {
  
  // TODO - CHECK IF TOOL IS AKTIVE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

  var relabelDialog = $('.relabelDialog');
  var getTextLetter = $('#relabelText');
  var getTextNumber = $('#relabelNumber');
  var confirm = relabelDialog.find('.relabelConfirm');
  var remove = relabelDialog.find('.relabelRemove');

  getTextLetter.val(data.annotationText);
  getTextNumber.val(data.annotationText);
  
  relabelDialog.get(0).showModal();

  confirm.off('click');
  confirm.on('click', function() {
    relabelDialog.get(0).close();
    doneChangingTextCallback(data, getTextLetter.val().toUpperCase() + getTextNumber.val());    
  });

  // If the remove button is clicked, delete this marker
  remove.off('click');
  remove.on('click', function() {
    relabelDialog.get(0).close();
    doneChangingTextCallback(data, undefined, true);
  });

  relabelDialog.off("keydown");
  relabelDialog.on('keydown', keyPressHandler);

  function keyPressHandler(e) {
    // If Enter is pressed, close the dialog
    if (e.which === 13) {
      closeHandler();
    }
  }

  function closeHandler() {
    relabelDialog.get(0).close();
    doneChangingTextCallback(data, getTextLetter.val().toUpperCase() + getTextNumber.val());
    // Reset the text value
    getTextLetter.val("");
    getTextNumber.val("");
  }
}

Template.seedDialog.events({
  'click #seedClearAll': function() {
    // Clear all seed points
    const element = getActiveViewportElement();
    var enabledElement = cornerstone.getEnabledElement(element);
    var imageId = enabledElement.image.imageId;
    
    // Find all measurements for this image
    var allMeasurements = ImageMeasurements.find({imageId: imageId}).fetch();
    for (var i=0; i<allMeasurements.length; i++){
      ImageMeasurements.remove(allMeasurements[i]._id);
    }
    
    const toolStateManager = cornerstoneTools.globalImageIdSpecificToolStateManager;
    toolStateManager.clear(element);
    cornerstone.updateImage(element);
    // Reset the initial values for naming
    config.currentLetter = $('#f-letter').val();
    if (config.countUp == true ) { 
      config.currentNumber = parseInt($('#f-number').val()) - 1;
    } else {
      config.currentNumber = parseInt($('#f-number').val()) + 1;
    }
  },
  'click #check-coords': function() {
    const element = getActiveViewportElement();
    config.showCoordinates = document.getElementById('check-coords').checked;
    cornerstone.updateImage(element);
  },
  'click #check-countUp': function() {
    const element = getActiveViewportElement();
    config.countUp = document.getElementById('check-countUp').checked;
    cornerstone.updateImage(element);
  },
  'input #f-letter': function() {
    config.currentLetter = $('#f-letter').val().toUpperCase();
    //console.log("Change letter");
  },
  'input #f-number': function() {
    if (config.countUp == true ) { 
      config.currentNumber = parseInt($('#f-number').val()) - 1;
    } else {
      config.currentNumber = parseInt($('#f-number').val()) + 1;
    }
  }
});

Template.seedDialog.onRendered(function(mouseEventData) {
  const instance = Template.instance();
  const dialog = instance.$('#seedDialog');
  dialog.draggable();
  
  cornerstoneTools.seedAnnotate.setConfiguration(config);
});
