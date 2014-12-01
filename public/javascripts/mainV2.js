$(function(){

  function initialize_dropdown(){
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
  }
  initialize_dropdown();


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
  var mapObject=initialize_gmaps(); // Return the mapObject which contains all map info and marker Array;

  function initRemoveButton(){
    if ($("#listArea a")[0]) { //Checks if it's a new page with no links. Not completely necessary.
      var anchorObj = $("#"+elem);

    }
  }

});
