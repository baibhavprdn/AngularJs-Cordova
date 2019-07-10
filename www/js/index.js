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
         .when('/dashboard', {
            templateUrl: 'views/dashboard.html',
            controller: 'loginController'
         })
         .otherwise({
            redirectTo: '/login'
         });
   }

   function loginControllerFunction($scope, $location) {
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
            alert("Registration Successful!");
            console.log("welcome" + $scope.newuser.email);
            $location.path('/dashboard');
         };
         readFromFile('userList.json', cb);
      };

      $scope.loginUser = function () {
         var cb = function (data) {
            fileData = data;
            if (fileData.every(function (element) {
                  return element.email !== $scope.appUsers.email ? true : false;
               })) {
               alert("Incorrect Username");
            } else {
               fileData.forEach(function (element) {
                  if (element.email === $scope.appUsers.email) {
                     if (element.password === $scope.appUsers.password) {
                        console.log("welcome " + element.email);
                        $location.path('/dashboard');
                     } else {
                        alert("Incorrect Password");
                     }
                  }
               });
            }
         };
         readFromFile('userList.json', cb);
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

   var loginApp = angular.module('loginApp', ['ngRoute', 'ngMaterial']);

   loginApp.config(['$routeProvider', function ($routeProvider) {
      configRoutes($routeProvider);
   }]);

   loginApp.controller('loginController', ['$scope', '$location', function ($scope, $location) {
      loginControllerFunction($scope, $location);
   }]);

   document.addEventListener('deviceready', onDeviceReady, false);
})();