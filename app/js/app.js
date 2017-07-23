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
  var bibleBooks = [
    {'book' : 'Genesis', 'chapters' : 50}, {'book' : 'Exodus', 'chapters' : 40}, {'book' : 'Leviticus', 'chapters' : 27}, {'book' : 'Numbers', 'chapters' : 36},
    {'book' : 'Deuteronomy', 'chapters' : 34}, {'book' : 'Joshua', 'chapters' : 24}, {'book' : 'Judges', 'chapters' : 21}, {'book' : 'Ruth', 'chapters' : 4},
    {'book' : '1 Samuel', 'chapters' : 31},{'book' : '2 Samuel', 'chapters' : 24},{'book' : '1 Kings', 'chapters' : 22},{'book' : '2 Kings', 'chapters' : 25},
    {'book' : '1 Chronicles', 'chapters' : 29},{'book' : '2 Chronicles', 'chapters' : 36},{'book' : 'Ezra', 'chapters' : 10},{'book' : 'Nehemiah', 'chapters' : 13},
    {'book' : 'Esther', 'chapters' : 10},{'book' : 'Job', 'chapters' : 42},{'book' : 'Psalms', 'chapters' : 150},{'book' : 'Proverbs', 'chapters' : 31},
    {'book' : 'Ecclesiastes', 'chapters' : 12},{'book' : 'Song of Solomon', 'chapters' : 8},{'book' : 'Isaiah', 'chapters' : 66},{'book' : 'Jeremiah', 'chapters' : 52},
    {'book' : 'Lamentations', 'chapters' : 5},{'book' : 'Ezekiel', 'chapters' : 48},{'book' : 'Daniel', 'chapters' : 12},{'book' : 'Hosea', 'chapters' : 14},
    {'book' : 'Joel', 'chapters' : 3},{'book' : 'Amos', 'chapters' : 9},{'book' : 'Obadiah', 'chapters' : 1},{'book' : 'Jonah', 'chapters' : 4},
    {'book' : 'Micah', 'chapters' : 7},{'book' : 'Nahum', 'chapters' : 3},{'book' : 'Habakkuk', 'chapters' : 3},{'book' : 'Zephaniah', 'chapters' : 3},
    {'book' : 'Haggai', 'chapters' : 2},{'book' : 'Zechariah', 'chapters' : 14},{'book' : 'Malachi', 'chapters' : 4},{'book' : 'Matthew', 'chapters' : 28},
    {'book' : 'Mark', 'chapters' : 16},{'book' : 'Luke', 'chapters' : 24},{'book' : 'John', 'chapters' : 21},{'book' : 'Acts', 'chapters' : 28},
    {'book' : 'Romans', 'chapters' : 16},{'book' : '1 Corinthians', 'chapters' : 16},{'book' : '2 Corinthians', 'chapters' : 13},{'book' : 'Galatians', 'chapters' : 6},
    {'book' : 'Ephesians', 'chapters' : 6},{'book' : 'Philippians', 'chapters' : 4},{'book' : 'Colossians', 'chapters' : 4},{'book' : '1 Thessalonians', 'chapters' : 5},
    {'book' : '2 Thessalonians', 'chapters' : 3},{'book' : '1 Timothy', 'chapters' : 6},{'book' : '2 Timothy', 'chapters' : 4},{'book' : 'Titus', 'chapters' : 3},
    {'book' : 'Philemon', 'chapters' : 1},{'book' : 'Hebrews', 'chapters' : 13},{'book' : 'James', 'chapters' : 5},{'book' : '1 Peter', 'chapters' : 5},
    {'book' : '2 Peter', 'chapters' : 3},{'book' : '1 John', 'chapters' : 5},{'book' : '2 John', 'chapters' : 1},{'book' : '3 John', 'chapters' : 1},
    {'book' : 'Jude', 'chapters' : 1}, {'book' : 'Revelation', 'chapters' : 22}
  ];

  // This is the bible verse object that will be updated
  // and read from for display
  let bibleDisplay = {
    'reference' : 'John: 3:16',
    'content' : 'For this is the way God loved the world: He gave his one and only Son, so that everyone who believes in him will not perish but have eternal life.'
  };

  // Store all bible objects in here previously retrieved from AJAX
  // Objects included have a .reference and a .content
  let bibleVerseStorage = [
    {
    'book' : "John",
    'scripture': "3:16",
    'content': "For this is the way God loved the world: He gave his one and only Son, so that everyone who believes in him will not perish but have eternal life."
    }
  ];

  // Object to be returned after factory is called
  let dataFactory = {};

  dataFactory.callVerseOfTheDay = function () {
    // First clear out the input

    // Make AJAX call to API to retrieve VOTD

  }


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
        // Split the search term at the semicolon for separate evaluation
        var splitSearch = searchString.split(';');
        for (var i=0; i < splitSearch.length; i++) {
          // Add the individual search terms to the array searchTerms
          searchTerms.push(splitSearch[i]);
        }
      } else {
        // If there is no semicolon, just add to searchTerms anyway as the
        // only entry
        searchTerms.push(searchString);
      };

      // Loop through all entries added to searchTerms to see if they
      // pass verification
      for (var n=0; n < searchTerms.length; n++) {
        var search = searchTerms[n];
        search = search.trim();
        // 1. Verify the search term is at least 4 characters
        if (search.length >= 4) {
          // 2. Verify the there is a colon in the search pattern
          if (search.includes(':')) {
            let passageSplit = search.split(':')
            colonIndex = search.indexOf(':');
            // 3. Verify there is only one colon
            if (passageSplit.length == 2) {
              // 4. Verify there is a space somewhere before the colon
              if (passageSplit[0].includes(" ") || passageSplit[0].includes("  ")) {
                // 5. Verify there is a number before the colon
                if (parseInt(search[colonIndex - 1])) {
                  // 6. Verify there is a number after the colon
                  if(parseInt(search[colonIndex + 1])) {
                    // The verse passes!
                    // 7. Check that book is a book of the bible
                    var searchBook = getSearchBookName(search);
                    //console.log(searchBook);
                    if (isBookOfBible(searchBook)) {
                      // 8. Since book is valid, parse the book and reference
                      // as an object to be used in the search
                      // Push the object to validVerses (has book and scripture)
                      var searchReference = getSearchReference(search, searchBook);
                      console.log('Pushing ' + searchBook + ' ' + searchReference + ' to validVerses');
                      validVerses.push({'book':searchBook, 'scripture':searchReference}); // insert object into validVerses
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    /* SEARCH VERIFICATION FUNCTIONS */

    var getSearchBookName = function (mSearch) {
      // Returns a string of the book name (valid or not)
      var mBook = "";
      // Pull out the potential book name
      potentialBook = mSearch.trim();
      // parses the text from a string to see if it matches an entry in bibleBooks
      // format of argument is a string "XXXXXX #:#" where X could be numbers or letters
      var spaceIndex = potentialBook.lastIndexOf(" ");
      // Now check that a space was found
      // and assign the bookString to be checked to that entry
      if (spaceIndex > 3) { // Make sure the space isn't for a 1 Peter or something like that
        mBook = potentialBook.slice(0, spaceIndex).trim();
      }
      return mBook;
    }

    var isBookOfBible = function (potentialBook) {
      // Checks if the potentialBook is a book of the bible
      var isBook = false; // this value will be returned at end of function
      for (var i = bibleBooks.length-1; i >= 0; i--) {
        if (bibleBooks[i].book.toUpperCase() == potentialBook.toUpperCase()) { // case insensitive comparison
          isBook = true;
          break;
        }
      }
      return isBook;
    }

    var getSearchReference = function (mSearch, mBook) {
      // parse the search to return scripture reference
      // Assumed format is "book scripturechapter:scripturenumbers"
      return mSearch.slice(mBook.length, mSearch.length).trim();
    }
    /* END SEARCH VERIFICATION FUNCTIONS */

    if (passageSearchString) {
      validateVerse(passageSearchString);
    }



    /*
    //////////////////////////
    -2.  CHECK LOCAL STORAGE FOR INFORMATION-
    /////////////////////////
    */

    // Stage the display verses in array
    let stagedBibleObjects = [];

    var verseToRetrieveAjax = []; // Will push verses not in local storage here instead of remove them from here

    var existsInStorage = function(object) {
      // checks if the argument exists in bibleVersesStorage
      var filteredStorage = bibleVerseStorage.filter(function (eL) {
        return eL.scripture == object.scripture && eL.book == object.book;
      });
      if (filteredStorage.length < 1) {
        return false; // the object does not exist in the bibleVerseStorage
      } else {
        return true; // the object does exist in the bibleVerseStorage
      }
    }

    var getFromStorage = function(object) {
      // retrieves stored object from bibleVersesStorage
      var filteredStorage =  bibleVerseStorage.filter(function (eL) {
        return eL.scripture == object.scripture && eL.book == object.book;
      });
      console.log(filteredStorage);
      return filteredStorage[0];
    }

    // if there are any verses in validVerses
    if (validVerses.length) {
      // for all the verses in the valid verses, if it doesn't exist in local storage, it needs to be AJAX
      for (var b = 0; b < validVerses.length; b++) {
        let verseObject = validVerses[b]; // this is the current verse object in validVerses
        if (existsInStorage(verseObject)) {
          console.log('Staging ' + verseObject.book + ' ' + verseObject.scripture + ' from local storage.');
          let retrievedObject = getFromStorage(verseObject);
          stagedBibleObjects.push(retrievedObject);
          console.log('Retrieved ' + retrievedObject.book + ' ' + retrievedObject.scripture + ' from local storage');
        } else {
          console.log('Added ' + verseObject.book + ' ' + verseObject.scripture + ' to AJAX stack');
          verseToRetrieveAjax.push(verseObject);
        }
      }
    }

    for (var s = 0; s < verseToRetrieveAjax.length; s++) {
      console.log('AJAX calls includes ' + verseToRetrieveAjax[s].book + ' ' + verseToRetrieveAjax[s].scripture);
    }

    /* END REDO */


    /*
    /////////////////////////////////
    -3.  AJAX CALL TO LABS.BIBLE.ORG API-
    ////////////////////////////////
    */

    let updateUi = function() {
      // Update the bibleDisplay with the staged information
      let referenceString = "";
      let contentString = "";

      for (var i=0; i < stagedBibleObjects.length; i++){
        referenceString += stagedBibleObjects[i].book + " " + stagedBibleObjects[i].scripture + " ";
        contentString += stagedBibleObjects[i].content + " ";
      }
      if (!referenceString == "") {
        bibleDisplay.reference = referenceString;
      }
      if (!contentString == "") {
        bibleDisplay.content = contentString;
      }
      stagedBibleObjects = [];
    }

    //
    // Now only the verses in verseToRetrieveAjax need AJAX calls
    // If successful, will store the results in the bibleVersesStorage

    // This function will call the API for any verses in verseToRetrieveAjax
    let makeAjaxCalls = function() {
      // Base url for the labs.bible.org API call
      let urlBase = 'http://labs.bible.org/api/?passage=';
      let urlTail = '&formatting=plain&type=json';
      // loop through the versesToRetrieve and build a URL
      if (verseToRetrieveAjax.length) {
        for (var p = verseToRetrieveAjax.length-1; p >=0; p--) {
          console.log('Initiating AJAX call for ' + verseToRetrieveAjax[p].book + ' ' + verseToRetrieveAjax[p].scripture);
          let verseToRetrieve = verseToRetrieveAjax[p].book + '%20' + verseToRetrieveAjax[p].scripture;
          let url = urlBase + verseToRetrieve + urlTail;
          console.log('Built url = ' + url);

          // Actual AJAX call
          $http.jsonp(url, {jsonpCallbackParam: 'callback'}).then(function(data) {
            // NEED TO LOOP THROUGH ALL RETURNED INFORMATION
            //console.log(data.data);
            console.log('Received data');
            var mBookname = data.data[0].bookname;
            var mScripture = "";
            var mContent = "";
            if (data.data.length > 1) {
              mScripture = data.data[0].chapter + ":" + data.data[0].verse + '-' + data.data[data.data.length-1].verse;
              for (var i = 0; i < data.data.length; i++) {
                mContent += data.data[i].text.split('<a style')[0] + " ";
              }
            } else {
              mScripture = data.data[0].chapter + ":" + data.data[0].verse;
              mContent = data.data[0].text.split('<a style')[0];
            }

            // Add this information to the staged data
            stagedBibleObjects.push({book: mBookname, scripture: mScripture, content: mContent});

            // Add this information to the bibleVerseStorage
            bibleVerseStorage.push({book : mBookname, scripture: mScripture, content: mContent });
            for (var r=0; r < bibleVerseStorage.length; r++) {
              var nBook = bibleVerseStorage[r].book;
              var nScripture = bibleVerseStorage[r].scripture;
              var nContent = bibleVerseStorage[r].content;
              console.log('Storage includes ' + nBook + ' ' + nScripture + ' ' + nContent);
            }

            // Now that information is received, remove verse this from the verseToRetrieveAjax
            // WARNING - THIS COULD BE UNSTABLE IF THE REQUESTS COME BACK AT DIFFERENT TIMES
            //verseToRetrieveAjax.splice(verseToRetrieveAjax[p],1);
            verseToRetrieveAjax.pop();
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

    $scope.getVotd = function() {
      console.log('clicked');
      $('#search-passage').val("");
      dataFactory.callVerseOfTheDay();
    }

    $scope.updateVerse = function() {
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
