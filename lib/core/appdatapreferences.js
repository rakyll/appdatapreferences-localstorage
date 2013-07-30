/**
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

goog.provide('appdatapreferences');

goog.require('appdatapreferences.DriveService');
goog.require('goog.crypt.Md5');
goog.require('goog.events.EventTarget');

/**
 * AppdataPreferences constructor.
 */
function AppDataPreferences() {
  goog.events.EventTarget.call(this);
  this.driveService = new appdatapreferences.DriveService();
};

/**
 * Inherits from EventTarget.
 * TODO: remove inheritance if no event is going to be emited.
 */
goog.inherits(AppDataPreferences, goog.events.EventTarget);

/**
 * Local object to be synced with remote file.
 * @type {Object}
 */
AppDataPreferences.prototype.local = window.localStorage;

/**
 * Drive Service.
 * @type {appdatapreferences.DriveService}
 */
AppDataPreferences.prototype.driveService = null;

/**
 * Sync timeout.
 * @type {object}
 */
AppDataPreferences.prototype.syncTimeout = null;

/**
 * Additional options.
 * @type {Object}
 */
AppDataPreferences.prototype.opts = {};

AppDataPreferences.prototype.md5_ = new goog.crypt.Md5();

/**
 * Callback function to call on callback.
 * @type {Function}
 */
AppDataPreferences.prototype.onChangeCallback = null;

AppDataPreferences.prototype.lastRemoteMd5_ = null;

AppDataPreferences.prototype.lastLocalMd5_ = null;

/**
 * Configures with the additional options. 
 * @param  {Object} opts Additional options.
 */
AppDataPreferences.prototype.configure = function(opts) {
  this.opts = opts || {};
};

/**
 * Syncs the localStorage entities with the remote preferences file.
 * @param  {Function=} opt_callback Optional callback fn.
 */
AppDataPreferences.prototype.sync = function (opt_callback) {
  var that = this;

  this.getDriveService_().get(this.local, function(err, file) {
    // TODO: prompt err
    if (!file) {
      return opt_callback && opt_callback();
    }

    var newRemoteMd5 = file['md5Checksum'];
    if (!that.lastRemoteMd5_ || newRemoteMd5 != that.lastRemoteMd5_) {
      // the remote file doesnt match with the local
      // download the contents and merge the changes to local storage
      that.getDriveService_().download(file, function(err, content) {
        // merge content with localStorage.
        that.merge_(content, opt_callback);
        that.lastRemoteMd5_ = newRemoteMd5;
      });
    } else {
      // dont upload if no change
      // otherwise, a racing condition occurs
      that.md5_.reset();
      that.md5_.update(JSON.stringify(that.local));
      var newLocalMd5 = that.md5_.digest().join('.');

      if (newLocalMd5 == that.lastLocalMd5_) {
        return opt_callback && opt_callback();
      }
      
      that.getDriveService_()
          .upload(file['id'], that.local, function(err, file) {
        that.lastRemoteMd5_ = file['md5Checksum'];
        that.lastLocalMd5_ = newLocalMd5;
        opt_callback && opt_callback();
      });
    }
  });
};

/**
 * Starts a periodic sync.
 */
AppDataPreferences.prototype.start = function() {
  var that = this;
  this.stop();

  var fn = function() {
    that.sync(function(err) {
      that.syncTimeout = setTimeout(function() {
        fn();
      }, that.opts['interval'] || 5000);
    });
  };
  fn();
};

/**
 * Stops the periodic sync tasks.
 */
AppDataPreferences.prototype.stop = function() {
  // TODO: aboirt existing jobs
  if (this.syncTimeout) {
    clearTimeout(this.syncTimeout);
  }
};

/**
 * Registers the onChange callback function for change handling.
 * @param  {Function} callback Callback fn.
 */
AppDataPreferences.prototype.onChange = function(callback) {
  this.onChangeCallback = callback;
};

/**
 * Merges remote object with local.
 * @param  {object} remote          The remote object.
 * @param  {Function=} opt_callback Optional callback function.
 */
AppDataPreferences.prototype.merge_ = function(remote, opt_callback) {
  // local storage doesnt have a concept timestamps.
  // therefore, merge is a replacment of the old local with new remote.
  for (var key in this.local) {
    delete this.local[key];
  }
  for (var key in remote) {
    this.local[key] = remote[key];
  }
  opt_callback && opt_callback();
};

/**
 * Generates a new Google Drive service with the configured access token.
 * @return {appdatapreferences.DriveService} Generated Drive service object.
 */
AppDataPreferences.prototype.getDriveService_ = function() {
  this.driveService.setToken(this.opts['token']);
  return this.driveService;
};

/**
 * Constuct a new AppDataPreferences obj.
 * @type {AppDataPreferences}
 */
var appdatapreferences = new AppDataPreferences();

/**
 * Export the symbols for the public interface.
 */
goog.exportSymbol('appdatapreferences', appdatapreferences);
goog.exportSymbol('appdatapreferences.configure', appdatapreferences.configure);
goog.exportSymbol('appdatapreferences.sync', appdatapreferences.sync);
goog.exportSymbol('appdatapreferences.start', appdatapreferences.start);
goog.exportSymbol('appdatapreferences.stop', appdatapreferences.stop);
goog.exportSymbol('appdatapreferences.onChange', appdatapreferences.onChange);
