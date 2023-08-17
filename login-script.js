const loginButton = document.getElementById('login-buton');

const emailInput = document.getElementById('email-input');
const passInput = document.getElementById('pass-input');

loginButton.addEventListener('click', async ()=>{
	console.log(emailInput.value);
	
	const response = await fetch('http://localhost:8080/api/getCustomer/' + emailInput.value, {
		mode: 'cors',
      	method: 'GET',
      	headers: {
        	"Content-Type": "application/json",
        	"Accept": "application/json"
        	},
      	});
	
	const customer = await response.json();
	if(customer.customerID == null)
		toastr.error('User not found!');
	else{
		//daca ma prind hackeri m o spart
		if(emailInput.value === customer.email && passInput.value === customer.password){
			sessionStorage.setItem('customerID', customer.customerID);
			location.href = 'http://localhost:5173/home';
		}
	}
});