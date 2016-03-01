//profileController.js

var app = angular.module('profileApp', ['profileApp.directives', 'profileServices', 'ngSanitize']);

app.controller('ProfileController', ['$rootScope', '$scope', '$timeout', 'pageContent', '$sanitize', function($rootScope, $scope, $timeout, pageContent, $sanitize) {
	var isIE = /*@cc_on!@*/false || !!document.documentMode;
	if (isIE) { $('html').addClass('IE') };

	$(window).on('beforeunload', function() {
		$(window).scrollTop(0);
	});

	$rootScope.svgPath = function(file) {
		if (file != '' && file != undefined) {
			return 'images/SVGs/' + file;
		}
	};

	//Get page content from DB
	$rootScope.navItems = {
		'page1': 'Home',
		'page2': '',
		'page3': '',
		'page4': '',
		'page5': '',
		'page6': '',
	};
	$scope.introPageContent = {};

	pageContent.getContent('introSection').then(function(response){
		$scope.introPageContent = response.data[0];
	});

	$scope.loadingAnimationOver = false;
	$rootScope.noScroll = false;
	$scope.navScrolled = false;	
	$scope.animationOver = false;
	$rootScope.navVisible = false;
	$scope.showNav = false;
	$scope.mobile = false;
	$scope.tablet = false;

	$scope.checkScreenSize = function(){
		if(window.innerWidth < 769) {
			$scope.mobile = true;
			$scope.animationOver = true;
		} 
		else {
			$scope.mobile = false;
		}
		if(window.innerWidth < 997) {
			$scope.tablet = true;
		} 
		else {
			$scope.tablet = false;
		}
	};
	$scope.checkScreenSize();

	$rootScope.setNav = function() {
		if ($rootScope.navVisible) {
			$('#nav').animate({'top': -5}, 300);
			$('#nav').animate({'top': -20}, 200);
		}
		else {
			$('#nav').animate({'top': -5}, 200);
			$('#nav').animate({'top': -150}, 300);
		}
	}
	$rootScope.$watch('navVisible', function() {
		$rootScope.setNav();
	});
	$scope.$watch('mobile', function(oldValue, newValue) {
		if (oldValue == newValue) {
			return;
		}
		else {
			$rootScope.setNav();
		}
	});

	$(window).resize(function(){
		$scope.checkScreenSize();
		$scope.$apply();
	});


	$scope.jumpTo = function(section){
		$scope.showNav = false;
		$scope.scrollTo = $('.page:eq(' + section + ')').offset().top;
		if (!$scope.mobile) {
			$('body, html').animate({scrollTop: $scope.scrollTo - 55});
		}
		else {
			$('body, html').animate({scrollTop: $scope.scrollTo});
		}
	};

	$(window).scroll(function(){
		if($(window).scrollTop() > 600){
			$scope.navScrolled = true;
		}
		else {
			$scope.navScrolled = false;	
		}
		$scope.$apply();
	});

	$('body').bind('webkitAnimationEnd oanimationend msAnimationEnd animationend', '#cityOutline svg', function(e) {
		$scope.animationOver = true;
		$timeout(function(){
			$rootScope.navVisible = true;
		},600);
		
		$scope.$apply();
		
		$('#cityOutline').addClass('disappear');
	});

	$('body').bind('webkitTransitionEnd otransitionend msTransitionEnd transitionend', '.circle', function(e) {
		$scope.loadingAnimationOver = true;
		$scope.$apply();
	});

	$(window).load(function(){
		$('body').addClass('loaded');

		if (!$scope.mobile) {
			$('#cityOutline').addClass('draw');
		}
		else {
			$rootScope.navVisible = true;
		}

		if (isIE) {
			$scope.closeBanner = function() {
				$('.browser-warning').animate({top: -200}, 800);
			}

			$rootScope.offset = 100;

			$rootScope.offsetMe = function() {
				if($rootScope.offset <= 0) {
					cancelAnimationFrame($rootScope.offsetMe);
					$scope.animationOver = true;
					$('#cityOutline').addClass('disappear');
				}
				else {
					$('#cityAnimation svg path').css('stroke-dasharray', (100 - $rootScope.offset) + '% ' + $rootScope.offset + '%');
					$rootScope.offset--;

					requestAnimationFrame($rootScope.offsetMe);
				}
			}

			$rootScope.offsetMe();
		}
	});
}]);






