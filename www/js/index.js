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
      $scope.registerUser = function () {
         $scope.user.push({
            name: $scope.newuser.name,
            email: $scope.newuser.email,
            password: $scope.newuser.password
         });
         console.log($scope.user);
      };

      $scope.loginUser = function () {
         console.log("logged in user");
      };
      // writeToFile('userList.json', $scope.user);
   }

   // //cordova 
   // function errorHandler(fileName) {
   //    console.log("error creating " + fileName);
   // }

   // function writeToFile(fileName, data) {
   //    data = JSON.stringify(data, null, '\t');
   //    window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function (directoryEntry) {
   //       directoryEntry.getFile(fileName, {
   //          create: true
   //       }, function (fileEntry) {
   //          fileEntry.createWriter(function (fileWriter) {
   //             fileWriter.onwriteend = function () {
   //                console.log("write of file " + fileName + " completed");
   //             };

   //             fileWriter.onerror = function (e) {
   //                console.log("write failed" + e.toString());
   //             };

   //             var blob = new Blob([data], {
   //                type: 'text/plain'
   //             });
   //             fileWriter.write(blob);
   //          }, errorHandler.bind(null, fileName));
   //       }, errorHandler.bind(null, fileName));
   //    }, errorHandler.bind(null, fileName));
   // }


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