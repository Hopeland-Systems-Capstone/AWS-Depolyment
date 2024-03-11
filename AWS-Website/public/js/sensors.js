
// --- Needs Testing ---

async function update(){
    //called on page load from listener
    console.log("This is called on page load.");
    load_sensor();
}

async function get_sensors(){
    // GET	/sensors/:sensor_id?key=val	
    //Returns all sensors with id of sensor_id

    const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];

    query = '/users/:user_id/sensors';

    //Pass the query and user's token into the /data route
    const response = await fetch('/data', {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token, query })
    });

    return await response.json();
}

async function get_sensor_info(sensor_id){

    console.log("in get_sensor_info");

    const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];

    query = '/sensors/' + sensor_id;

    //Pass the query and user's token into the /data route
    const response = await fetch('/data', {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token, query })
    });

    return await response.json();

}

async function load_sensor(){

    var forest = 0;
    var flood = 0;
    var alarm = 0;
    var online = 0;
    var offline = 0;
    var inactive = 0;

    console.log("in load_sensors");

    let givenJson = await get_sensors();
    
    console.log("reached here " + givenJson.length);
    resetTable();

    // loop thru and generate row as needed.
    if(givenJson.length <= 0 || givenJson == null || givenJson.length == undefined){
        //if no sensors found, something is wrong and call ...
        console.log("found empty");
        emptyRow();
    } else {
        console.log("found and filling");
        for(i = 0; i < givenJson.length; i++) {
            let obj = givenJson[i];
            //let jsonText = JSON.stringify(obj);

            let sensor_info = await get_sensor_info(obj);
            sensor_info = JSON.stringify(sensor_info);
            console.log(i + " " + sensor_info);

            const json = JSON.parse(sensor_info);
            if (json.status === "Online") {
                online++;
            } else if (json.status === "Offline") {
                offline++;
            } else if (json.status === "Inactive") {
                inactive++;
            }
            if (json.type === "Forest") {
                forest++;
            } else if (json.type === "Flood") {
                flood++;
            } else if (json.type === "Alarm") {
                alarm++;
            }
            document.querySelector(".online").textContent = `Online - ${online}`;
            document.querySelector(".offline").textContent = `Offline - ${offline}`;
            document.querySelector(".inactive").textContent = `Inactive - ${inactive}`;
            document.querySelector(".forest").textContent = `Forest - ${forest}`;
            document.querySelector(".flood").textContent = `Flood - ${flood}`;
            document.querySelector(".alarm").textContent = `Alarm - ${alarm}`;

            //add row for each new data 
            createRow(sensor_info);
        }
    }

}

function resetTable(){
    let tempTable = document.getElementById("table-body");
    tempTable.innerHTML = null; 
}

function emptyRow(){

    let table = document.getElementById("table-body");// remember to give table an id
    let row = document.createElement("tr");

    let online = document.createElement("th");
    online.setAttribute("scope","row");
    online.className = "align-middle";
    online.innerText = "No sensors found";
    online.style.fontWeight = "normal";

    let device_name = document.createElement("td");
    device_name.className = "align-middle";

    // error message (goes in interface status section)
    let error = document.createElement("td");
    error.setAttribute("scope","row");
    error.className = "align-middle";

    let last_update = document.createElement("td");
    last_update.className = "align-middle";

    let graph = document.createElement("td");
    graph.className = "align-middle";

    row.appendChild(online);
    row.appendChild(device_name);
    row.appendChild(error);
    row.appendChild(last_update);
    row.appendChild(graph);

    table.appendChild(row);
}

// create row for sensors
function createRow(jsonText){ 

    // how to get last update

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
    name.innerText = obj.name;                  
    let id = document.createElement("div");
    id.innerText = obj.sensor_id;               

    device_name.appendChild(name);
    device_name.appendChild(id);

    // interface status section
    let interface_status = document.createElement("td");
    interface_status.className = "align-middle";

    let data_row = document.createElement("div")
    data_row.className = "row";

    // co2 section
    let c1 = document.createElement("div");
    c1.className = "col-2";
    let c1_value = document.createElement("div");
    c1_value.className = "row";
    c1_value.style = "font-weight: bold";
    let co2 = obj.co2[obj.co2.length-1].value;
    c1_value.innerText = Math.trunc(co2) + "ppm  ";        
    let c1_name = document.createElement("div");
    c1_name.className = "row";
    c1_name.style = "font-size: 12px";
    c1_name.innerText = "CO2";

    c1.appendChild(c1_value);
    c1.appendChild(c1_name);

    data_row.appendChild(c1);

    // temperature section
    let c2 = document.createElement("div");
    c2.className = "col-2";
    let c2_value = document.createElement("div");
    c2_value.className = "row";
    c2_value.style = "font-weight: bold";
    let temp = obj.temperature[obj.temperature.length-1].value;
    c2_value.innerText = Math.trunc(temp) + "C";
    let c2_name = document.createElement("div");
    c2_name.className = "row";
    c2_name.style = "font-size: 12px";
    c2_name.innerText = "Temperature ";

    c2.appendChild(c2_value);
    c2.appendChild(c2_name);

    data_row.appendChild(c2);

    // humidity section
    let c3 = document.createElement("div");
    c3.className = "col-2";
    let c3_value = document.createElement("div");
    c3_value.className = "row";
    c3_value.style = "font-weight: bold";
    let humidity = obj.humidity[obj.humidity.length-1].value;
    c3_value.innerText = Math.trunc(humidity) + "%";  
    let c3_name = document.createElement("div");
    c3_name.className = "row";
    c3_name.style = "font-size: 12px";
    c3_name.innerText = "Humidity";

    c3.appendChild(c3_value);
    c3.appendChild(c3_name);

    data_row.appendChild(c3);

    // pressure section 
    let c4 = document.createElement("div");
    c4.className = "col-2";
    let c4_value = document.createElement("div");
    c4_value.className = "row";
    c4_value.style = "font-weight: bold";
    let pressure = obj.pressure[obj.pressure.length-1].value;
    c4_value.innerText = Math.trunc(pressure) + "hPa";          // grabbing JSON obj.pressure 
    let c4_name = document.createElement("div");
    c4_name.className = "row";
    c4_name.style = "font-size: 12px";
    c4_name.innerText = "Barometric Pressure";

    c4.appendChild(c4_value);
    c4.appendChild(c4_name);

    data_row.appendChild(c4);

    interface_status.appendChild(data_row);

    // last update section
    let last_update = document.createElement("td");
    last_update.className = "align-middle";
    let given_time = obj.last_update;
    let dateObj = new Date(given_time * 1000)
    let update_string = dateObj.toLocaleString();
    last_update.innerText = update_string;             // grabbing Json obj.last_update
    

    // end section
    let graph = document.createElement("td");
    graph.className = "align-middle";
    let image1 = document.createElement("img");
    image1.src = "images/smallGraph.png";
    let image2 = document.createElement("img");
    image2.src = "images/iIcon.png";
    // Links are currently not attached

    graph.appendChild(image1);
    graph.appendChild(image2);

    // connect sections
    row.appendChild(online);
    row.appendChild(device_name);
    row.appendChild(interface_status);
    row.appendChild(last_update);
    row.appendChild(graph);

    table.appendChild(row);
}

function search_sensors(){

    console.log("running search");

    var input, filter, table, tr, td, txtValue;
    input = document.getElementById("search");
    filter = input.value.toUpperCase();
    table = document.getElementById("sensors-table");
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