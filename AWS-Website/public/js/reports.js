// (much of this code can double in alerts.js)

async function update(){
    //called on page load from listener
    console.log("This is called on page load.");
    load_alert();
}

async function get_alerts() {
    // GET	/user/:user_id/alerts	
    //Returns all alerts from user

    const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];

    query = '/users/:user_id/alerts';

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

async function get_alert_info(alert_id){

    console.log("in get_alert_info");

    const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];

    query = '/alerts/' + alert_id;

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

async function load_alert(){
    let givenJson = await get_alerts();
    resetTable();
    //loop through json
    if(givenJson.length <= 0){
        //if no alerts found, something is wrong and call ...
        emptyRow();
    } else{
        for(i = 0; i < givenJson.length; i++){
            let obj = givenJson[i];
            let alert_info = await get_alert_info(obj);

            console.log(alert_info);

            alert_info = JSON.stringify(alert_info);
            //add row for each new data 
            createRow(alert_info);
        }
    }
}

async function resetTable(){
    let tempTable = document.getElementById("table-body");
    tempTable.innerHTML = null; 
}

async function emptyRow(){
    let table = document.getElementById("table-body");// remember to give table an id
    let row = document.createElement("tr");
    // id section
    let id = document.createElement("th")
    id.className = "align-middle";
    id.innerText = "No reports found.";
    id.style.fontWeight = "normal";
    id.setAttribute("scope","row");

    // sensor section
    let sensor = document.createElement("th")
    sensor.className = "align-middle";

    // title section
    let title = document.createElement("td");
    title.className = "align-middle";

    // alert
    let alert = document.createElement("td");
    alert.className = "align-middle";

    //end
    let end = document.createElement("td");
    end.className = "align-middle";

    // Connecting new elements
    row.appendChild(id);
    row.appendChild(sensor);
    row.appendChild(title);
    row.appendChild(alert);
    row.appendChild(end);

    table.appendChild(row);
}

async function createRow(alertText){
    
    // Note: organize by time

    // id = alert_id
    // title = title 
    // Enable = alert 
    // Operation = time

    const obj = JSON.parse(alertText)

    let table = document.getElementById("table-body");// remember to give table an id
    let row = document.createElement("tr");

    // id (th)
    let id = document.createElement("th")
    id.innerText = obj.alert_id;
    id.className = "align-middle";
    id.setAttribute("scope","row");

    // sensor 
    let sensor = document.createElement("td");
    sensor.innerText = obj.associated_sensor;
    sensor.className = "align-middle";

    // title 
    let title = document.createElement("td");
    title.innerText = obj.title;
    title.className = "align-middle";

    // alert
    let alert = document.createElement("td");
    alert.innerText = obj.alert;
    alert.className = "align-middle";

    //end
    let end = document.createElement("td");
    end.className = "align-middle";

    // Connecting new elements
    row.appendChild(id);
    row.appendChild(sensor);
    row.appendChild(title);
    row.appendChild(alert);
    row.appendChild(end);

    table.appendChild(row);
}
