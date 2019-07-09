(function () {

   function configRoutes($routeProvider) {
      $routeProvider
         .when('/login', {
            templateUrl: 'views/login.html',
            controller: 'loginController'
         })
         .when('/register', {
            templateUrl: 'views/register.html',
            controller: 'loginController'
         })
         .otherwise({
            redirectTo: 'views/login.html',
            controller: 'loginController'
         });
   }

   function loginControllerFunction($scope) {
      $scope.user = [];
      var fileData = [];

      $scope.registerUser = function () {
         var cb = function (data) {
            fileData = data;
            console.log(fileData);

            if (fileData.every(function (element) {
                  return element.email !== $scope.newuser.email ? true : false;
               })) {
               $scope.user.push({
                  name: $scope.newuser.name,
                  email: $scope.newuser.email,
                  password: $scope.newuser.password
               });
            } else {
               $scope.isRegistered = true;
            }

            writeToFile('userList.json', $scope.user);

         };
         readFromFile('userList.json', cb);

         // console.log($scope.user);
         // var fileData = readFromFile('userList.json');
         // console.log(fileData);
      };

      $scope.loginUser = function () {
         console.log("logged in user");
      };
   }

   //cordova 
   var errorHandler = function (fileName, e) {
      var msg = '';

      switch (e.code) {
         case FileError.QUOTA_EXCEEDED_ERR:
            msg = 'Storage quota exceeded';
            break;
         case FileError.NOT_FOUND_ERR:
            msg = 'File not found';
            break;
         case FileError.SECURITY_ERR:
            msg = 'Security error';
            break;
         case FileError.INVALID_MODIFICATION_ERR:
            msg = 'Invalid modification';
            break;
         case FileError.INVALID_STATE_ERR:
            msg = 'Invalid state';
            break;
         default:
            msg = 'Unknown error';
            break;
      }

      console.log('Error (' + fileName + '): ' + msg);
   };

   function readFromFile(fileName, cb) {
      var pathToFile = cordova.file.dataDirectory + fileName;
      window.resolveLocalFileSystemURL(
         pathToFile,
         function (fileEntry) {
            fileEntry.file(function (file) {
               var reader = new FileReader();

               reader.onloadend = function (e) {
                  cb(JSON.parse(this.result));
                  // cb(this.result);
                  // console.log('Text is: ' + this.result);
               };
               reader.readAsText(file);
            }, errorHandler.bind(null, fileName));
         },
         errorHandler.bind(null, fileName)
      );
   }

   function writeToFile(fileName, data) {
      data = JSON.stringify(data, null, '\t');
      window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function (directoryEntry) {
         directoryEntry.getFile(fileName, {
            create: true
         }, function (fileEntry) {
            fileEntry.createWriter(function (fileWriter) {
               fileWriter.onwriteend = function () {
                  console.log("write of file " + fileName + " completed");
               };

               fileWriter.onerror = function (e) {
                  console.log("write failed" + e.toString());
               };

               var blob = new Blob([data], {
                  type: 'text/plain'
               });
               fileWriter.write(blob);
               // readFromFile('userList.json');
            }, errorHandler.bind(null, fileName));
         }, errorHandler.bind(null, fileName));
      }, errorHandler.bind(null, fileName));
   }

   function onDeviceReady() {
      angular.bootstrap(document.body, ['loginApp']);
      //need to delay bootstrapping angular until deviceready fires
   }

   var loginApp = angular.module('loginApp', ['ngRoute']);

   loginApp.config(['$routeProvider', function ($routeProvider) {
      configRoutes($routeProvider);
   }]);

   loginApp.controller('loginController', ['$scope', function ($scope) {
      loginControllerFunction($scope);
   }]);

   document.addEventListener('deviceready', onDeviceReady, false);
})();