(function ($) {
  var myNewTaskForm = $('#makecomment-form');
  var newNameInput = $('#comment');
  var todoArea = $('#allComments');

  myNewTaskForm.submit(function (event) {
    event.preventDefault();

    var newName = newNameInput.val();

    if (newName) {
        var requestConfig = {
          method: 'POST',
          url: myNewTaskForm[0].action,
          contentType: 'application/json',
          data: JSON.stringify({
            comment: newName
          })
        };

        $.ajax(requestConfig).then(function (responseMessage) {
          console.log(responseMessage);
          var newElement = $(responseMessage);
          todoArea.append(newElement);
        });
      
    }
  });
})(jQuery);
