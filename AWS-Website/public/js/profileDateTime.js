function update(){
    console.log("page load");
    //called when you load page
    display_current_time();
}

async function display_current_time(){

    //restful call to get user_timezone
    let timezone = await get_timezone();
    
    const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    let date = new Date();
    let str = date.toLocaleString(timezone);
    let day = date.getDay();

    let current_time = document.getElementById("current_time");
    current_time.innerText = str + " " + weekday[day];
}

async function get_timezone(){
    //GET	/users/:user_id/timezone	
    //Get timezone for a user

    //Get's the user's token from their browser
    const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
    
    //Create the query to get a user's email (in the backend README)
    query = '/users/:user_id/timezone';

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

function change_time_zone(){

    // restful call to set timezone from user
    // PUT: /users/:user_id/timezone/:timezone?key=val

}

function change_DST(){

}

function save_changes(){

    change_DST();
    change_time_zone();
}