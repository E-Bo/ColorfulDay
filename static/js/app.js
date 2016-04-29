var slang = LANG['cn'];

var getWeatherData = function(url){
	$.ajaxJSONP({
		url: url
	});
};

var getGeoInfo = function(lat,lng,jsonpCallBack){
	var geoUrl = 'http://api.map.baidu.com/geocoder/v2/?ak='+ BAIDUAK +'&callback='+ jsonpCallBack +'&location='+ lat +','+ lng +'&output=json&pois=0';
	$.ajax({
		url: geoUrl,
		type: 'GET',
		dataType: 'jsonp',
		jsonp: '_jsonp'
	});
};

var codeselect = function(code) {
    var t = (new Date).getTime(),
    n = parseInt(code) + (new Date).getTime(),
    r = [t, n];
    return r
};

var getRealTimeWeatherData = function(baseUrl,city,callBack){
	var t = codeselect(city);
	$.ajax({
		url: baseUrl+city+"&t="+t[0]+"&c="+t[1],
		type: 'GET',
		dataType: 'jsonp',
		jsonp: "_jsonp",
		jsonpCallback: callBack
	});
};


var weather = function(container){
	this.containerClass = 'weather-container';
	this.titleContainer = $('<div class="weather-title horizontal-borderex borderex-position-bottom"></div>');
	this.iconContainer = $('<div class="weather-icon-container"></div>');
	this.otherInfoContainer = $('<div class="weather-otherInfo-container"></div>');
	this.place = $('<div class="weather-place"></div>');
	this.date = $('<div class="weather-date"></div>');
	this.bodyContainer = $('<div class="weather-body"></div>');
	this.stateConatiner = $('<div class="weather-state-container"></div>');
	this.state = $('<span class="weather-state"></span>');
	this.lTemperature = $('<span class="weather-temperature-range"></span>');
	this.hTemperature = $('<span class="weather-temperature-range"></span>');
	this.wind = $('<span class="weather-wind"></span>');
	this.humidity = $('<span class="weather-humidity"></span>');
	this.temperature = $('<span class="weather-temperature"></span>');
	this.temperatureContainer = $('<div class="weather-temperature-container"><i class="temperature-unit ficon-exclamdown"></i></div>');
	this.temperatureContainer.prepend(this.temperature);
	this.windContainer = $('<div class="weather-expand-item"><i class="ficon-comma"></i></div>');
	this.humidityContainer = $('<div class="weather-expand-item"><i class="ficon-droplet"></i></div>');
	this.windContainer.append(this.wind);
	this.humidityContainer.append(this.humidity);

	this.weatherData = {
		LTemperature : '0',
		HTemperature : '0',
		temperature : '0',
		wind : 'nowind',
		place : 'nowhere',
		date : WEEKCODE['1'][slang] + '，' + MONTHCODE['3'][slang] + '30' + DATECODE[slang],
		weatherCode: '0',
		weatherText: $.proxy(function(){
			return WEATHERCODE[this.weatherData.weatherCode][slang];
		},this)
	};

	this.recentWeatherData = [];
	this.RECENT = 4;

	var _this = this;

	for(var h = 0; h < _this.RECENT; h++){
		_this.recentWeatherData[h] = {
			date : '2015-08-14',
			LTemperature : '10',
			HTemperature : '25',
			weatherCode : '0',
			week: WEEKCODE[h.toString()][slang]
		}
	}

	this.recentWeatherItems = [];
	this.recentWeatherContainer = $('<div id="recent_weather_Container" class="weather-bottom"></div>');
	
	for(var j = 0; j < _this.RECENT; j++){
		_this.recentWeatherItems[j] = {};
		_this.recentWeatherItems[j].week = $('<div class="recent-week"></div>');
		_this.recentWeatherItems[j].weatherIcon = $('<div class="recent-weather-icon-container"></div>');
		_this.recentWeatherItems[j].temperatureRange = $('<div class="recent-temperature-range"></div>');
		_this.recentWeatherItems[j].itemContainer = $('<div class="recent-item vertical-borderex"></div>');
		if(j == 0){
			_this.recentWeatherItems[j].itemContainer.removeClass('vertical-borderex');
		};
		_this.recentWeatherItems[j].itemContainer.append(_this.recentWeatherItems[j].week,_this.recentWeatherItems[j].weatherIcon,_this.recentWeatherItems[j].temperatureRange);
		_this.recentWeatherContainer.append(_this.recentWeatherItems[j].itemContainer);
	};

	if(container && typeof(container) == 'string'){
		this.containerSelector = container;
	}else{
		this.containerSelector = 'body';
	};

	this.container = null;
	this.cityCode = getCityCode('海淀','北京');
}

weather.prototype = {
	updateWeatherData: function(data){
		var unixtime =  data.realtime.dataUptime;
		var now = new Date(unixtime* 1000);
		var nowD = 'day';
		if(now.getHours() > 18 || now.getHours() < 6){
			nowD = 'night';
		}
		var LT = parseInt(data.weather[0].info['night'][2]);
		var HT = parseInt(data.weather[0].info['day'][2]);
		var T = parseInt(data.realtime.weather.temperature);
		if(LT > HT){
			var tmpT = LT;
			LT = HT;
			HT = tmpT;
		}
		if(T > HT){
			HT = T;
		};
		if(T < LT){
			LT = T;
		};
		this.weatherData.now = nowD;
		this.weatherData.LTemperature = LT.toString();
		this.weatherData.HTemperature = HT.toString();
		if(data.area[1][0] == data.area[2][0]){
			this.weatherData.place = data.area[2][0];
		}else{
			this.weatherData.place = data.area[1][0] + "，" + data.area[2][0];
		}
		this.weatherData.date = WEEKCODE[now.getDay().toString()][slang] + "，" + MONTHCODE[now.getMonth().toString()][slang] + now.getDate() + DATECODE[slang];
		this.weatherData.weatherCode = data.realtime.weather.img;
		this.weatherData.temperature = data.realtime.weather.temperature;
		this.weatherData.wind = data.realtime.wind.direct + " " + data.realtime.wind.power;
		this.weatherData.humidity = data.realtime.weather.humidity + " %";

		var _this = this;

		for(var i = 1; i <= _this.RECENT; i++){
			var _LT = '--';
			var _HT = '--';
			if(data.weather[i].info['day']){
				_LT = parseInt(data.weather[i].info['day'][2]);
			}
			if(data.weather[i].info['night']){
				_HT = parseInt(data.weather[i].info['night'][2]);
			}
			
			if(_LT > _HT){
				var _tmpT = _LT;
				_LT = _HT;
				_HT = _tmpT;
			};
			var _week = now.getDay() + i;
			if(_week > 6){
				_week = _week - 7;
			};
			_this.recentWeatherData[i-1].date = data.weather[i].date;
			_this.recentWeatherData[i-1].LTemperature = _LT.toString();
			_this.recentWeatherData[i-1].HTemperature = _HT.toString();
			_this.recentWeatherData[i-1].weatherCode = data.weather[i].info['day'] ? data.weather[i].info['day'][0] : '0';
			_this.recentWeatherData[i-1].week = WEEKCODE[_week.toString()][slang];
		};
	},
	render: function(){
		if(this.container == null){
			this.container = $(this.containerSelector);
			this.container.addClass(this.containerClass);
			this.container.append(this.bodyContainer);
			this.container.append(this.titleContainer);
			this.container.append(this.stateConatiner);
			this.bodyContainer.append(this.temperatureContainer,this.windContainer,this.humidityContainer);
			this.stateConatiner.append(this.state,this.lTemperature,'<span> - </span>',this.hTemperature,'<span class="weather-range-unit"><i class="ficon-guilsinglright"></i></span>');
			this.titleContainer.append(this.iconContainer);
			this.titleContainer.append(this.otherInfoContainer);
			this.otherInfoContainer.append(this.place);
			this.otherInfoContainer.append(this.date);
			this.container.after(this.recentWeatherContainer);
		}
		var weatherIconDom = "<ul class='weather-icon'>";
		var iconClasses = WEATHERICONCODE[this.weatherData.weatherCode][this.weatherData.now];
		for(var _i = 0; _i < iconClasses.length; _i++){
			weatherIconDom += "<li class='" + iconClasses[_i] + "'></li>";
		}
		weatherIconDom += "</ul>";
		this.iconContainer.html(weatherIconDom);
		this.place.text(this.weatherData.place);	
		this.date.text(this.weatherData.date);
		this.state.text(this.weatherData.weatherText);
		this.lTemperature.text(this.weatherData.LTemperature);
		this.hTemperature.text(this.weatherData.HTemperature);
		this.wind.text(this.weatherData.wind);
		this.humidity.text(this.weatherData.humidity);
		this.temperature.text(this.weatherData.temperature);

		var _this = this;
		for(var _j = 0; _j < _this.RECENT; _j++){
			var _weatherIconDom = '<ul class="recent-weather-icon">';
			var _iconClasses = WEATHERICONCODE[_this.recentWeatherData[_j].weatherCode]['day'];
			for(var _h = 0; _h < _iconClasses.length; _h++){
				_weatherIconDom += "<li class='" + _iconClasses[_h] + "'></li>";
			};
			_weatherIconDom += "</ul>";
			_this.recentWeatherItems[_j].weatherIcon.html(_weatherIconDom);
			_this.recentWeatherItems[_j].weatherIcon.prepend('<span class="recent-weather-state">'+ WEATHERCODE[_this.recentWeatherData[_j].weatherCode][slang] +'</span>')
			_this.recentWeatherItems[_j].week.text(_this.recentWeatherData[_j].week);
			_this.recentWeatherItems[_j].temperatureRange.text(_this.recentWeatherData[_j].LTemperature + ' - ' + _this.recentWeatherData[_j].HTemperature);
		}
	},
	getPosition: function(){
		if(navigator.geolocation){
			navigator.geolocation.getCurrentPosition(this._getPositionData,this._onGetDataError);
			// UI更新；
		}else{
			// UI更新；
		}
	},
	_getPositionData: function(data){
		var _lat = data.coords.latitude;
		var _lng = data.coords.longitude;
		getGeoInfo(_lat,_lng,'setGeoData');
	},
	_onGetDataError: function(err){
		switch(err.code) {
            case err.TIMEOUT:
                if(console){
                	console.info('请求地理位置超时');
                }
                break;
            case err.PERMISSION_DENIED:
                if(console){
                	console.info('获取地理位置被拒绝');	
                }
                break;
            case err.POSITION_UNAVAILABLE:
                if(console){
                	console.info('位置不能确定');	
                }
                break;
            default:
            	if(console){
            		console.info('未知错误');
            	};
            	break;
        }
	}
}













