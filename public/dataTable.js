var app = angular.module('commentsDataApp', ['ngSanitize']);
//Module defines the application, it's a container for different parts of the application

app.controller('dataTable', function ($scope, $http) {
    //Controller JS objects to control the data
    //Initial $scope objects for 'dataTable'
    $scope.myData = [];
    $scope.pageSize = 50;
    $scope.pageSizeOptions = [25, 50, 100, 250];
    $scope.totalCount = 0;
    $scope.pageNo = 1;
    $scope.prevButton = false;
    $scope.maxPages = 0;
    $scope.searchExpression = "";
    $scope.lastTableEntry = 0;

    //Initial Table View
    retrieveData();

    $scope.sortData = function (keyIdentifier) {
        //Set the sortKey for the data and the order
        //order, False = Ascending, True = Descending
        $scope.sortKey = keyIdentifier;
        $scope.order = !$scope.order; 
    }

    $scope.setResultsPerPage = function (resultsPerPage) {
        //Set the number of results per page and retrieve new data
        $scope.pageSize = resultsPerPage;
        $scope.pageNo = 1;
        retrieveData();
    }

    function retrieveData() {
        //Function to make AJAX HTTP GET Request with params for paging/searching 
        $http.get('https://jsonplaceholder.typicode.com/comments' + $scope.searchExpression, {
            params: {
                //q: searchExpression, //Search Expression using query parameter
                _page: $scope.pageNo,
                _limit: $scope.pageSize
            }
        }).then(function (response) {
            $scope.myData = response.data;

            //Retrieve information about total number of records for /comments from HTTP Header
            $scope.headers = response.headers();
            $scope.totalCount = $scope.headers["x-total-count"];

            $scope.maxPages = Math.ceil($scope.totalCount / $scope.pageSize);

            $scope.lastTableEntry = $scope.pageNo * $scope.pageSize;
            
            if ($scope.lastTableEntry > $scope.totalCount) {
                $scope.lastTableEntry = $scope.totalCount;
            }
        });
    }

    $scope.getNumber = function (num) {
        console.log(num);
        return new Array(num);
    }

    $scope.search = function (searchExpression) {
        //Search function to declare GET params and retrieve new data
        $scope.pageNo = 1;
        $scope.searchExpression = "?q=" + searchExpression;
        retrieveData();
        //console.log($scope.maxPages);
    }

    $scope.setPage = function (type) {
        //Set table page view depending on 'type' of button clicked 
        if (type == "prev") {
            $scope.pageNo--;
        }
        else if (type == "next") {
            $scope.pageNo++;
        }
        else {
            $scope.pageNo = parseInt(type);
        }

        retrieveData();
    }
});

app.filter('highlighted', function ($sce) {
    //Custom filter to highltght searched terms
    return function (text, searchText) {
        if (searchText) {
            //Find an string associated with searchText variable/pattern
            //Flags - g, find all matches rather than stopping after first match
            //Flags - i, ignore case such as lowercase, uppercase are both searched
            //$1 is the first pattern match from regex expression
            text.toString();
            text = text.replace(new RegExp('(' + searchText + ')', 'gi'), '<span class="highlighted">$1</span>');
        }
        //Return trustant variant of text for ng-bind-html
        return $sce.trustAsHtml(text);
    }
});