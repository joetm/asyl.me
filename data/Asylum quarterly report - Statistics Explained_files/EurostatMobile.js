
/**
 * DeviceDetection Class
 * @author Daniel Pötzinger
 * @author Darius Aukstinaitis
 */
DeviceDetection = function(ua) {
	/**
	 * @type string the user agend string used (readonly)
	 */
	this.ua;
	/**
	 * @type object struct with common check results for performance
	 */
	this.checks;
	/**
	 * Constructor
	 * @param string ua Optional the useragent string - if not given its retrieved from browser
	 */
	this.construct = function(ua) {
		if (typeof ua == 'undefined') {
			var ua = navigator.userAgent;
		}
		this.ua = ua;
		// parse data
		this.checks = {
		  iphone: Boolean(ua.match(/iPhone/)),
		  ipod: Boolean(ua.match(/iPod/)),
		  ipad: Boolean(ua.match(/iPad/)),
		  blackberry: Boolean(ua.match(/BlackBerry/)),
		  playbook: Boolean(ua.match(/PlayBook/)),
		  android: Boolean(ua.match(/Android/)),
		  macOS: Boolean(ua.match(/Mac OS X/)),
		  win: Boolean(ua.match(/Windows/)),
		  mac: Boolean(ua.match(/Macintosh/)),	  
		  wphone: Boolean(ua.match(/(Windows Phone OS|Windows CE|Windows Mobile)/)),
		  mobile: Boolean(ua.match(/Mobile/)),
		  /* http://mojosunite.com/tablet-user-agent-strings */
		  androidTablet: Boolean( ua.match(/(GT-P1000|SGH-T849|SHW-M180S)/) ),
		  tabletPc: Boolean(ua.match(/Tablet PC/)),
		  palmDevice: Boolean(ua.match(/(PalmOS|PalmSource| Pre\/)/)),
		  kindle: Boolean(ua.match(/(Kindle)/)),
		  otherMobileHints: Boolean(ua.match(/(Opera Mini|IEMobile|SonyEricsson|smartphone)/))
		};		
	}

	this.isTouchDevice = function() {
		return this.checks.iphone || this.checks.ipod || this.checks.ipad;
	}
	
	this.isApple = function() {
		return this.checks.iphone || this.checks.ipod || this.checks.ipad || this.checks.macOS  || this.checks.mac;
	}
	
	this.isBlackberry = function() {
		return this.checks.blackberry;
	}
	
	this.isAndroid = function() {
		return this.checks.android;
	}
	
	this.isTablet = function() {
		return this.checks.ipad || this.checks.tabletPc || this.checks.playbook || this.checks.androidTablet || this.checks.kindle;
	}
	this.isDesktop = function() {
		return !this.isTouchDevice() && !this.isSmartPhone() && !this.isTablet()
	}
	this.isSmartPhone = function() {
		return (this.checks.mobile || this.checks.blackberry || this.checks.palmDevice || this.checks.otherMobileHints) && !this.isTablet() && !this.checks.ipod;
	}	
	
	this.construct(ua);
}

function mobileSwitcher(url,message,stayOnStd) {
	var dt = new DeviceDetection();
	
	if (stayOnStd == true) {
		//$.cookie('statexp_mobile_stdnav',true);
		$.cookie('statexp_mobile',false);
	}
	
	if ($.cookie('statexp_mobile') != 'false'){// && !($.cookie('statexp_mobile_stdnav') == 'true')) {
		if (dt.checks.iphone) {
			window.location.href = url;
		} else {
			if (dt.isSmartPhone() && !dt.checks.wphone) {
				
				if ($.cookie('statexp_mobile') == undefined) {
					useMobile = confirm(message);
					$.cookie('statexp_mobile',useMobile);
				}
				
				if ($.cookie('statexp_mobile') == 'true') {
					window.location.href = url;
				}
				
			} 
		}
	}
	
};

