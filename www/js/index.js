(function () {

   function configRoutes($stateProvider, $urlRouterProvider) {
      $stateProvider
         .state('login', {
            url: '/login',
            templateUrl: 'views/login.html',
            controller: 'loginController'
         })
         .state('register', {
            url: '/register',
            templateUrl: 'views/register.html',
            controller: 'loginController'
         })
         .state('dashboard', {
            url: '/dashboard',
            templateUrl: 'views/dashboard.html',
            controller: 'dashboardController'
         })
         .state('userdetails', {
            url: '/userdetails',
            templateUrl: 'views/userdetails.html',
            controller: 'userdetailsController',
            params: {
               face: null,
               what: '',
               who: '',
               when: '',
               notes: ''
            }
         });
      $urlRouterProvider.otherwise('/login');

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

   function dashboardControllerFunction($scope, $mdSidenav, $location, $state) {

      $scope.openLeftMenu = function () {
         $mdSidenav('left').toggle();
      };

      // $scope.selectedUser = {};

      $scope.userDetails = function (item) {

         // $scope.selectedUser = item;
         // console.log($scope.selectedUser);
         $state.go('userdetails', item);
      };

      var imagePath = 'img/logo.png';
      $scope.todos = [{
            face: imagePath,
            what: 'Brunch this weekend?',
            who: 'Min Li Chan',
            when: '3:08PM',
            notes: " I'll be in your neighborhood doing errands"
         },
         {
            face: imagePath,
            what: 'Brunch this weekend?',
            who: 'Min Li Chan',
            when: '3:08PM',
            notes: " I'll be in your neighborhood doing errands"
         },
         {
            face: imagePath,
            what: 'Brunch this weekend?',
            who: 'Min Li Chan',
            when: '3:08PM',
            notes: " I'll be in your neighborhood doing errands"
         },
         {
            face: imagePath,
            what: 'Brunch this weekend?',
            who: 'Min Li Chan',
            when: '3:08PM',
            notes: " I'll be in your neighborhood doing errands"
         },
         {
            face: imagePath,
            what: 'Brunch this weekend?',
            who: 'Min Li Chan',
            when: '3:08PM',
            notes: " I'll be in your neighborhood doing errands"
         }
      ];
   }

   function userdetailsControllerFunction($scope, $stateParams) {
      $scope.selectedUser = {};
      $scope.selectedUser = $stateParams;
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

   var loginApp = angular.module('loginApp', ['ngMaterial', 'ui.router']);

   loginApp.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
      configRoutes($stateProvider, $urlRouterProvider);
   }]);

   loginApp.controller('loginController', ['$scope', '$location', function ($scope, $location) {
      loginControllerFunction($scope, $location);
   }]);

   loginApp.controller('dashboardController', ['$scope', '$mdSidenav', '$location', '$state', function ($scope, $mdSidenav, $location, $state) {
      dashboardControllerFunction($scope, $mdSidenav, $location, $state);
   }]);

   loginApp.controller('userdetailsController', ['$scope', '$stateParams', function ($scope, $stateParams) {
      userdetailsControllerFunction($scope, $stateParams);
   }]);

   document.addEventListener('deviceready', onDeviceReady, false);
})();