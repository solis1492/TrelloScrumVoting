(function () {
    angular.module('scrumApp', []);

    $(function () {
        $.connection.hub.logging = true;
        $.connection.hub.start();
    });

    $.connection.hub.error(function (err) {
        console.log('An error occurred: ' + err);
    });

    angular.module('scrumApp').value('cardHub', $.connection.cardHub);
})();