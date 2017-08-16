# living-word
Bible verse fetching application built on AngularJS.

This application is used for searching for a Bible verse and displaying it on the page.

Living-Word was built using AngularJS and displays data fetched from NET Bible API (http://labs.bible.org/).

![main](https://user-images.githubusercontent.com/28768183/29362968-a95e4440-8253-11e7-9467-36bd50b0b616.PNG)

The purpose of the web application is to demonstrate usage of AngularJS in a single page application.  Users can search for bible verses
in several different contexts for retrieval.  Previously fetched verses are stored locally to increase UI load times.  An extensive
verse verification function was created to ensure any API calls were valid, rather than making an API call for anything submitted by
the input.

The application also supports three features available through the API: verse of the day retrieval, multi-verse retrieval, and random verse retrieval.

![multi](https://user-images.githubusercontent.com/28768183/29363014-d34d9d82-8253-11e7-9c63-a58524b2be4a.PNG)

