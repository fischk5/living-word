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

appModule.config(function($sceDelegateProvider) {
  $sceDelegateProvider.resourceUrlWhitelist([
    'self',
    // Allow loading from labs.bible.org/api
    'http://labs.bible.org/api/?**'
  ]);
});




/*  SETUP ANGULAR FACTORY */
appModule.factory('dataFactory', ['$http', function($http) {

  // Used for data verification
  let bibleBooks = [
    'Genesis','Exodus','Leviticus','Numbers','Deuteronomy','Joshua','Judges','Ruth','1 Samuel','2 Samuel','1 Kings',
    '2 Kings','1 Chronicles','2 Chronicles','Ezra','Nehemiah','Esther','Job','Psalm','Proverbs','Ecclesiastes','Song of Solomon',
    'Isaiah','Jeremiah','Lamentations','Ezekiel','Daniel','Hosea','Joel','Amos','Obadiah','Jonah','Micah','Nahum',
    'Habakkuk','Zephaniah','Haggai','Zechariah','Malachi','Matthew','Mark','Luke','John','Acts','Romans','1 Corinthians','2 Corinthians',
    'Galatians','Ephesians','Philippians','Colossians','1 Thessalonians','2 Thessalonians','1 Timothy','2 Timothy','Titus',
    'Philemon','Hebrews','James','1 Peter','2 Peter','1 John','2 John','3 John','Jude','Revelation'
  ];

  // This is the bible verse object that will be updated
  // and read from for display
  let bibleDisplay = {
    'reference' : 'John: 3:16',
    'content' : 'For God so loved the world that He gave His only Son...',
    'search' : 'none',
    'validVerse' : ''
  };

  // Store all bible objects in here previously retrieved from AJAX
  // Objects included have a .reference and a .content
  let bibleVerseStorage = [
    {
    reference : "John 3:16",
    content: "For this is the way God loved the world: He gave his one and only Son, so that everyone who believes in him will not perish but have eternal life."
    }
  ];

  // Object to be returned after factory is called
  let dataFactory = {};


  dataFactory.updateVerse = function(passageSearchString) {
    // This fires anytime the search bar changes
    // 1. Validate the search string to see if valid verse
    // 2. Check storage to see if the information exists locally
    // 3. GET remaining information via AJAX call to API if needed
    // 4. Update the bibleDisplay object with information
    // Do not make an AJAX if there is not a valid verse

    /*
    //////////////////////////
    -1.  SEARCH VERIFICATION-
    /////////////////////////
    */

    // Valid verses are stored in the following variable
    let validVerses = [];

    // Take the search term and pull out all applicable verses
    let validateVerse = function(string) {
      let colonIndex = -1;
      let searchTerms = []; // used if there are multiple verses separated by ;
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
            // TODO: verify the book is a book of the bible
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
                    // TODO: Add function to parse the book name and verse reference out
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

    if (passageSearchString) {
      validateVerse(passageSearchString);
    }



    /*
    //////////////////////////
    -2.  CHECK LOCAL STORAGE FOR INFORMATION-
    /////////////////////////
    */

    // Stage the display verses in array
    let stagedReferences = [];
    let stagedContent = [];

    // Remove existing verses from this to leave only verse that need
    // an AJAX call
    let verseToRetrieveAjax = validVerses;

    for (var m=0; m < validVerses.length; m++) {
      let vers = validVerses[m];
      console.log(vers);
      for (var j=0; j < bibleVerseStorage.length; j++) {
        if (bibleVerseStorage[j].reference == vers) { // if the storage reference name matches the verse
          stagedReferences.push(bibleVerseStorage[j].reference); // push the existing reference
          stagedContent.push(bibleVerseStorage[j].content); // push the existing content
          verseToRetrieveAjax.splice(verseToRetrieveAjax.indexOf(vers),1); // remove that verse - does not need retrieving
          console.log('Staged References: ' + stagedReferences);
        }
      }
    }


    /*
    /////////////////////////////////
    -3.  AJAX CALL TO LABS.BIBLE.ORG API-
    ////////////////////////////////
    */

    let updateUi = function() {
      // Update the bibleDisplay with the staged information
      let referenceString = "";
      let contentString = "";
      for (var y=0; y < stagedReferences.length; y++) {
        referenceString += " " + stagedReferences[y]
      };
      for (var h=0; h < stagedContent.length; h++) {
        contentString += " " + stagedContent[h];
      };
      if (!referenceString == "") {
        bibleDisplay.reference = referenceString;
      }
      if (!contentString == "") {
        bibleDisplay.content = contentString;
      }
      stagedReferences = [];
      stagedContent = [];
    }

    //
    // Now only the verses in verseToRetrieveAjax need AJAX calls
    // If successful, will store the results in the bibleVersesStorage
    // with two properties: reference & content

    // This function will call the API for any verses in verseToRetrieveAjax
    let makeAjaxCalls = function() {
      // Base url for the labs.bible.org API call
      let urlBase = 'http://labs.bible.org/api/?passage=';
      let urlTail = '&formatting=plain&type=json';
      // loop through the versesToRetrieve and build a URL
      if (verseToRetrieveAjax.length) {
        console.log('Initiating AJAX call.');
        for (var p = verseToRetrieveAjax.length; p >=0; p--) {
          let verseToRetrieve = verseToRetrieveAjax[p];
          let url = urlBase + verseToRetrieve + urlTail;
          console.log('Built url = ' + url);

          // Actual AJAX call
          $http.jsonp(url, {jsonpCallbackParam: 'callback'}).then(function(data) {
            let dRef = data.data[0].bookname + " " + data.data[0].chapter + ':' + data.data[0].verse;
            console.log('Reference is ' + dRef);
            let dContent = data.data[0].text;
            console.log('Content is ' + dContent);

            // TODO: Error handling!

            // TODO: format the content to remove the <> tags

            // Add this information to the staged data
            stagedReferences.push(dRef);
            stagedContent.push(dContent);

            // Add this information to the bibleVerseStorage
            bibleVerseStorage.push({reference : dRef, content: dContent });

            // Now that information is received, remove verse this from the verseToRetrieveAjax
            verseToRetrieveAjax.splice(verseToRetrieveAjax.indexOf(verseToRetrieve));
            /* END FOR LOOP */
            if (!verseToRetrieveAjax.length) {
              updateUi();
            }
          });
        }
      } else {
        updateUi();
      }
    }

    /*
    /////////////////////////////////
    -4.  UPDATE THE DISPLAY
    ////////////////////////////////
    */

    //
    // If there are no verses in versesToRetrieve, push the staged data
    // to the scope for display
    makeAjaxCalls();


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
