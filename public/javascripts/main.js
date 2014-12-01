$(function(){

  var hotelPlace=$("#hotel_dropdown");
  var activityPlace=$("#activities_dropdown");
  var foodPlace=$("#food_dropdown");

  function addList2HTML(place2Add,dataObj){
    for (var i=0;i<dataObj.length;i++){
      var item ="<option>"+dataObj[i].name+"</option>";
      place2Add.append(item);
    }
  }

  addList2HTML(hotelPlace,all_hotels);
  addList2HTML(activityPlace,all_things_to_do);
  addList2HTML(foodPlace,all_restaurants);

  function inList(id,selectedName){
    var list =$("#"+id+" li");
    list = $.makeArray(list);
    for (var i=0; i<list.length; i++) {
      if (list[i].childNodes[0].data===selectedName) {
        return true;
      }
    }
    return false;
  }

  function initialize_gmaps() {
    // initialize new google maps LatLng object
    var myLatlng = new google.maps.LatLng(40.705786,-74.007672);

    // set the map options hash
    var mapOptions = {
      center: myLatlng,
      zoom: 12,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    // get the maps div's HTML obj
    var map_canvas_obj = document.getElementById("map-canvas");

    // initialize a new Google Map with the options
    var map = new google.maps.Map(map_canvas_obj, mapOptions);

    // Add the marker to the map
    var markerArr = [];
    var marker = new google.maps.Marker({
      position: myLatlng,
      title:"Hello World!",
      type: "Home"
    });
    marker.setMap(map);
    markerArr.push(marker);
    return {map: map, markerArr:markerArr};
  } // initialize_gmaps ends here!


  var mapObject=initialize_gmaps();


  function setAllMap(value) {
    for (var i = 0; i < mapObject.markerArr.length; i++) {
      mapObject.markerArr[i].setMap(value);
    }
  }

  /* jshint multistr: true */
  var dayTemplate = function (day){
    this.day=day;
    this.innerHTML = "<h3>Plan for Day "+day+"</h3> \
    <ul><li id='singleHotel'>Hotel \
    <ul></ul></li><li id='activities'>Things To Do<ul></ul> \
    </li><li id='food'>Restaurants<ul></ul></li></ul>";
  };
  var dayArr = [];
  function gen3Day(){
    for (var i=1;i<=3;i++){
      dayArr.push(new dayTemplate(i));
    }
  }
  gen3Day();

  var day=3;
  var currentDay = 1;
  $("#leftbut > button").on("click",function(){
    day++;
    $("#leftbut > div").append("<button type='button' class='btn btn-default btn-sm'>Day"+day+"</button>");
    pickDay();
    dayArr.push(new dayTemplate(day));
  });



  function pickDay(){
    $("#btnGroup button").on("click",function(){     // Set Event Handler
      var listHTML = $("#listArea");
      var newDay=this.innerHTML.slice(-1);
      currentDay=parseInt(newDay);
      var oldDay=listHTML[0].children[0].innerHTML.slice(-1);
      dayArr[oldDay-1].innerHTML=listHTML[0].innerHTML;    // Save day HTML
      listHTML.html(dayArr[newDay-1].innerHTML);// Load New Day
      if ($("#listArea a")[0]){
        anchorIDArr.forEach(function(elem){
          var anchorObj = $("#"+elem);
            anchorObj.on("click",function(){
              var selectedName = anchorObj.parent()[0].outerText;
              removeMarker(mapObject,selectedName.slice(0,-1));
              anchorObj.off(); // Unsure if needed. Do on events persist after the element has been removed?
              anchorObj.parent().remove();
              anchorObj.remove();
          });
        });
      } // Adding ability to remove markers and list items
      showCurrentMarkers();// Hide Old Markers
      // Show New Markers
    });
  }
  pickDay();

  function showCurrentMarkers(){
    var map = mapObject.map;
    var markers= mapObject.markerArr;
    markers.forEach(function(elem){
      if (elem.day===parseInt(currentDay)){
        elem.setMap(map);
      } else {
        elem.setMap(null);
      }
    });
  }


  function inMarkerArr(selectedName,markerArr){
    for (var i=0;i<markerArr.length;i++){
      if (markerArr[i].title===selectedName && markerArr[i].day===parseInt(currentDay)){
        return true;
      }
    }
    return false;
  }

  function addMarker(dataObj,selectedName,mapObject,type){
    for (var i=0;i<dataObj.length;i++){
      if (dataObj[i].name===selectedName){
        var lat = dataObj[i].place[0].location[0];
        var lng = dataObj[i].place[0].location[1];
        var latLng = new google.maps.LatLng(lat,lng);
        var marker = new google.maps.Marker({
          position: latLng,
          map: mapObject.map,
          title: dataObj[i].name,
          type: type,
          day: currentDay
        });
        mapObject.markerArr.push(marker);
        break;
      }
    }
  }
  function removeMarker(mapObject,selectedName){
    var markerArr = mapObject.markerArr;
    var map = mapObject.map;
    for (var i=0;i<markerArr.length;i++){
      if (markerArr[i].title===selectedName){
        markerArr[i].setMap(null);
        break;
      }
    }
  }
  function showMarker(mapObject,selectedName){
    var markerArr = mapObject.markerArr;
    var map = mapObject.map;
    for (var i=0;i<markerArr.length;i++){
      if (markerArr[i].title===selectedName){
        markerArr[i].setMap(map);
        break;
      }
    }
  }



  var anchorIDArr = [];
  function initListnMaps(dataObj,addID,dropID,typeID,listID,mapObject,lengthLimit){
    $("#"+addID).on("click",function(){ //Event Handler for Primary Add Buttons
      var selectedName = $("#"+dropID+" option:selected").val(); //Name of selected Item
      var anchorID = selectedName.replace(/\s|,|&|\'/g,"_"); //Generates Id from selected Item
      if ($.inArray(anchorID,anchorIDArr)===-1){
        anchorIDArr.push(anchorID);
      }
      if (!inList(listID,selectedName) && $('#'+listID+' li').length<lengthLimit){ // Makes sure item is not already in list, and not exceeding max #
        $("#"+listID+" > ul").append("<li>"+selectedName+"<a class=close id="+anchorID+">X</a>"+"</li>"); //Adds HTML
        var anchorObj = $('#'+anchorID); // Saves JQuery for "X" button
          anchorObj.on("click",function(){
            anchorObj.off(); // Unsure if needed. Do on events persist after the element has been removed?
            anchorObj.parent().remove();
            anchorObj.remove();
            removeMarker(mapObject,selectedName);
        });
        if (!inMarkerArr(selectedName,mapObject.markerArr)){
          addMarker(dataObj,selectedName,mapObject,typeID);
          showMarker(mapObject,selectedName);
        } else {
          showMarker(mapObject,selectedName);
        }
      }
    });
  }

  initListnMaps(all_things_to_do,"addThings","activities_dropdown","activity","activities",mapObject,30);
  initListnMaps(all_restaurants,"addFood","food_dropdown","restaurant","food",mapObject,3);
  initListnMaps(all_hotels,"addHotel","hotel_dropdown","hotel","singleHotel",mapObject,1);

});
