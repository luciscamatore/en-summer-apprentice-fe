export const addOrders = (orders) => {
  const ordersDiv = document.querySelector('.orders');
  ordersDiv.innerHTML = 'No orders available';

  if(orders.length){
    ordersDiv.innerHTML = '';
    orders.forEach((orderElem) => {
      createOrderCard(orderElem); //if it works dont touch it
    });
  }
}
export function createOrderCard(order){
    //coding monkey style la greu :))
    let secodDescription = 'VIP';
    if(secodDescription == order.ticketCategoryDTO.description){
       secodDescription = 'Standard';
    }else{
       secodDescription = 'VIP';
    }
    const deleteID = order.orderID+'d';
    const editID = order.orderID+'e';
    const inputID = order.orderID+'i';
    const selectID = order.orderID+'s';
    const iconID = order.orderID+'ii';
    const trashID = order.orderID+'t';

    const orderCard = document.createElement('div');
    orderCard.classList.add('order-card'); 
    const orderMarkup = `
    <div class="order-row tb">
      <div class="order-column tb">${order.eventName}</div>
      <div class="order-column tb"><input class="order-column" placeholder="${order.nrTickets}" id="${inputID}" disabled/></div>
      <div class="order-column tb">
        <select id="${selectID}"disabled>
          <option>${order.ticketCategoryDTO.description}</option>
          <option>${secodDescription}</option>
        </select> 
      </div>
      <div class="order-column tb">Date</div>
      <div class="order-column tb">${order.price} $</div>
    </div>
    <div class="order-buttons">
      <button class="edit-button tb" id="${editID}"><i id="${iconID}" class="fa-solid fa-pen" style="background-color:#ffffff00;"></i></button>
      <button class="delete-button tb" id="${deleteID}"><i id="${trashID}" class="fa-solid fa-trash-can" style="color: #fffffff;background-color:#ffffff00;"></i></button>
    </div>
    `;
    
    orderCard.innerHTML = orderMarkup;
    const orderContainer = document.querySelector('.orders');
    orderContainer.appendChild(orderCard);

}
export function deleteOrderHnadler(order, orderList){
  //coding monkey style ?
  const deleteButton = document.getElementById(order.orderID+'d');
  const nrTicketOrder = document.getElementById(order.orderID+'i');
      
  deleteButton.addEventListener('click', ()=>{
    if(nrTicketOrder.disabled){
    fetch('http://localhost:8080/api/deleteOrder/'+ order.orderID ,{  
      mode: 'cors',
      method: 'DELETE',
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
        },
      });
      //coding monkey style ?
      
      toastr.success("Order deleted!");
      orderList = orderList.filter((o) => {return o.orderID !== order.orderID});
      addOrders(orderList);
      }
    });
}
export function patchOrderHandler(order, orderList){
  const deleteID = order.orderID+'d';
  const editID = order.orderID+'e';
  const inputID = order.orderID+'i';
  const selectID = order.orderID+'s';
  const iconID = order.orderID+'ii';
  const trashID = order.orderID+'t';

  const deleteButton = document.getElementById(deleteID);
  const nrTicketOrder = document.getElementById(inputID);
  const ticketCategoryOrder = document.getElementById(selectID);
  const editButton = document.getElementById(editID);
  const icon = document.getElementById(iconID);
  const trash = document.getElementById(trashID);
  
  editButton.addEventListener('click', ()=>{
    nrTicketOrder.disabled = !nrTicketOrder.disabled;
    ticketCategoryOrder.disabled = !ticketCategoryOrder.disabled;

    ticketCategoryOrder.classList.toggle('active');
    nrTicketOrder.classList.toggle('active');
    
    if(!nrTicketOrder.disabled){
      icon.classList.toggle('fa-pen');
      icon.classList.toggle('fa-check');

      trash.classList.toggle('fa-trash-can');
      trash.classList.toggle('fa-xmark');

      deleteButton.addEventListener('click', ()=>{
        nrTicketOrder.disabled = !nrTicketOrder.disabled;
        ticketCategoryOrder.disabled = !ticketCategoryOrder.disabled;

        icon.classList.toggle('fa-check');
        icon.classList.toggle('fa-pen');
        ticketCategoryOrder.classList.toggle('active');
        nrTicketOrder.classList.toggle('active');
        trash.classList.toggle('fa-trash-can');
        trash.classList.toggle('fa-xmark');
      });
    }else{
      icon.classList.toggle('fa-check');
      icon.classList.toggle('fa-pen');
      trash.classList.toggle('fa-trash-can');
      trash.classList.toggle('fa-xmark');
      fetch('http://localhost:8080/api/patchOrder', 
      {
        mode:'cors',
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body:JSON.stringify({
          orderID: order.orderID, //niste hardcodari blanao
          ticketCategoryDescription: document.getElementById(selectID).value.replace(/[^a-zA-Z]/g, ''),
          nrTickets: document.getElementById(inputID).value == '' ? order.nrTickets : document.getElementById(inputID).value
        })
      });
      //un mic hack sa n am de scris mult cod
      location.reload();
      toastr.success("Order updated!");
      }    
    });
}
const sortOrderName = (orders, direction) => {
  const ordersDiv = document.querySelector('.orders');

  if(direction === 'asc')
    orders.sort((a,b) => a.eventName.localeCompare(b.eventName));
  
  if(direction === 'desc')
    orders.reverse();

  if(orders.length){
    ordersDiv.innerHTML = '';
    orders.forEach((orderElem) => {
      createOrderCard(orderElem); //if it works dont touch it
    });
  }
}
const sortOrderPrice = (orders, direction) => {
  const ordersDiv = document.querySelector('.orders');

  if(direction === 'asc')
    orders.sort((a,b) => a.price - b.price);
  
  if(direction === 'desc')
    orders.reverse();

  if(orders.length){
    ordersDiv.innerHTML = '';
    orders.forEach((orderElem) => {
      createOrderCard(orderElem); //if it works dont touch it
    });
  }
}
const sortOrderTicket = (orders, direction) => {
  const ordersDiv = document.querySelector('.orders');

  if(direction === 'asc')
    orders.sort((a,b) => a.ticketCategoryDTO.price - b.ticketCategoryDTO.price);
  
  if(direction === 'desc')
    orders.reverse();

  if(orders.length){
    ordersDiv.innerHTML = '';
    orders.forEach((orderElem) => {
      createOrderCard(orderElem); //if it works dont touch it
    });
  }
}
const sortOrderCategory = (orders, direction) => {
  const ordersDiv = document.querySelector('.orders');

  if(direction === 'asc')
    orders.sort((a,b) => a.ticketCategoryDTO.description.localeCompare(b.ticketCategoryDTO.description));
  
  if(direction === 'desc')
    orders.reverse();

  if(orders.length){
    ordersDiv.innerHTML = '';
    orders.forEach((orderElem) => {
      createOrderCard(orderElem); //if it works dont touch it
    });
  }
}
const sortOrderDate = (orders, direction) => {
  const ordersDiv = document.querySelector('.orders');

  if(direction === 'asc')
    orders.sort((a,b) => a.ticketCategoryDTO.description.localeCompare(b.ticketCategoryDTO.description));
  
  if(direction === 'desc')
    orders.reverse();

  if(orders.length){
    ordersDiv.innerHTML = '';
    orders.forEach((orderElem) => {
      createOrderCard(orderElem); //if it works dont touch it
    });
  }
}
export function sortOrders(orderList){
  const nameSortButon = document.getElementById('order-name-sort');
  const priceSortButon = document.getElementById('order-price-sort');
  const ticketSortButon = document.getElementById('order-ticket-sort');
  const catSortButon = document.getElementById('order-cat-sort');
  const dateSortButon = document.getElementById('order-date-sort');

  const nameIcon = document.getElementById('namei');
  const priceIcon = document.getElementById('pricei');
  const ticketIcon = document.getElementById('tki');
  const catIcon = document.getElementById('cati');
  const dateIcon = document.getElementById('datei');
  
  let nameButton = false;
  let priceButon = false;
  let ticketButon = false;
  let catButon = false;
  let dateButon = false;

  nameSortButon.addEventListener('click', () =>{
    nameButton = !nameButton;
    if(nameButton)
      sortOrderName(orderList, 'asc');
    else
      sortOrderName(orderList, 'desc');

    nameIcon.classList.toggle('fa-arrow-up-a-z');
    nameIcon.classList.toggle('fa-arrow-down-a-z');
  });

  priceSortButon.addEventListener('click', () =>{
    priceButon = !priceButon;
    if(priceButon)
      sortOrderPrice(orderList, 'asc');
    else
      sortOrderPrice(orderList, 'desc');
    priceIcon.classList.toggle('fa-arrow-up-1-9');
    priceIcon.classList.toggle('fa-arrow-down-1-9');
  });

  ticketSortButon.addEventListener('click', () =>{
    ticketButon = !ticketButon;
    if(ticketButon)
      sortOrderTicket(orderList, 'asc');
    else
      sortOrderTicket(orderList, 'desc');
    ticketIcon.classList.toggle('fa-arrow-up-1-9');
    ticketIcon.classList.toggle('fa-arrow-down-1-9');
  });

  catSortButon.addEventListener('click', () =>{
    catButon = !catButon;
    if(catButon)
      sortOrderCategory(orderList, 'asc');
    else
      sortOrderCategory(orderList, 'desc');
    catIcon.classList.toggle('fa-arrow-up-a-z');
    catIcon.classList.toggle('fa-arrow-down-a-z');
    });

    dateSortButon.addEventListener('click', () =>{
      dateButon = !dateButon;
      if(dateButon)
        sortOrderDate(orderList, 'asc');
      else
        sortOrderDate(orderList, 'desc');
      dateIcon.classList.toggle('fa-arrow-up-a-z');
      dateIcon.classList.toggle('fa-arrow-down-a-z');
    });
  
}