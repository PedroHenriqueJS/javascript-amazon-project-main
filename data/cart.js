// MODEL


export let cart = JSON.parse(localStorage.getItem('cart')) || [{
    productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
    quantity: 2,
    deliveryOptionId: '1'
  }, {
    productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
    quantity: 1,
    deliveryOptionId: '2'
  }]


function saveStorage(){
  localStorage.setItem('cart', JSON.stringify(cart))
}

export function calculateCartQuantity() {
  let cartQty = 0

  cart.forEach((cartItem) => {
      cartQty += cartItem.quantity
  })

  const cartQuantityElement = document.querySelector('.js-cart-quantity');
  const countQuantityElement = document.querySelector('.js-count-quantity');

  if (cartQuantityElement) {
    cartQuantityElement.textContent = cartQty;
  }

  if (countQuantityElement) {
    countQuantityElement.textContent = `${cartQty} Items`;
  }
}
export function addToCart(productId){
  const qtySelector = document.querySelector(`.js-quantity-selector-${productId}`).value
  let matchingItem
  
  cart.forEach((cartItem) => {
    if(productId === cartItem.productId){
      matchingItem = cartItem
    }
  })
  
  if(matchingItem){
    matchingItem.quantity += Number(qtySelector)
  } else {
    cart.push({ 
      productId, 
      quantity: +qtySelector ,
      deliveryOptionId: '1'
    })
  }
  saveStorage()
}

export function removeFromCart(productId) {
  const newCart = []

  cart.forEach((cartItem) => {
    if(cartItem.productId !== productId){
      newCart.push(cartItem)
    }
  })

  cart = newCart

  saveStorage()
}

export function updateQuantity(productId, newQuantity){
  let matchingItem
  cart.forEach((cartItem) => {
    if(productId === cartItem.productId){
      matchingItem = cartItem
    }
  })
  matchingItem.quantity = newQuantity;
  saveStorage()
}

export function updateDeliveryOption(productId, deliveryOptionId) {
  let matchingItem
  
  cart.forEach((cartItem) => {
    if(productId === cartItem.productId){
      matchingItem = cartItem
    }
  })

  matchingItem.deliveryOptionId = deliveryOptionId

  saveStorage()
}