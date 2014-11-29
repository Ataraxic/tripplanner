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
      if (list[i].innerHTML===selectedName) {
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
      zoom: 16,
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
    return {map: map,markerArr:markerArr};
  } // initialize_gmaps ends here!
  function setAllMap(mapObject) {
    for (var i = 0; i < mapObject.markerArr.length; i++) {
      mapObject.markerArr[i].setMap(mapObject.map);
    }
  }

  // function showOneMarkerType(marker,type){
  //   var flag = true;
  //   for (var n=0;n<markerArr.length;n++){
  //     if (markerArr[n].type===type){
  //       if (markerArr[n].name===marker.name && flag){
  //         markerArr[n].setMap(map);
  //         flag = false;
  //       } else {
  //         markerArr[n].setMap(null);
  //       }
  //     }
  //   }
  // }
  function inMarkerArr(selectedName,markerArr){
    for (var i=0;i<markerArr.length;i++){
      if (markerArr[i].name===selectedName){
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
          type: type
        });
        mapObject.markerArr.push(marker);
        break;
      }
    }
  }
  var mapObject=initialize_gmaps();

  $("#addThings").on("click",function(){
    var selectedName = $("#activities_dropdown option:selected").val();
    if (!inList("activities",selectedName)){
      $("#activities  > ul").append("<li>"+selectedName+"</li>");
      if (!inMarkerArr(selectedName,mapObject.markerArr)){
        addMarker(all_things_to_do,selectedName,mapObject,"activity");
      }
    }
  });

  $("#addFood").on("click",function(){
    var selectedName = $("#food_dropdown option:selected").val();
    console.table(all_restaurants);
    if (!inList("food",selectedName)){
      $("#food > ul").append("<li>"+selectedName+"</li>");
      if (!inMarkerArr(selectedName,mapObject.markerArr)){
        addMarker(all_restaurants,selectedName,mapObject,"restaurant");
      }
    }
  });

  $("#addHotel").on("click",function(){
    var selectedName = $("#hotel_dropdown option:selected").val();
    if (!inList("singleHotel",selectedName)){
      $("#singleHotel > ul").replaceWith("<ul><li>"+selectedName+"</li></ul>");
      if (!inMarkerArr(selectedName,mapObject.markerArr)){
        addMarker(all_hotels,selectedName,mapObject,"hotel");
      }
    }
  });
});
