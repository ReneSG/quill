angular.module('reg')
  .factory('SettingsService', [
  '$http',
  function($http){

    var base = '/api/settings/';

    return {
      getPublicSettings: function(){
        return $http.get(base);
      },
      updateRegistrationTimes: function(open, close){
        return $http.put(base + 'times', {
          timeOpen: open,
          timeClose: close,
        });
      },
      updateConfirmationTime: function(time){
        return $http.put(base + 'confirm-by', {
          time: time
        });
      },
      getWhitelistedEmails: function(){
        return $http.get(base + 'whitelist');
      },
      updateWhitelistedEmails: function(emails){
        return $http.put(base + 'whitelist', {
          emails: emails
        });
      },
      updateWaitlistText: function(text){
        return $http.put(base + 'waitlist', {
          text: text
        });
      },
      updateAcceptanceText: function(text){
        return $http.put(base + 'acceptance', {
          text: text
        });
      },
      updateConfirmationText: function(text){
        return $http.put(base + 'confirmation', {
          text: text
        });
      },
      updateCheckInOpen: function(number){
        return $http.put( base + 'checkInOpen', {
          checkInOpen: number
        })
      },
      updateTeamSizeAccepted: function (number) {
        return $http.put( base + 'teamSizeAccepted', {
          teamSizeAccepted: number
        })
      },
      updateHackLocation: function (latitude, longitude) {
        return $http.put( base + 'hackLocation', {
          latitude: latitude,
          longitude: longitude
        })
      },
      updateMaxTableCount: function (number) {
        return $http.put( base + 'maxTableCount', {
          maxTableCount: number
        })
      }
    };

  }
  ]);
