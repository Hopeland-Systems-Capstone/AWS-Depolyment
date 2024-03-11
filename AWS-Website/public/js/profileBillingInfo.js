function update(){
    console.log("page load");

    //called when you load page
    load_billing();
}

async function get_cards(){
    // GET	/users/:user_id/cards?key=val	
    // Get all cards on file for a user

    //Get's the user's token from their browser
    const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
    
    //Create the query to get a user's email (in the backend README)
    query = '/users/:user_id/cards';

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

async function load_billing(){

    //get restful call to load billing
    const givenJson = await get_cards();

    resetTable();

    if(givenJson.length <= 0 || givenJson == null || givenJson.length == undefined){
        //if no cards found
        console.log("found empty");
        emptyRow();
    } else {
        console.log("found and trying to fill");
        for(i = 0; i < givenJson.length; i++) {
            let obj = givenJson[i];
            let jsonText = JSON.stringify(obj);
            //add row for each new data 
            add_row(jsonText);
        }
    }

}

function add_row(jsonText){

    const obj = JSON.parse(jsonText);

    let table = document.getElementById("table-body");
    let row = document.createElement("tr");

    // --- Name ---
    let name = document.createElement("td");
    name.setAttribute("scope","row");
    name.className = "align-middle";

        //restful call needed to get card info
    let card = "**** 1234"

        // needs to adjust depending on card
    let image1 = document.createElement("img");
    image1.src = "images/visaLogo.png";
    let type = "Visa Card ";

    let text1 = document.createElement("span")
    text1.innerText = type + card;

    name.appendChild(image1);
    name.appendChild(text1);
    
    // --- Expiration --- 
    let expiration = document.createElement("td");
    expiration.className = "align-middle";
    expiration.innerText = "12/2022"; //replace with call

    // --- Status --- 
    let status = document.createElement("td");
    status.className = "align-middle";
    let dot = document.createElement("span");
    let text2 = document.createElement("span");

    if(obj.status === "Active"){ // double check
        dot.className = "dot2";
        text2.innerText = " Active";
    }
    else if(obj.status === "Inactive"){
        dot.className = "dot3";
        text2.innerText = " Inactive";
    }
    else{
        dot.className = "dot1";
    }

    status.appendChild(dot);
    status.appendChild(text2);

    // --- Trash ---
    let icon = document.createElement("td");
    icon.className = "align-middle";
    let image2 = document.createElement("img");
    image2.src = "images/trash.png";
    image2.className = "trash";

    icon.appendChild(image2);

    row.appendChild(name);
    row.appendChild(expiration);
    row.appendChild(status);
    row.appendChild(icon);

    table.appendChild(row);
}

function resetTable(){
    let tempTable = document.getElementById("table-body");
    tempTable.innerHTML = null; 
}

function emptyRow(){
    
    let table = document.getElementById("table-body");
    let row = document.createElement("tr");

    // --- Name ---
    let name = document.createElement("td");
    name.setAttribute("scope","row");
    name.className = "align-middle";
    let text = document.createElement("span")
    text.innerText = "No billing information found";

    name.appendChild(text);
    
    // --- Expiration --- 
    let expiration = document.createElement("td");
    expiration.className = "align-middle";

    // --- Status --- 
    let status = document.createElement("td");
    status.className = "align-middle";

    // --- Trash ---
    let icon = document.createElement("td");
    icon.className = "align-middle";

    row.appendChild(name);
    row.appendChild(expiration);
    row.appendChild(status);
    row.appendChild(icon);

    table.appendChild(row);
}