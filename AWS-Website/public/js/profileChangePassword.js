function update(){
    clear_message();
}

//needs to be tested
async function update_password(){

    let old_pass = await hashPassword(document.getElementById("old_password").value);
    let new_pass = await hashPassword(document.getElementById("new_password").value);
    let confirmation = await hashPassword(document.getElementById("confirmation").value);

    if(!old_pass || !new_pass || !confirmation){
        alert("Enter old password, new password, and confirmation.");
        error_message();
        return;
    } else if(new_pass !== confirmation) {
        alert("New Password does not match Confirm New Password")
        error_message();
        return;
    }

    //Get's the user's token from their browser
    const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];

    // PUT: /users/:user_id/password?key=val&new=new_password&old=old_password	
    // Update password for user
    console.log(new_pass);
    console.log(old_pass);
    query = '/users/:user_id/password?new=' + new_pass + '&old=' + old_pass;

    //Pass the query and user's token into the /data route
    const response = await fetch('/data/put', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token, query })
    });

    console.log(response.status);

    if (response.status === 201) {
        save_message();
    } else {
        wrongPassword();
    }
}

function wrongPassword() {
    alert("Wrong Password. Try again.")
    let element = document.getElementById("message");
    element.innerText = "Wrong Password"
}

function error_message(){
    let element = document.getElementById("message");
    element.innerText = "Unable to Update"
}

function save_message(){
    alert("Updated password!")
    let element = document.getElementById("message");
    element.innerText = "Updated"
    element.style.color = "#536942";
    document.getElementById("old_password").value="";
    document.getElementById("new_password").value="";
    document.getElementById("confirmation").value="";
}

function clear_message(){
    let element = document.getElementById("message");
    element.innerText = ""
}

async function hashPassword(password) {
    const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(password));
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}