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
    'search' : 'none',
    'validVerse' : ''
  };

  // Base url for the labs.bible.org API call
  let urlBase = 'http://labs.bible.org/api/?';
  // Object to be returned after factory is called
  let dataFactory = {};

  // Setup the GET request $http call
  dataFactory.updateVerse = function(passageSearchString) {
    // Do not make an AJAX if there is not a valid verse
    // The last valid verse used for AJAX is stored in bibleDisplay.validVerse

    /*
    ////////////////////
    -SEARCH VERIFICATION-
    ///////////////////
    */

    // Valid verses are stored in the following variable
    let validVerses = [];

    // Take the search term and pull out all applicable verses
    let validateVerse = function(string) {
      let colonIndex = -1;
      let searchTerms = [];
      let searchString = string.trim();
      // Check if there exists a semicolon separating the verses
      if (searchString.includes(';')) {
        var splitSearch = searchString.split(';');
        for (var i=0; i < splitSearch.length; i++) {
          searchTerms.push(splitSearch[i]);
        }
      } else {
        searchTerms.push(searchString);
      };

      for (var n=0; n < searchTerms.length; n++) {
        var search = searchTerms[n];
        search = search.trim();
        // 1. Verify the search term is at least 4 characters
        if (search.length >= 4) {
          // 2. Verify the there is a colon in the search pattern
          if (search.includes(':')) {
            let passageSplit = search.split(':')
            colonIndex = search.indexOf(':');
            // 3. Verify the there is only one colon
            if (passageSplit.length == 2) {
              // 4. Verify there is a space somewhere before the colon
              if (passageSplit[0].includes(" ") || passageSplit[0].includes("  ")) {
                // 5. Verify there is a number before the colon
                if (parseInt(search[colonIndex - 1])) {
                  // 6. Verify there is a number after the colon
                  if(parseInt(search[colonIndex + 1])) {
                    // The verse passes!
                    // The entry contains at least one valid entry
                    validVerses.push(search);
                    console.log('Added verse - ' + search);
                  }
                }
              }
            }
          }
        }
      }
    }

    /*
    /////////////////////////
    -END SEARCH VERIFICATION-
    ////////////////////////
    */

    //bibleDisplay.search = passageSearchString;
  };

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

    // Setting up the watch service to run update verse
    // anytime the input changes
    $scope.$watch('passageInput', function() {
      $scope.updateVerse();
    })

    $scope.updateVerse = function() {
      //let searchInput = $scope.passageInput;
      dataFactory.updateVerse($scope.passageInput);
    }

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
