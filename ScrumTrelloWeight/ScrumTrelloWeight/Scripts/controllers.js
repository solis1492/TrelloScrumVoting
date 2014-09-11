/**
 * Created by gadielortez on 8/20/14.
 */

angular.module('scrumApp').controller('ScrumCardsCtrl',function ($scope, cardHub) {

    $scope.isTrelloAdmin = true;

    $scope.cards = [{
        'name':'Mountain Goat',
        'values':[{
            'weight':'0'
        },{
            'weight':'1/2'
        },{
            'weight':'1'
        },{
            'weight':'2'
        },{
            'weight':'3'
        },{
            'weight':'5'
        },{
            'weight':'8'
        },{
            'weight':'13'
        },{
            'weight':'20'
        },{
            'weight':'40'
        },{
            'weight':'100'
        },{
            'weight':'?'
        },{
            'weight':'☕'
        }]
    },{
        'name':'Fibonacci',
        'values':[{
            'weight':'0'
        },{
            'weight':'1'
        },{
            'weight':'2'
        },{
            'weight':'3'
        },{
            'weight':'5'
        },{
            'weight':'8'
        },{
            'weight':'13'
        },{
            'weight':'21'
        },{
            'weight':'34'
        },{
            'weight':'55'
        },{
            'weight':'89'
        },{
            'weight':'?'
        }]
    },{
        'name':'Sequential',
        'values':[{
            'weight':'0'
        },{
            'weight':'1'
        },{
            'weight':'2'
        },{
            'weight':'3'
        },{
            'weight':'4'
        },{
            'weight':'5'
        },{
            'weight':'6'
        },{
            'weight':'7'
        },{
            'weight':'8'
        },{
            'weight':'9'
        },{
            'weight':'10'
        },{
            'weight':'?'
        }]
    },{
        'name':'Playing Cards',
        'values':[{
            'weight':'A♠'
        },{
            'weight':'2'
        },{
            'weight':'3'
        },{
            'weight':'5'
        },{
            'weight':'8'
        },{
            'weight':'♔'
        }]
    },{
        'name':'T-Shirt',
        'values':[{
            'weight':'XL'
        },{
            'weight':'L'
        },{
            'weight':'M'
        },{
            'weight':'S'
        },{
            'weight':'XS'
        },{
            'weight':'?'
        }]
    }];

    $scope.inRoom = false;
    $scope.imAdmin = true;
    $scope.voteNumber = 0;

    $scope.query = 'Mountain Goat';
    $scope.selectedCardPack = $scope.cards[0];

    $scope.selectedWeight = null;

    $scope.joinRoom = function() {
        cardHub.server.joinRoom($scope.roomName);
        $scope.inRoom = true;
    }

    $scope.setWeight = function(weight){
        $scope.selectedWeight = weight;
        cardHub.server.vote($scope.roomName, weight);
    };

    $scope.setCardPack = function (cardName) {
        $scope.query = cardName;
        cardHub.server.setCardFilter($scope.roomName,$scope.query);
    };

    $scope.placeHolders = function() {
        return Array($scope.voteNumber);
    };

    $scope.reset = function() {
        cardHub.server.reset($scope.roomName);
    };

    $scope.show = function () {
        cardHub.server.show($scope.roomName);
    };

    cardHub.client.identifyMe = function(isAdmin) {
        $scope.imAdmin = isAdmin;
        $scope.isTrelloAdmin = isAdmin;
    };

    cardHub.client.getCardFilter = function(query) {
        $scope.query = query;
        $scope.$apply();
    }

    cardHub.client.getPlaceHolders = function(ammount) {
        $scope.voteNumber = ammount;
        $scope.weightsVoted = [];
        $scope.$apply();
    };

    cardHub.client.getWeights = function (weights) {
        $scope.weightsVoted = weights;
        $scope.voteNumber = 0;
        $scope.$apply();
    }

});