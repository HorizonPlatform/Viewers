import { OHIF } from 'meteor/ohif:core';

OHIF.viewer = OHIF.viewer || {};
OHIF.viewer.loadIndicatorDelay = 500;
OHIF.viewer.defaultTool = 'wwwc';
OHIF.viewer.refLinesEnabled = true;

OHIF.viewer.cine = {
    framesPerSecond: 24,
    loop: true
};

OHIF.viewer.functionList = {
    toggleCineDialog: toggleCineDialog,
    toggleCinePlay: toggleCinePlay,
    clearTools: clearTools,
    resetViewport: resetViewport,
    invert: invert
};

Session.setDefault('activeViewport', false);
Session.setDefault('leftSidebar', false);
Session.setDefault('rightSidebar', false);

Template.viewer.onCreated(() => {
  const instance = Template.instance();

  instance.data.state = new ReactiveDict();
  instance.data.state.set('leftSidebar', Session.get('leftSidebar'));
  instance.data.state.set('rightSidebar', Session.get('rightSidebar'));

  instance.subscribe('hangingprotocols');

  const contentId = instance.data.contentId;

  if (ViewerData[contentId] && ViewerData[contentId].loadedSeriesData) {
      log.info('Reloading previous loadedSeriesData');
      OHIF.viewer.loadedSeriesData = ViewerData[contentId].loadedSeriesData;
  } else {
      log.info('Setting default ViewerData');
      OHIF.viewer.loadedSeriesData = {};
      ViewerData[contentId] = {};
      ViewerData[contentId].loadedSeriesData = OHIF.viewer.loadedSeriesData;

      // Update the viewer data object
      ViewerData[contentId].viewportColumns = 1;
      ViewerData[contentId].viewportRows = 1;
      ViewerData[contentId].activeViewport = 0;
  }

  Session.set('activeViewport', ViewerData[contentId].activeViewport || 0);

  // Update the ViewerStudies collection with the loaded studies
  ViewerStudies.remove({});

  ViewerData[contentId].studyInstanceUids = [];
  instance.data.studies.forEach(study => {
      study.selected = true;
      study.displaySets = createStacks(study);
      ViewerStudies.insert(study);
      ViewerData[contentId].studyInstanceUids.push(study.studyInstanceUid);
  });

  Session.set('ViewerData', ViewerData);
  
  const patientId = instance.data.studies[0].patientId;
  Session.set('patientId', patientId);
    
  instance.autorun(() => {
    const dataContext = Template.currentData();
    instance.subscribe('singlePatientImageMeasurements', dataContext.studies[0].patientId);
    
    if (instance.subscriptionsReady()) {
      ImageMeasurements.find().observe({
        added: data => {
          if (data.clientId === ClientId) {
            return;
          }

          syncImageMeasurementAndToolData(data);

          // Update each displayed viewport
          updateAllViewports();
        },
        changed: data => {
          if (data.clientId === ClientId) {
            return;
          }

          syncImageMeasurementAndToolData(data);

          // Update each displayed viewport
          updateAllViewports();
        },
        removed: data => {
          if (data.clientId === ClientId) {
            return;
          }

          removeToolDataWithMeasurementId(data.imageId, data.toolType, data.id);

          // Update each displayed viewport
          updateAllViewports();
        }
      });
    }
  });
});

Template.viewer.events({
  'click .js-toggle-studies'() {
    const instance = Template.instance();
    const current = instance.data.state.get('leftSidebar');
    instance.data.state.set('leftSidebar', !current);
  },
  'click .js-toggle-protocol-editor'() {
    const instance = Template.instance();
    const current = instance.data.state.get('rightSidebar');
    instance.data.state.set('rightSidebar', !current);
  },
  
  'CornerstoneToolsMeasurementAdded .imageViewerViewport'(event, instance, eventData) {
    handleMeasurementAdded(event, eventData);
  },
  'CornerstoneToolsMeasurementModified .imageViewerViewport'(event, instance, eventData) {
    handleMeasurementModified(event, eventData);
  },
  'CornerstoneToolsMeasurementRemoved .imageViewerViewport'(event, instance, eventData) {
    handleMeasurementRemoved(event, eventData);
  }
});
