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

// Establish a blank object literal to hold controllers
let controllers = {};

// Create the app controller
controllers.MainController = function($scope) {

}

// Initialize the controllers in the appModule
appModule.controller(controllers);

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
