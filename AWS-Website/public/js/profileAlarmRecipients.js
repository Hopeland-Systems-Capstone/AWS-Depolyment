function update(){
    console.log("page load");

    load_alarm_recipients();
    //add_recipient();
}

async function load_alarm_recipients(){
    const givenJson = await get_alarm_recipients();

    resetTable();

    if(givenJson.length <= 0 || givenJson == null || givenJson.length == undefined){
        //if no sensors found, something is wrong and call ...
        console.log("found empty");
        emptyRow();
    } else {
        console.log("found and trying to fill");
        for(i = 0; i < givenJson.length; i++) {
            let obj = givenJson[i];
            let jsonText = JSON.stringify(obj);
            //add row for each new data 
            add_recipient(jsonText);
        }
    }
}

async function get_alarm_recipients(){
    // GET	/users/:user_id/alarmRecipients	
    // Returns list of alarm recipients belonging to the indicated user_id

    //Get's the user's token from their browser
    const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
    
    //Create the query to get a user's email (in the backend README)
    query = '/users/:user_id/alarmRecipients';

    //Pass the query and user's token into the /data route
    const response = await fetch('/data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token, query })
    });

    //Return the response from the /data route, which should be the email of the user
    return await response.json();
}

// --- ND ---
function add_recipient(){

    console.log("adding recipient");
    //const obj = JSON.parse(jsonText);

    let table = document.getElementById("table-body");
    let row = document.createElement("tr");

    //Name 
    let name = document.createElement("td");
    name.setAttribute("scope","row");
    name.className = "align-middle";
    name.innerText = "Test Name"; // get name

    //email
    let email = document.createElement("td");
    email.className = "align-middle";
    email.innerText = "Test Email"; // get email

    //Enable
    let enable = document.createElement("td");
    enable.className = "align-middle";
    let inner_enable = document.createElement("div");
    inner_enable.className = "form-check form-switch";
    let checkbox = document.createElement("input");
    checkbox.className = "form-check-input";
    checkbox.type = "checkbox";
    checkbox.setAttribute("role","switch");

    //if(enabled)
        checkbox.checked = true;
    //else
        //checkbox.checked = false;

    inner_enable.appendChild(checkbox);
    enable.appendChild(inner_enable);

    //Operation
    let operation = document.createElement("td");
    operation.className = "align-middle";

    //icon
    let icon = document.createElement("td");
    icon.className = "align-middle";
    let image = document.createElement("img");
    image.src = "images/trash.png";
    image.className = "trash";

    icon.appendChild(image);
    
    row.appendChild(name);
    row.appendChild(email);
    row.appendChild(enable);
    row.appendChild(operation);
    row.appendChild(icon);

    table.appendChild(row);
}

function emptyRow(){

    console.log("adding recipient");
    //const obj = JSON.parse(jsonText);

    let table = document.getElementById("table-body");
    let row = document.createElement("tr");

    //Name 
    let name = document.createElement("td");
    name.setAttribute("scope","row");
    name.className = "align-middle";
    name.innerText = "No Recipients Found"; // get name

    //email
    let email = document.createElement("td");
    email.className = "align-middle";

    //Enable
    let enable = document.createElement("td");
    enable.className = "align-middle";

    //Operation
    let operation = document.createElement("td");
    operation.className = "align-middle";

    //icon
    let icon = document.createElement("td");
    icon.className = "align-middle";

    row.appendChild(name);
    row.appendChild(email);
    row.appendChild(enable);
    row.appendChild(operation);
    row.appendChild(icon);

    table.appendChild(row);
}

function resetTable(){
    let tempTable = document.getElementById("table-body");
    tempTable.innerHTML = null; 
}