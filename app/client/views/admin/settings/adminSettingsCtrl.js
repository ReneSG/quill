angular.module('reg')
  .controller('AdminSettingsCtrl', [
    '$scope',
    '$sce',
    'SettingsService',
    function($scope, $sce, SettingsService){

      $scope.settings = {};
      SettingsService
        .getPublicSettings()
        .success(function(settings){
          updateSettings(settings);
        });

      function updateSettings(settings){
        $scope.loading = false;
        settings.timeOpen = new Date(settings.timeOpen);
        settings.timeClose = new Date(settings.timeClose);
        settings.timeConfirm = new Date(settings.timeConfirm);
        settings.checkInOpen = new Date(settings.checkInOpen);

        $scope.settings = settings;
      }

      // Whitelist --------------------------------------

      SettingsService
        .getWhitelistedEmails()
        .success(function(emails){
          $scope.whitelist = emails.join(", ");
        });

      $scope.updateWhitelist = function(){
        SettingsService
          .updateWhitelistedEmails($scope.whitelist.replace(/ /g, '').split(','))
          .success(function(settings){
            swal('Whitelist updated.');
            $scope.whitelist = settings.whitelistedEmails.join(", ");
          });
      };

      // Registration Times -----------------------------

      $scope.formatDate = function(date){
        if (!date){
          return "Invalid Date";
        }

        var timeZone = moment.tz.guess();
        var timeZoneOffset = date.getTimezoneOffset();

        // Hack for timezone
        return moment(date).format('dddd, MMMM Do YYYY, h:mm a') +
          " " + moment.tz.zone(timeZone).abbr(timeZoneOffset);
      };

      // Take a date and remove the seconds.
      function cleanDate(date){
        return new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          date.getHours(),
          date.getMinutes()
        );
      }

      $scope.updateRegistrationTimes = function(){
        // Clean the dates and turn them to ms.
        var open = cleanDate($scope.settings.timeOpen).getTime();
        var close = cleanDate($scope.settings.timeClose).getTime();

        if (open < 0 || close < 0 || open === undefined || close === undefined){
          return swal('Oops...', 'You need to enter valid times.', 'error');
        }
        if (open >= close){
          swal('Oops...', 'Registration cannot open after it closes.', 'error');
          return;
        }

        SettingsService
          .updateRegistrationTimes(open, close)
          .success(function(settings){
            updateSettings(settings);
            swal("Looks good!", "Registration Times Updated", "success");
          });
      };

      // Confirmation Time -----------------------------

      $scope.updateConfirmationTime = function(){
        var confirmBy = cleanDate($scope.settings.timeConfirm).getTime();

        SettingsService
          .updateConfirmationTime(confirmBy)
          .success(function(settings){
            updateSettings(settings);
            swal("Sounds good!", "Confirmation Date Updated", "success");
          });
      };

      // Acceptance / Confirmation Text ----------------

      var converter = new showdown.Converter();

      $scope.markdownPreview = function(text){
        return $sce.trustAsHtml(converter.makeHtml(text));
      };

      $scope.updateWaitlistText = function(){
        var text = $scope.settings.waitlistText;
        SettingsService
          .updateWaitlistText(text)
          .success(function(data){
            swal("Looks good!", "Waitlist Text Updated", "success");
            updateSettings(data);
          });
      };

      $scope.updateAcceptanceText = function(){
        var text = $scope.settings.acceptanceText;
        SettingsService
          .updateAcceptanceText(text)
          .success(function(data){
            swal("Looks good!", "Acceptance Text Updated", "success");
            updateSettings(data);
          });
      };

      $scope.updateConfirmationText = function(){
        var text = $scope.settings.confirmationText;
        SettingsService
          .updateConfirmationText(text)
          .success(function(data){
            swal("Looks good!", "Confirmation Text Updated", "success");
            updateSettings(data);
          });
      };
      
      // CheckInOpen ---------------------------------------
        $scope.updateCheckInOpen = function() {
          var CheckInOpen = cleanDate($scope.settings.checkInOpen).getTime();
          
          SettingsService
              .updateCheckInOpen(CheckInOpen)
              .success(function(data){
                  swal("Looks good!", "Check In Open Updated", "success");
                  updateSettings(data);
              });
        };
        
        // Team Size to be accepted ------------------------
        $scope.updateTeamSizeAccepted = function() {
            var number = $scope.settings.teamSizeAccepted;
            SettingsService
                .updateTeamSizeAccepted(number)
                .success(function(data){
                    swal("Looks good!", "Team Size to be Accepted Updated", "success");
                    updateSettings(data);
                });
        };
        
        // Location of the hack ----------------------------
        $scope.updateHackLocation = function() {
            var latitude = $scope.settings.hackLocation.latitude;
            var longitude = $scope.settings.hackLocation.longitude;
            SettingsService
                .updateHackLocation(latitude, longitude)
                .success(function(data) {
                    swal("Looks good!", "Location of the Hack has been Updated", "success");
                    updateSettings(data);
                })
        }
        
        // Max table count ---------------------------------
        $scope.updateMaxTableCount = function() {
            var number = $scope.settings.maxTableCount;
            SettingsService
                .updateMaxTableCount(number)
                .success(function (data) {
                    swal("Looks good!", "Max Number of Tables Updated", "success");
                    updateSettings(data);
                })
        }

    }]);
