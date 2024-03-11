
function update(){
    //called on page load from listener
    console.log("This is called on page load.");

    load_gateways();
}

function load_gateways(){

    // temp data
    /*
    const givenJson = 
        [{"_id":"63785425c97a925662a44651", "sensor_id":0, "name": "sensor1", "status":"Online","last_update":1668896333401,"geolocation":{"type": "Point","coordinates": [0,0]},"battery": [{"time": 1668896333401,"value": 100}],"temperature": [26.8],"humidity": [45],"co2": [400],"pressure": [1019]}]; 
    //*/
    
    let givenJson = [];

    resetTable();

    if(givenJson.length <= 0 || givenJson == null || givenJson.length == undefined){
        //if no sensors found, something is wrong and call ...
        emptyRow();
    }
    else{
        for(i = 0; i < givenJson.length; i++){
            let obj = givenJson[i];
            let jsonText = JSON.stringify(obj);
            //add row for each new data 
            createRow(jsonText);
        }
    }
}

function resetTable(){
    let tempTable = document.getElementById("table-body");
    tempTable.innerHTML = null; 
}

// create row for sensors
function createRow(jsonText){ 

    const obj = JSON.parse(jsonText)

    let table = document.getElementById("table-body");// remember to give table an id
    let row = document.createElement("tr");

    // need status section... how?
    let online = document.createElement("th");
    online.setAttribute("scope","row");
    online.className = "align-middle";
    let dot = document.createElement("span");

    if(obj.status === "Online"){
        dot.className = "dot2";
    }
    else if(obj.status === "Inactive"){
        dot.className = "dot3";
    }
    else{
        dot.className = "dot1";
    }

    let text = document.createElement("span");
    text.innerText = " Online";

    online.appendChild(dot);
    online.appendChild(text);

    // device name section
    let device_name = document.createElement("td");
    device_name.className = "align-middle";
    let name = document.createElement("div");
    name.innerText = obj.name;                  // grabbing JSON obj.name 
    let id = document.createElement("div");
    id.innerText = obj.sensor_id;               // grabbing JSON obj.sensor_id 

    device_name.appendChild(name);
    device_name.appendChild(id);

    // Associated Devices section
    let associated_sensor = document.createElement("td");
    associated_sensor.className = "align-middle";

    //need to set up how this is calculated
    // if joined
    associated_sensor.innerText = "Joined";
    // if notJoined
    //associated_sensor.innerText = "Not Joined";
    // if Failed
    //associated_sensor.innerText = "Failed";

    // last update section
    let last_update = document.createElement("td");
    last_update.className = "align-middle";
    last_update.innerText = "test";             // would need info on last update...
    

    // end section
    let graph = document.createElement("td");
    graph.className = "align-middle";
    let image2 = document.createElement("img");
    image2.src = "images/iIcon.png";
    // Will need to add links to images eventually

    graph.appendChild(image2);

    // connect sections
    row.appendChild(online);
    row.appendChild(device_name);
    row.appendChild(associated_sensor);
    row.appendChild(last_update);
    row.appendChild(graph);

    table.appendChild(row);
}

function search_sensors(){
    
    console.log("running search");

    var input, filter, table, tr, td, txtValue;
    input = document.getElementById("search");
    filter = input.value.toUpperCase();
    table = document.getElementById("gateways-table");
    tr = table.getElementsByTagName("tr");

    // Note: Currently, only searches sensor names.

    // Loop through all table rows, and hide those who don't match the search query
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[0];
        if (td) {
            txtValue = td.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }

}

function emptyRow(){

    let table = document.getElementById("table-body");// remember to give table an id
    let row = document.createElement("tr");

    let online = document.createElement("th");
    online.setAttribute("scope","row");
    online.className = "align-middle";
    online.innerText = "No gateways found";
    online.style.fontWeight = "normal";

    let device_name = document.createElement("td");
    device_name.className = "align-middle";

    // error message (goes in associated devices section)
    let error = document.createElement("td");
    error.className = "align-middle";

    let last_update = document.createElement("td");
    last_update.className = "align-middle";

    let graph = document.createElement("td");
    graph.className = "align-middle";
    let image2 = document.createElement("img");
    image2.src = "images/iIcon.png";

    graph.appendChild(image2);

    row.appendChild(online);
    row.appendChild(device_name);
    row.appendChild(error);
    row.appendChild(last_update);
    row.appendChild(graph);

    table.appendChild(row);
}
