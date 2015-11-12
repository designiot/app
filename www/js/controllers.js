angular.module('starter.controllers', ["highcharts-ng"])

.controller('DashCtrl', function ($scope, $http) {
    $http.get('http://localhost:3000/api/1/devices/1/results')
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

.controller('ChatsCtrl', function ($scope, $http) {
    $scope.value = false;

    $scope.toggleChange = function(){
      if($scope.value == false) {
        $scope.value = true;
      } else {
        $scope.value = false;
      }
      
      $http.post('http://localhost:3000/api/1/devices', {led: $scope.value})
        .then(function (response, status) {
          alert(JSON.stringify(response));
        }, function (err) {
          alert(JSON.stringify(err));
        });
    };
})

.controller('ChatDetailCtrl', function ($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function ($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
