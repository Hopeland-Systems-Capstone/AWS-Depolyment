
async function update(){
    console.log("page load");
    load_profile();
    clear_message();
}

async function get_profile(){
    // GET	/users/:user_id?key=val	
    // Return user information given user_id

    //Get's the user's token from their browser
    const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
    
    //Create the query to get a user's email (in the backend README)
    query = '/users/:user_id';

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

async function load_profile(){
    console.log("in load profile");
    
    const givenJson = await get_profile();
    let givenJson1 = JSON.stringify(givenJson);
    console.log("after get" + givenJson1);
    let profile = JSON.parse(givenJson1);

    let form = document.getElementById("profile");

    let email = document.getElementById("email");
    let last_name = document.getElementById("lastName");
    let first_name = document.getElementById("firstName");
    let company = document.getElementById("companyName");
    let phone = document.getElementById("phoneNumber");

    let full_name = profile.name.split(" ",2);
    console.log("test " + full_name[0] + full_name[1]);
    
    email.value = profile.email; // working
    first_name.value = full_name[0];
    if(!(full_name[1] == undefined || full_name[1] == null)){
       last_name.value = full_name[1]; 
    }
    company.value = profile.company_name;
    phone.value = profile.phone_number;
}

async function save_profile(){

    const button = document.getElementById('save-button');
    button.classList.add('loading');

    let hold = await update_profile();

    button.classList.remove('loading');
    //save_message();

    if (hold != null) {
        alert("Saved Profile");
        save_message();
    }
}

async function update_profile(){
    // PUT: /users/:user_id/update?name=name&email=email&phone_number=phone_number&company_name=company_name&key=val	
    // Update user's user_id name, email, phone number, company name

    console.log("in save profile");

    let form = document.getElementById("profile");

    let email = document.getElementById("email").value;
    let lastName = document.getElementById("lastName").value;
    let firstName = document.getElementById("firstName").value;
    let companyName = document.getElementById("companyName").value;
    let phoneNumber = document.getElementById("phoneNumber").value;

    let fullName = firstName + " " + lastName;

    //if email is valid
    if(!email || !lastName || !firstName){
        alert("Missing input in required section");
        error_message();
        return;
    } 

    //if company name was given
    if(companyName){ // should check for illegal characters

    }

    let isnum = /^\d+$/.test(phoneNumber);
    if(!(phoneNumber && isnum)){ 
        alert("Incorrect characters in Phone Number");
        error_message();
        return;
    }

    //Get's the user's token from their browser
    const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];

    //Create the query to get a user's email (in the backend README)
    query = '/users/:user_id/update?name=' + fullName +'&email=' + email+ '&phone_number=' + phoneNumber + '&company_name=' + companyName;

    //Pass the query and user's token into the /data route
    const response = await fetch('/data/put', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token, query })
    });

    //Return the response from the /data route, which should be the email of the user
    return await response.json();
}

function error_message(){
    let element = document.getElementById("message");
    element.innerText = "Unable to Save"
}

function save_message(){
    let element = document.getElementById("message");
    element.innerText = "Saved"
    element.style.color = "#536942";
}

function clear_message(){
    let element = document.getElementById("message");
    element.innerText = ""
}

async function logout(){
    const button = document.getElementById('logout-button');
    button.classList.add('loading');
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = "/login";
    button.classList.remove('loading');
}
