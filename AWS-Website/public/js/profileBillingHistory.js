async function update(){
    console.log("page load");

    //called when you load page
    load_billing_history();
}

async function get_billing_history(){
    //GET: /users/:user_id/bills	
    // Returns list of bills belonging to the indicated user_id

    //Get's the user's token from their browser
    const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
    
    //Create the query to get a user's email (in the backend README)
    query = '/users/:user_id/bills';

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

async function load_billing_history(){

    const givenJson = await get_billing_history();

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
            add_row(jsonText);
        }
    }

}

function add_row(jsonText){

    const obj = JSON.parse(jsonText);
    
    let table = document.getElementById("table_body");
    let row = document.createElement("tr");

    // --- Invoice ---
    let invoice = document.createElement("td");
    invoice.setAttribute("scope","row");
    invoice.className = "align-middle";
    let num = "#000" // get number
    let date = "12/2022" // get date
    invoice.innerText = "Invoice " + num + " - " + date; 

    // --- Billing Date --- 
    let billing_date = document.createElement("td");
    billing_date.className = "align-middle";
    billing_date.innerText = "12/01/2022" //get billing date

    // --- Status ---
    let status = document.createElement("td");
    status.className = "align-middle";
    let dot = document.createElement("span");
    let text2 = document.createElement("span");

    if(obj.status === "Paid"){
        dot.className = "dot2";
        text2.innerText = " Paid";
    }
    else if(obj.status === "Unpaid"){
        dot.className = "dot3";
        text2.innerText = " Unpaid";
    }
    else{
        dot.className = "dot1";
        text2.innerText = " Error"
    }

    status.appendChild(dot);
    status.appendChild(text2);

    // --- Amount ---
    let amount = document.createElement("td");
    amount.className = "align-middle";
    amount.innerText = "$100.00 CAD"; //get amount

    row.appendChild(invoice);
    row.appendChild(billing_date);
    row.appendChild(status);
    row.appendChild(amount);

    table.appendChild(row);

}

function emptyRow(){
    let table = document.getElementById("table-body");// remember to give table an id
    let row = document.createElement("tr");

    // --- Invoice ---
    let invoice = document.createElement("td");
    invoice.setAttribute("scope","row");
    invoice.className = "align-middle";
    invoice.innerText = "No billing history found"; 

    // --- Billing Date --- 
    let billing_date = document.createElement("td");
    billing_date.className = "align-middle";
    billing_date.innerText = "" 

    // --- Status ---
    let status = document.createElement("td");
    status.className = "align-middle";

    // --- Amount ---
    let amount = document.createElement("td");
    amount.className = "align-middle";

    row.appendChild(invoice);
    row.appendChild(billing_date);
    row.appendChild(status);
    row.appendChild(amount);

    table.appendChild(row);
}

function resetTable(){
    let tempTable = document.getElementById("table-body");
    tempTable.innerHTML = null; 
}
