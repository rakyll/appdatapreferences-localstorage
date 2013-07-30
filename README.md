# Appdata Preferences for Local Storage

Appdata Preferences for Local Storage seamessly syncs your local storage with Google Drive, you don't need to worry about persisting your user settings and application data anymore.

## quickstart

Include appdatapreferences and configure it with an access token. Your access token need to be authorized for `https://www.googleapis.com/auth/drive.appdata` scope. You can go through [one of the OAuth 2.0 flows](https://developers.google.com/accounts/docs/OAuth2) to retrieve one or use [Google+ Sign-In](https://developers.google.com/+/web/signin/) button.

Grab the `dist/appdatapreferences.js` and include it.

    <script src="/path/to/appdatapreferences.js"></script>
    <script>
	    appdatapreferences.configure({ token: <access_token> });
	    appdatapreferences.start();
	</script>

Your storage will be initiated with the remote preferences on user's Drive. If this is the first time, your user is being synchronized with Google Drive, the library will initiate a new remote preferences file with his/her current local storage.

    localStore['name'] = 'my name';

Continue to edit your `localStorage` and wait for your preferences to be synced. That's it.


## reference

### appdatapreferences.configure(opts)

Configures `appdatapreferences`, the options:

* `token`: The access token authorized for appdata scope.
* `interval`: The polling frequency to check if there are new remote changes are available.

### appdatapreferences.sync(opt_callback)

Stops the currently running sync operation and syncs the local storage with remote preferences file. If there are remote changes available, merges the remote changes to local storage. If there has been a change to local storage since last sync, it uploads the local values to remote preferences.

### appdatapreferences.start()

Stops the currently running sync operation and starts a periodic sync operation.

### appdatapreferences.stop()

Stops the currently running sync operation and cancels the periodic sync.

## contributors

You need to have `npm` and `grunt-cli` installed on your machine. Fork then init and update submodules to get a copy of Closure lib.

~~~
git submodule init && git submodule update
~~~

Install all dependencies:

~~~
npm install && bower install
~~~

Build to release a new distribution, the release output will be under `/dist`:

~~~
grunt build
~~~

