/*
//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////

Written by Kevin Fischer

Built using jQuery & AngularJS

Version 1.0

Questions?  Contact me:
email:    fischk5@hotmail.com
github:   fischk5

//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////
*/

/*  SETUP ANGULAR MODULE */

// initialize the module with no dependencies
let appModule = angular.module('application', []);

/*  SETUP ANGULAR FACTORY */
appModule.factory('dataFactory', ['$http', function($http) {

  // Base url for the labs.bible.org API call
  let urlBase = 'http://labs.bible.org/api/?';

  // Object to be returned after factory is called
  let dataFactory = {};

  // Setup the GET request $http call
  dataFactory.getVerse = function(passageSearchString) {
    let finalUrl = "";
    // need to parse the passage search string and make a GET call
    return $http.get(finalUrl);
  }

  // Return the dataFactory object
  return dataFactory;
}])

/*  SETUP ANGULAR MAIN CONTROLLER */
appModule.controller('MainController', ['$scope', 'dataFactory',
  function($scope, dataFactory) {

    // Use the factory to retrieve a passage.  The passage retrieved
    // is based on the search string in the input
    function getVerse() {
      let passageInput = $scope.passageInput;
      dataFactory.getVerse(passageInput)
      .then(function(response) {
        // Do something with the response
        // like update the $scope
      }, function(error) {
        // Do something with the error
        // like maintain certain ui
      });
    }


  }
]);


/*  ESTABLISH UI FUNCTIONALITY  */
// The "Search the Bible" link should display a search bar
// on hover, but this needs to stay visible until the user
// is away from it for a certain number of seconds

// Setup a browser listener to add the visible class to
// the class "dropdown-content" upon hovering over searchNavigationDropdown
// document.getElementById('nav-search').addEventListener('mouseover', function (event) {
//   // Select the dropdown-content class that should become visible
//   $('.dropdown-content').addClass('isVisible');
// })
