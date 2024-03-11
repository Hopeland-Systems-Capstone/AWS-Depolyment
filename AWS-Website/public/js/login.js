document.getElementById("loginForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const button = document.getElementById('login-button');
    button.classList.add('loading');

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const response = await fetch("/login", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    if (response.ok) {
        window.location.href = "main.html";
    } else {
        alert("Incorrect email or password!"+response.ok);
    }

    button.classList.remove('loading');

});