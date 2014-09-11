var onAuthorize = function() {
    updateLoggedIn();
    $("#output").empty();

    Trello.members.get("me", function(member) {
        $("#fullName").text(member.fullName);

        var $cards = $("<div>")
            .text("Loading Cards...")
            .appendTo("#output");

        $cards.empty();
        Trello.get("members/me/boards/", function(cards) {
            $("<div>").text("Boards").appendTo($cards);

            $.each(cards, function(ix, card) {
                $("<div>")
                    .addClass("card")
                    .text(card.name)
                    .appendTo($cards)
                    .click(function() {
                        $cards.empty();
                        Trello.get("boards/" + card.id + "/lists/", function(cards) {
                            $("<div>").text("Lists").appendTo($cards);

                            $.each(cards, function(ix, card) {
                                $("<div>")
                                    .addClass("card")
                                    .text(card.name)
                                    .appendTo($cards)
                                    .click(function() {
                                        $cards.empty();
                                        Trello.get("lists/" + card.id + "/cards/", function(cards) {
                                            $("<div>").text("Cards").appendTo($cards);

                                            $.each(cards, function(ix, card) {
                                                $("<div>").addClass("card").text(card.name).appendTo($cards)
                                                .click(function () {
                                                    alert("a");
                                                    angular.element($('#CardController')).scope().roomName = card.id;
                                                    angular.element($('#CardController')).scope().joinRoom();
                                                   
                                                });
                                            });
                                        });
                                    });
                            });
                        });
                    });
            });
        });
    });
};


var updateLoggedIn = function () {
    var isLoggedIn = Trello.authorized();
    $("#loggedout").toggle(!isLoggedIn);
    $("#loggedin").toggle(isLoggedIn);
};

var logout = function () {
    Trello.deauthorize();
    updateLoggedIn();
};

Trello.authorize({
    interactive: false,
    success: onAuthorize
});

$("#connectLink")
.click(function () {
    Trello.authorize({
        type: "popup",
        success: onAuthorize,
        scope: { write: true, read: true }
    })
});

$("#disconnect").click(logout);