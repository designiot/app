angular.module('starter.controllers', ["highcharts-ng"])

.controller('DashCtrl', function ($scope, $http, $localstorage) {
    var apiServerUrl = $localstorage.get('api_server');
    $http.get(apiServerUrl)
    .then(function(response){
      var data = [];
      $.each(response.data, function(key, val) {
        data.push(val.temperature);
      });
      $scope.chartConfig = {
        title: {
          text: '月平均气温',
          x: -20
        },
        xAxis: {
          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },
        yAxis: {
          title: {
            text: 'Temperature (°C)'
          },
          plotLines: [{
            value: 0,
            width: 1,
            color: '#808080'
          }]
        },
        tooltip: {
          valueSuffix: '°C'
        },
        legend: {
          layout: 'vertical',
          align: 'right',
          verticalAlign: 'middle',
          borderWidth: 0
        },
        series: [{
          name: 'Today',
          data: data
        }]
      }
    });
})

.controller('BlueToothCtrl', function ($scope, $ionicPlatform, $cordovaBluetoothSerial, $state) {
  $scope.discoverDevices = {};
  $scope.listDevices = {};
  $scope.status = "未连接";
  $ionicPlatform.ready(function () {
    $cordovaBluetoothSerial.isConnected().then(function (result) {
      $scope.status = "已连接";
    });

    $cordovaBluetoothSerial.list().then(function (result) {
      $scope.devices = result;
    });
  });

  $scope.onRefresh = function () {
    $cordovaBluetoothSerial.clear().then(function (result) {
      $cordovaBluetoothSerial.list().then(function (result) {
        $scope.listDevices = result;
        console.log("已配对", JSON.stringify(result));
        $cordovaBluetoothSerial.discoverUnpaired().then(function (result) {
          console.log("未配对", JSON.stringify(result));
          $scope.discoverDevices = result;
          $scope.$broadcast('scroll.refreshComplete');
        }, function (err) {
          alert(err);
        });
      });
    });
  };

  $scope.connect = function (address, device) {
    $cordovaBluetoothSerial.connect(address).then(function (result) {
      localStorage.setItem("last_device",  device);
      $state.go('tab.color');
    });
    $cordovaBluetoothSerial.subscribeRawData().then(function (result) {
      console.log("raw data" + result);
    })
  };
})

.controller('ControlCtrl', function ($scope, $http, $localstorage) {
    $scope.value = false;

    $scope.toggleChange = function(){
      if($scope.value == false) {
        $scope.value = true;
      } else {
        $scope.value = false;
      }

      var controlUrl = $localstorage.get('control_url');
      $http.post(controlUrl, {led: $scope.value})
        .then(function (response, status) {
          alert(JSON.stringify(response));
        }, function (err) {
          alert(JSON.stringify(err));
        });
    };
})

.controller('AccountCtrl', function ($scope, $localstorage) {
    $scope.data = {};
    $scope.placeholder = {
      api_server: $localstorage.get('api_server'),
      control_url: $localstorage.get('control_url')
    };

    $scope.setting =  function () {
      $scope.data = angular.extend($scope.placeholder, $scope.data);
      $localstorage.set('api_server', $scope.data.api_server);
    }
});
