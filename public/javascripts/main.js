$(function(){
  var hotelPlace=$("#hotel_dropdown");
  var activityPlace=$("#activities_dropdown");
  var foodPlace=$("#food_dropdown");

  for (var i=0;i<all_hotels.length;i++){
    var hotel = "<option>"+all_hotels[i].name+"</option>";
    hotelPlace.append(hotel);
  }

  for (i=0;i<all_restaurants.length;i++){
    var food = "<option>"+all_restaurants[i].name+"</option>";
    foodPlace.append(food);
  }

  for (i=0;i<all_things_to_do.length;i++){
    var things = "<option>"+all_things_to_do[i].name+"</option>";
    activityPlace.append(things);
  }

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

  // function addMarker(dataObj,selectedName,boolDeleteOthers){
  //   for (var i=0;i<all_hotels.length;i++){
  //     if (all_hotels[i].name===selectedName){
  //       var lat = all_hotels[i].place[0].location[0];
  //       var lng = all_hotels[i].place[0].location[1];
  //       var latLng = new google.maps.LatLng(lat,lng);
  //       var marker = new google.maps.Marker({
  //         position: latLng,
  //         map: map,
  //         title: all_hotels[i].name
  //       });
  //       markerArr.push(markerArr);
  //       break;
  //     }
  //   }
  // }



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
    markerArr.push(marker);
    // Add the marker to the map by calling setMap()
    function setAllMap(map) {
      for (var i = 0; i < markerArr.length; i++) {
        markerArr[i].setMap(map);
      }
    }

    setAllMap(map);

    function showOneMarker(marker,type){
      for (var n=0;n<markerArr.length;n++){
        if (markerArr[n].type===type){
          if (markerArr[n].name===marker.name){
            markerArr[n].setMap(map);
          } else {
            markerArr[n].setMap(null);
          }
        }
      }
    }

    function addMarker(dataObj,selectedName,type){
      for (var i=0;i<dataObj.length;i++){
        if (dataObj[i].name===selectedName){
          var lat = dataObj[i].place[0].location[0];
          var lng = dataObj[i].place[0].location[1];
          var latLng = new google.maps.LatLng(lat,lng);
          var marker = new google.maps.Marker({
            position: latLng,
            map: map,
            title: dataObj[i].name,
            type: type
          });
          markerArr.push(marker);
          break;
        }
      }
    }

    $("#addThings").on("click",function(){
      var selectedName = $("#activities_dropdown option:selected").val();
      if (!inList("activities",selectedName)){
        $("#activities  > ul").append("<li>"+selectedName+"</li>");
        addMarker(all_things_to_do,selectedName,"activity");
      }
    });

    $("#addFood").on("click",function(){
      var selectedName = $("#food_dropdown option:selected").val();
      console.table(all_restaurants);
      if (!inList("food",selectedName)){
        $("#food > ul").append("<li>"+selectedName+"</li>");
        addMarker(all_restaurants,selectedName,"restaurant");
      }
    });

    $("#addHotel").on("click",function(){
      var selectedName = $("#hotel_dropdown option:selected").val();
      if (!inList("singleHotel",selectedName)){
        $("#singleHotel > ul").replaceWith("<ul><li>"+selectedName+"</li></ul>");
        addMarker(all_hotels,selectedName,"hotel");
      }
    });

  } //initialize_gmaps ENDS

  $(document).ready(function() {
    initialize_gmaps();
  });

});
