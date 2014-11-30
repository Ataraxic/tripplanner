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
      // console.log(list[i].childNodes[0].data,"diff",selectedName);
      if (list[i].childNodes[0].data===selectedName) {
        // console.log("true",list[i].innerHTML,selectedName);
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
  function setAllMap(mapObject) {
    for (var i = 0; i < mapObject.markerArr.length; i++) {
      mapObject.markerArr[i].setMap(mapObject.map);
    }
  }

  function showOneMarkerType(mapObject,selectedName,type){
    var markerArr = mapObject.markerArr;
    var map = mapObject.map;
    for (var n=0;n<markerArr.length;n++){
      if (arguments.length===3){
        var typematch = (markerArr[n].type===type);
      } else {
        var typematch=true;
      }
      if (typematch){
        if (markerArr[n].title===selectedName){
          markerArr[n].setMap(map);
        } else {
          markerArr[n].setMap(null);
        }
      }
    }
  }
  function inMarkerArr(selectedName,markerArr){
    for (var i=0;i<markerArr.length;i++){
      console.log("in marker array?",markerArr[i].title,selectedName);
      if (markerArr[i].title===selectedName){
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



  var mapObject=initialize_gmaps();

  function initListnMaps(dataObj,addID,dropID,typeID,listID,mapObject,lengthLimit){
    $("#"+addID).on("click",function(){ //Event Handler for Primary Add Buttons
      var selectedName = $("#"+dropID+" option:selected").val(); //Name of selected Item
      var anchorID = selectedName.replace(/\s|,|&|\'/g,"_"); //Generates Id from selected Item
      if (!inList(listID,selectedName) && $('#'+listID+' li').length<lengthLimit){ // Makes sure item is not already in list, and not exceeding max #
        $("#"+listID+" > ul").append("<li>"+selectedName+"<a class=close id="+anchorID+">X</a>"+"</li>"); //Adds HTML
        var anchorObj = $('#'+anchorID); // Saves JQuery for "X" button
          anchorObj.on("click",function(){
            anchorObj.off(); // Unsure if needed. Do on events persist after the element has been removed?
            anchorObj.parent().remove();
            anchorObj.remove();
        });
        if (!inMarkerArr(selectedName,mapObject.markerArr)){
          console.log("hotel adding");
          addMarker(dataObj,selectedName,mapObject,typeID);
          if (typeID==="hotel"){
            showOneMarkerType(mapObject,selectedName,typeID);
          }
        } else {
          console.log("not added");
          showOneMarkerType(mapObject,selectedName);
        }
      }
    });
  }

  initListnMaps(all_things_to_do,"addThings","activities_dropdown","activity","activities",mapObject,30);
  initListnMaps(all_restaurants,"addFood","food_dropdown","restaurant","food",mapObject,3);
  initListnMaps(all_hotels,"addHotel","hotel_dropdown","hotel","singleHotel",mapObject,1);

  //
  // $("#addThings").on("click",function(){
  //   var selectedName = $("#activities_dropdown option:selected").val();
  //   var anchorID = selectedName.replace(/\s|,|&/g,"_");
  //   if (!inList("activities",selectedName)){
  //     $("#activities > ul").append("<li>"+selectedName+"<a class=close id="+anchorID+">×</a>"+"</li>");
  //     $(('#'+anchorID)).on("click",function(){
  //       $(('#'+anchorID)).off();
  //       $(('#'+anchorID)).parent().remove();
  //       $(('#'+anchorID)).remove();
  //     });
  //     if (!inMarkerArr(selectedName,mapObject.markerArr)){
  //       addMarker(all_things_to_do,selectedName,mapObject,"activity");
  //     } else {
  //       showOneMarkerType(mapObject,selectedName);
  //     }
  //   }
  // });
  //
  // $("#addFood").on("click",function(){
  //   var selectedName = $("#food_dropdown option:selected").val();
  //   var anchorID = selectedName.replace(/\s|,|&/g,"_");
  //   if (!inList("food",selectedName) && $('#food li').length<3){
  //     $("#food > ul").append("<li>"+selectedName+"<a class=close id="+anchorID+">×</a>"+"</li>");
  //     $(('#'+anchorID)).on("click",function(){
  //       $(('#'+anchorID)).off();
  //       $(('#'+anchorID)).parent().remove();
  //       $(('#'+anchorID)).remove();
  //     });
  //     if (!inMarkerArr(selectedName,mapObject.markerArr)){
  //       addMarker(all_restaurants,selectedName,mapObject,"restaurant");
  //     } else {
  //       showOneMarkerType(mapObject,selectedName);
  //     }
  //   }
  // });
  //
  // $("#addHotel").on("click",function(){
  //   var selectedName = $("#hotel_dropdown option:selected").val();
  //   var anchorID = selectedName.replace(/\s|,|&/g,"_");
  //   if (!inList("singleHotel",selectedName)){
  //     $("#singleHotel > ul").replaceWith("<ul><li>"+selectedName+"<a class=close id="+anchorID+">×</a></li></ul>");
  //     $(('#'+anchorID)).on("click",function(){
  //       $(('#'+anchorID)).off();
  //       $('#singleHotel > ul').replaceWith('<ul style="display:none"><li>sublist for Hotel</li></ul>');
  //     });
  //     if (!inMarkerArr(selectedName,mapObject.markerArr)){
  //       addMarker(all_hotels,selectedName,mapObject,"hotel");
  //       showOneMarkerType(mapObject,selectedName,"hotel");
  //     } else {
  //       showOneMarkerType(mapObject,selectedName,"hotel");
  //     }
  //   }
  // });
});
