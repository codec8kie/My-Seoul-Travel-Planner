// JavaScript Document

// on 최소화
function on (e, n, f){
	return $(document).on(e, n, f);
}


var app = {
	vars: {
		planListArr: []
	},
	theTodayDate: function (){
		var t = new Date();

		var weekend = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
		var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

		var year = t.getFullYear();
		var month = t.getMonth()+1;
		var date = t.getDate();
		var plusDate = "th";
		var day = t.getDay();

		var allData = year + "-" + month + "-" + date;
		$(".header").attr("data-date", allData);

		switch (date){
			case 1: plusDate = "st"; break;
			case 2: plusDate = "nd"; break;
			case 3: plusDate = "rd"; break;
		};

		// 년월 표시
		$(".header .year").text(year + " " + months[month-1]);

		// 일 표시
		$(".header .today").text(date + plusDate);

		// 요일 표시
		$(".header .week").text(weekend[day]);
	},
	appendlistInput: function (value){
		var inputCount = $("#form-list > form > div:first > input").length;
		if (value == "+"){
			var input = $("<input/>", {type: "text", placeholder: "리스트" + (inputCount + 1)});
			$("#form-list > form > div:first").append(input);
		}else {
			if (inputCount-1 < 3) alert("3개 미만의 리스트로 피해입은 불이익은 사용자의 과실입니다.");
			$("#form-list > form > div:first > input:last").remove();
		};
	},
	appendToListPlan: function (arr){
		// 계획 리스트 초기화
		$(".column-schedule").html("");

		$.each(arr, function (i, self){
			var className = self.title+self.text;

			// HTML 만들기
			var parentDiv = $("<div/>", {class: "card shadow " + className.replace(/ /gi, '')});
			var titleDiv = $("<div/>", {class: "tag "+self.backgroundColor, text: self.title});
			var areaDiv = $("<div/>", {class: "area"});
			var dateDiv = $("<div/>", {class: "date", text: self.sdate + "|" + self.time1 + ":" + self.time2});
			var contentDiv = $("<div/>", {class: "content", text: self.text});
			var contentUl = $("<ul/>", {});
			$.each(self.list, function (j, mine){
				var contentLi = $("<li/>", {text: mine});
				contentUl.append(contentLi);
			});

			var placeDiv = $("<div/>", {class: "place"});
			var placeDivDiv = $("<div/>", {});
			var placeDivDivPlace = $("<div/>", {text: self.place});
			var placeDivDivOpt = $("<div/>", {text: self.optGroup});
			var placeDivSecondDiv = $("<div/>", {});
			var placeDivSecondDivImg = $("<img/>", {src: "image/" + self.image, alt: self.place, title: self.place});

			contentDiv.append(contentUl);

			placeDivDiv.append(placeDivDivPlace).append(placeDivDivOpt);
			placeDivSecondDiv.append(placeDivSecondDivImg);
			placeDiv.append(placeDivDiv).append(placeDivSecondDiv);

			areaDiv.append(dateDiv).append(contentDiv).append(placeDiv);

			parentDiv.append(titleDiv).append(areaDiv);

			// 최종
			$(".column-schedule").append(parentDiv);
		});
	},
	appendToTimeLine: function (arr){
		// 타임라인 초기화
		$(".schedule").html("");

		arr.sort(function (a, b){
			a = a.sdate + " " + a.time1 + ":" + a.time2;
			b = b.sdate + " " + b.time1 + ":" + b.time2;
			return a > b ? 1 : a < b ? -1 : -1;
			// if (a > b){
			// 	return 1;
			// };
			// if (a < b){
			// 	return -1;
			// };
			// if (a == b){
			// 	return 0;
			// };
		});

		$.each(arr, function (i, self){
			var className = self.title+self.text;

			var parentDiv = $("<div/>", {});
			var cardDiv = $("<div/>", {class: "card shadow", "data-class": className.replace(/ /gi, '')});
			var timeDiv = $("<div/>", {class: "time", text: self.sdate + "|" + self.time1 + ":" + self.time2});
			var strP = $("<p/>", {class: "str", text: self.title + "(" + self.place + ")"});

			cardDiv.append(timeDiv).append(strP);
			parentDiv.append(cardDiv);

			$(".schedule").append(parentDiv);
		});
	},
	modalInButtons: function (){
		on("click", "#form-dialog button", function (e){
			var val = $(this).text();
			switch (val){
				case "리스트 작성": $("#form-list").show("fade", 300); break;
				case "기록":
					// check
					var all_msg = "";
					$(this).closest("form").find("input, textarea").each(function (i, self){
						var val = $(self).val();
						if (!val){
							all_msg += "[" + $(self).attr("title") + "]을(를) 입력해주세요.\n";
						};
					});

					if (all_msg){
						alert(all_msg);
						return false;
					};

					// 계획 등록
					var title = $("#title").val();
					var place = $("#place").val();
					var image = "";
					var optGroup = "";
					$("#place option").each(function (i, self){
						if ($(self).is(":selected") == true){
							image = $(self).data("image");
							optGroup = $(self).closest("optgroup").attr("label");
						};
					});
					var sdate = $("#sdate").val();
					var time1 = $("#time").val();
					var time2 = $("#time2").val();
					var text = $("#text").val();
					var list = [];
					$(".list-check li").each(function (i, self){
						list.push($(self).text());
					});

					backgroundColor = ["tomato", "blue", "red", "yellow", "orange"];
					var index = Math.floor(5 * Math.random());

					var obj = {
						backgroundColor: backgroundColor[index],
						title: title,
						optGroup: optGroup,
						place: place,
						image: image,
						sdate: sdate,
						time1: time1,
						time2: time2,
						text: text,
						list: list
					};

					app.vars.planListArr.push(obj);

					// 리스트에 계획 추가하기
					app.appendToListPlan(app.vars.planListArr);
					// 타임라인에 추가
					app.appendToTimeLine(app.vars.planListArr);
					// 로컬에 저장
					localStorage.setItem("planListArr", JSON.stringify(app.vars.planListArr));

					$("#form-list").hide("fade", 300, function (){
						$("#form-dialog").hide("fade", 300, function (){
							$(".modal").hide("fade", 300);

							// form 초기화
							$("#form-dialog form")[0].reset();
							$("#form-list form")[0].reset();

							// list 초기화
							$(".list-check").html("");
						});
					});
					break;
				case "닫기":
					$("#form-list").hide("fade", 300, function (){
						$("#form-dialog").hide("fade", 300, function (){
							$(".modal").hide("fade", 300);

							// form 초기화
							$("#form-dialog form")[0].reset();
							$("#form-list form")[0].reset();
						});
					});
					break;
			};
		});

		// write list in button
		on("click", "#form-list button", function (e){
			var val = $(this).text();
			switch (val){
				case "확인":
					var inputCount = $("#form-list > form > div:first > input").length;
					if (inputCount < 3) alert("3개 미만의 리스트로 피해입은 불이익은 사용자의 과실입니다.");
					$("#form-list").hide("fade", 300, function (){
						alert("리스트가 작성되었습니다.");
						$(".list-check").html("");
						$("#form-list > form > div:first > input").each(function (i, self){
							var listValue = $(self).val();
							var ul = $("<ul/>", {style: "padding-left: 20px;"});
							var li = $("<li/>", {text: listValue, style: "list-style: circle;"});
							ul.append(li);
							$(".list-check").append(ul);
						});
					});
					break;
				case "취소":
					$("#form-list").hide("fade", 300, function (){
						$(".list-check").html(""); // 리스트 초기화
						$("#form-list form")[0].reset(); // form 초기화
						$("#form-list > form > div:first > input").each(function (i, self){
							if (i > 2){
								$(self).remove();
							};
						});
					});
					break;
				// + -
				default: app.appendlistInput(val); break;
			};
		});
	},
	useJqueryUI: function (){
		// 관광할 날짜
		$("#sdate").datepicker({
			dateFormat: "yy-mm-dd",
			minDate: 0
		});
	},
	printXmlData: function (arr){
		// 초기화
		$("#place").html("");

		$.each(arr, function (i, self){
			var optgroup = $("<optgroup/>", {label: self.name});
			$.each(self.titles, function (j, mine){
				var option = $("<option/>", {text: mine, value: mine, "data-image": self.images[j]});
				optgroup.append(option);
			});

			$("#place").append(optgroup);
		});
	},
	loadToXmlFile: function (){
		$.ajax({
			data: "GET",
			dataType: "xml",
			url: "http://127.0.0.1/data/place.xml",
			success: function (data){
				var selectBoxValue = [];

				var xml = $(data).find("type");
				$.each(xml, function (i, self){
					var name = $(self).attr("name");
					
					var title = [];
					var image = [];
					$.each($(self).find("data"), function (j, mine){
						title.push($(mine).find("title").text());
						image.push($(mine).find("image").text());
					});

					var obj = {
						name: name,
						titles: title,
						images: image
					};

					selectBoxValue.push(obj);
				});

				// 추출한 xml 데이터로 출력하기
				app.printXmlData(selectBoxValue);
			}
		});
	},
	searchToList: function (){
		var searchArr = [];
		on("keyup", "#search", function (e){
			// 초기화
			searchArr = [];
			$(".schedule").html("");
			$(".column-schedule").html("");

			var keyword = $(this).val().trim();
			if (keyword){
				$.each(JSON.parse(localStorage.getItem("planListArr")), function (i, self){
					var searchChkTitle = self.title.indexOf(keyword);
					var searchChkTime1 = self.time1.indexOf(keyword);
					var searchChkTime2 = self.time2.indexOf(keyword);
					var searchChkText = self.text.indexOf(keyword);
					var searchChkPlace = self.place.indexOf(keyword);

					if (searchChkTitle > -1 || searchChkTime1 > -1 || searchChkTime2 > -1 || searchChkText > -1 || searchChkPlace > -1){
						searchArr.push(self);
					};
				});

				// 리스트에 계획 추가하기
				app.appendToListPlan(searchArr);
				// 타임라인에 추가
				app.appendToTimeLine(searchArr);

				// 검색어 하이라트 부분
				$(".card:contains('"+keyword+"')").each(function (i, self){
					var regex = new RegExp(keyword, 'gi');
					$(self).html($(self).html().replace(regex, "<mark>"+keyword+"</mark>"));
				});
			}else {
				$.each(JSON.parse(localStorage.getItem("planListArr")), function (i, self){
					searchArr.push(self);
				});

				// 리스트에 계획 추가하기
				app.appendToListPlan(searchArr);
				// 타임라인에 추가
				app.appendToTimeLine(searchArr);
			};
		});
	},
	getLocalStorage: function (){
		// plan
		var planListArr = JSON.parse(localStorage.getItem("planListArr"));
		if (planListArr){
			// 리스트에 계획 추가하기
			app.appendToListPlan(planListArr);
			// 타임라인에 추가
			app.appendToTimeLine(planListArr);
		};
	},
	init: function (){
		// get localStorage
		app.getLocalStorage();

		// 좌측상단에 시간 나타내기
		app.theTodayDate();

		// jQuery UI
		app.useJqueryUI();

		// load to xml
		app.loadToXmlFile();

		// + 버튼 클릭 시
		on("click", "#createBtn", function (e){
			$(".modal").show("fade", 300, function (e){
				$(".createForm").show("fade", 300);
			});
		});

		// 타임라인 HOVER
		on("mouseover", ".schedule .card", function (e){
			var dclass = $(this).data("class");
			$(".column-schedule").find("."+dclass).css("background-color", "yellow");
			on("mouseout", this, function (e){
				$(".column-schedule").find("."+dclass).css("background-color", "white");
			});
		});

		// modal 안의 버튼 정의
		app.modalInButtons();

		// 검색
		app.searchToList();

		// 어플리케이션 날짜 변경
		on("click", ".today, .week, .year", function (e){
			$(".modal").datepicker({
				dateFormat: "yy-mm-dd",
				onSelect: function (data){
					$(".header").attr("data-date", data);

					var t = new Date(data);

					var weekend = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
					var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

					var year = t.getFullYear();
					var month = t.getMonth()+1;
					var date = t.getDate();
					var plusDate = "th";
					var day = t.getDay();

					switch (date){
						case 1: plusDate = "st"; break;
						case 2: plusDate = "nd"; break;
						case 3: plusDate = "rd"; break;
					};

					// 년월 표시
					$(".header .year").text(year + " " + months[month-1]);

					// 일 표시
					$(".header .today").text(date + plusDate);

					// 요일 표시
					$(".header .week").text(weekend[day]);

					$(".ui-datepicker").hide("fade", 300, function (){
						$(".modal").hide("fade", 300);					
					});
				},
			});
			$(".modal").show("fade", 300, function (){
				$(".ui-datepicker").show("fade", 300);					
			});
		});

		// 전체, 당일 검색
		on("change", "input[type=radio]", function (e){
			var searchArr = [];
			var thisVal = $(this).val();
			var selectDate = $(".header").data("date");
			if (thisVal == 2){
				$.each(JSON.parse(localStorage.getItem("planListArr")), function (i, self){
					if (self.sdate == selectDate){
						searchArr.push(self);
					};
				});

				// 리스트에 계획 추가하기
				app.appendToListPlan(searchArr);
				// 타임라인에 추가
				app.appendToTimeLine(searchArr);
			}else {
				// 리스트에 계획 추가하기
				app.appendToListPlan(JSON.parse(localStorage.getItem("planListArr")));
				// 타임라인에 추가
				app.appendToTimeLine(JSON.parse(localStorage.getItem("planListArr")));
			};
		});
	}
};

window.onload = function (e){
	app.init();
};