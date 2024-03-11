//Function called when window loads
window.onload = async function() {

    //Call my getUserEmail function, then print it out
    const email = await getUserEmail();
    console.log(email);

}

async function getUserEmail() {
  
  //Get's the user's token from their browser
  const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
  
  //Create the query to get a user's email (in the backend README)
  query = '/users/:user_id/email';

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