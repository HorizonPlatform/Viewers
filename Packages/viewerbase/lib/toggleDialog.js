toggleDialog = element => {
    const $element = $(element);
    const isClosed = $element.hasClass('dialog-open');
    $element.toggleClass('dialog-closed', isClosed);
    $element.toggleClass('dialog-open', !isClosed);
};

showDialog = function(element) {
  var elem = $(element);
  if (elem.css('display') === 'none') {
    elem.css('display', 'block');
  }
};

hideDialog = function(element) {
  var elem = $(element);
  if (elem.css('display') !== 'none') {
    elem.css('display', 'none');
  }
};