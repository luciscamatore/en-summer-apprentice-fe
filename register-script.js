const registerButton = document.getElementById('register-buton');

const nameInput = document.getElementById('name-input');
const emailInput = document.getElementById('email-input');
const passInput = document.getElementById('pass-input');
const passConfirmInput = document.getElementById('pass-confirm-input');

registerButton.addEventListener('click', async (req, res)=>{
    const response = await fetch('http://localhost:8080/api/getCustomer/' + emailInput.value, {
		mode: 'cors',
      	method: 'GET',
      	headers: {
        	"Content-Type": "application/json",
        	"Accept": "application/json"
        	},
      	});
	
	const customer = await response.json();
    if(emailInput.value === customer.email){
        confirm('This email is already registered!');
        return;
    }
    if(passInput.value !== passConfirmInput.value){
        confirm('Passwords must match!');
        return;
    }

    fetch('http://localhost:8080/api/registerCustomer', 
    {
      mode:'cors',
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body:JSON.stringify({
        customerName: nameInput.value,
        password: passInput.value,
        email: emailInput.value
      })
    });
    location.href='http://localhost:5173/login.html';
});