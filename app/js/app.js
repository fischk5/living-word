/*
//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////

Written by Kevin Fischer

Built using jQuery & AngularJS

Version 1.0

Questions?  Comments?
Contact me:
email:    fischk5@hotmail.com
github handle:   fischk5

//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////
*/

/*  SETUP ANGULAR MODULE */

// initialize the module with no dependencies
let appModule = angular.module('application', ['ngRoute']);




/*  SETUP ANGULAR FACTORY */
appModule.factory('dataFactory', ['$http', function($http) {

  // This is the bible verse object that will be updated
  // and read from for display
  let bibleDisplay = {
    'reference' : 'John: 3:16',
    'content' : 'For God so loved the world that He gave His only Son...',
    'search' : 'none'
  };

  // Base url for the labs.bible.org API call
  let urlBase = 'http://labs.bible.org/api/?';
  // Object to be returned after factory is called
  let dataFactory = {};

  // Setup the GET request $http call
  dataFactory.updateVerse = function(passageSearchString) {
    let finalUrl = "";
    bibleDisplay.reference = passageSearchString;
  }

  // Simple return of the object
  dataFactory.getVerse = function() {
    return bibleDisplay;
  }

  // Return the dataFactory object
  return dataFactory;
}])




/*  SETUP ANGULAR MAIN CONTROLLER */
appModule.controller('SearchController', ['$scope', 'dataFactory',
  function($scope, dataFactory) {

    $scope.bibleDisplay = dataFactory.getVerse();

    $scope.updateVerse = function() {
      let searchInput = $scope.passageInput;
      dataFactory.updateVerse(searchInput);
    }

    // Use the factory to retrieve a passage.  The passage retrieved
    // is based on the search string in the input
    // function getVerse() {
    //   let passageInput = $scope.passageInput;
    //   $scope.bibleDisplay = dataFactory.getVerse(passageInput);
    //   $scope.reference = data.passageReference;
    //   $scope.content = data.passageContent;
    // }


  }
]);

/*  SETUP ANGULAR ROUTING */
appModule.config(function($routeProvider,$locationProvider) {
  $locationProvider.hashPrefix('');
  $routeProvider
  .when("/", {
    controller: 'SearchController',
    templateUrl: 'partials/display-verse.html'
  })
  .when("/view2", {
    controller: 'SearchController',
    templateUrl: 'partials/view2.html'
  })
  .otherwise({redirectTo: "/"});
})
