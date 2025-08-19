/**
 * JavaScript file used to automate changes in the webpage when buttons are pressed
 * and text fields are filled
 */

/**
 * Encapusulating a function within parentheses makes the function anonymous
 * (private), and the function is immediately executed.
 */
(async function init() {
    try {
        const response = await fetch('http://localhost:3000/get-profile');

        if(!response.ok)
            throw new Error(`Response status: ${response.status}`)

        console.log("response", response);
        const user = await response.json();
        console.log(JSON.stringify(user));

        // Conditional variable assignment ... = condition ? true value : false value
        // If there is a value already, use that value, otherwise use the default
        var nameElem = document.getElementById("name")
        if(nameElem)
            nameElem.textContent = user.name ? user.name : 'Jane Doe';
        
        var emailElem = document.getElementById("email")
        if(emailElem)
            emailElem.textContent = user.email ? user.email : 'jane.doe@example.com';
        
        var interestsElem = document.getElementById("interests")
        if(interestsElem)
            interestsElem.textContent = user.interests ? user.interests : 'Hiking, reading';
    } catch (error) {
        if(error instanceof Error)
            console.error(error.message);
    } finally {
        const cont = document.getElementById("container");
        if(cont)
            cont.style.display = "block";
    }
})();

/**
 * Runs when the user clicks the "Edit Profile" button
 */
function editProfile() {
    // Sets the content in the textfields to be the current values
    var nameIn = document.getElementById("input-name") as HTMLInputElement
    var nameElem = document.getElementById("name")
    if(nameIn && nameElem)
        nameIn.value = nameElem.textContent;
    
    var emailIn = document.getElementById("input-email") as HTMLInputElement
    var emailElem = document.getElementById("email")
    if(emailIn && emailElem)
        emailIn.value = emailElem.textContent;
    
    var interestsIn = document.getElementById("input-interests") as HTMLInputElement
    var interestsElem = document.getElementById("interests")
    if(interestsIn && interestsElem)
        interestsIn.value = interestsElem.textContent;

    // Hide the confirmed display, show the edit display
    const cont = document.getElementById("container");
    const contEdit = document.getElementById("container-edit");
    if(cont && contEdit) {
        cont.style.display = "none";
        contEdit.style.display = "block";
    }
}

/**
 * Runs when the user clicks the "Update Profile" button to set their changes
 */ 
async function handleUpdateProfileRequest() {
    var nameIn = document.getElementById("input-name") as HTMLInputElement
    var emailIn = document.getElementById("input-email") as HTMLInputElement
    var interestsIn = document.getElementById("input-interests") as HTMLInputElement

    // Form the payload
    const payload = {
        name: nameIn.value,
        email: emailIn.value,
        interests: interestsIn.value
    };

    try {
        const response = await fetch("http://localhost:3000/update-profile", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });
        const jsonResponse = await response.json();

        var nameElem = document.getElementById("name")
        if(nameElem)
            nameElem.textContent = jsonResponse.name;
        
        var emailElem = document.getElementById("email")
        if(emailElem)
            emailElem.textContent = jsonResponse.email;
        
        var interestsElem = document.getElementById("interests")
        if(interestsElem)
            interestsElem.textContent = jsonResponse.interests;
    } catch (error) {
        console.error(error);
    } finally {
        const cont = document.getElementById("container");
        const contEdit = document.getElementById("container-edit");
        if(cont && contEdit) {
            cont.style.display = "block";
            contEdit.style.display = "none";
        }
    }
}