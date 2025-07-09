/**
 * JavaScript file used to automate changes in the webpage when buttons are pressed
 * and text fields are filled
 */

/**
 * Encapusulating a function within parentheses makes the function anonymous
 * (private), and the function is immediately executed.
 */
(async function init() {
    const response = await fetch('http://localhost:3000/get-profile');
    console.log("response", response);
    const user = await response.json();
    console.log(JSON.stringify(user));

    // Conditional variable assignment ... = condition ? true value : false value
    // If there is a value already, use that value, otherwise use the default
    document.getElementById("name").textContent = user.name ? user.name : 'Jane Doe';
    document.getElementById("email").textContent = user.email ? user.email : 'jane.doe@example.com';
    document.getElementById("interests").textContent = user.interests ? user.interests : 'Hiking, reading';

    const cont = document.getElementById("container");
    cont.style.display = "block";
})();

/**
 * Runs when the user clicks the "Edit Profile" button
 */
function editProfile() {
    const cont = document.getElementById("container");
    const contEdit = document.getElementById("container-edit");

    // Sets the content in the textfields to be the current values
    document.getElementById("input-name").value = document.getElementById("name");
    document.getElementById("input-email").value = document.getElementById("email");
    document.getElementById("input-interests").value = document.getElementById("interests");

    // Hide the confirmed display, show the edit display
    cont.style.display = "none";
    contEdit.style.display = "block";
}

/**
 * Runs when the user clicks the "Update Profile" button to set their changes
 */ 
async function handleUpdateProfileRequest() {
    const cont = document.getElementById("container");
    const contEdit = document.getElementById("container-edit");

    // Form the payload
    const payload = {
        name: document.getElementById("input-name").value,
        email: document.getElementById("input-email").value,
        interests: document.getElementById("input-interests").value
    };

    const response = await fetch("http://localhost:3000/update-profile", {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });
    const jsonResponse = await response.json();

    document.getElementById("name").textContent = jsonResponse.name;
    document.getElementById("email").textContent = jsonResponse.email;
    document.getElementById("interests").textContent = jsonResponse.interests;

    cont.style.display = "block";
    contEdit.style.display = "none";
}