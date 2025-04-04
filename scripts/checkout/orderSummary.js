import { cart, removeFromCart, calculateCartQuantity, updateQuantity, updateDeliveryOption } from '../../data/cart.js'
import { products, getProduct } from '../../data/products.js'
import { formatCurrency } from '../utils/money.js'
import {deliveryOptions, getDeliveryOption, calculateDeliveryDate} from '../../data/deliveryOptions.js'
import { renderPaymentSummary } from './paymentSummary.js'
import { renderCheckoutHeader } from './checkoutHeader.js'

const orderSummary = document.querySelector('.js-order-summary')


export function renderOrderSummary(){
    // VIEW

    let cartSummaryHTML = ''
    
    calculateCartQuantity()
    
    cart.forEach(item => {
        const productId = item.productId
        let matchingProduct = getProduct(productId)
        const deliveryOptionId = item.deliveryOptionId
        
        const deliveryOption = getDeliveryOption(deliveryOptionId)
    
        const dateString = calculateDeliveryDate(deliveryOption);
    
        cartSummaryHTML += `
            <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
                <div class="delivery-date">
                    Delivery date: ${dateString}
                </div>
    
                <div class="cart-item-details-grid">
                    <img class="product-image"
                        src="${matchingProduct.image}">
    
                    <div class="cart-item-details">
                        <div class="product-name">
                            ${matchingProduct.name}
                        </div>
                        <div class="product-price">
                            ${matchingProduct.getPrice()}
                        </div>
                        <div>
                            <span class="quantity-label-container">
                                Quantity: <span class="quantity-label js-quantity-label-${matchingProduct.id}">${item.quantity}</span>
                            </span>
                            <span class="update-quantity-link link-primary js-update-link" data-product-id="${matchingProduct.id}">
                                Update
                            </span>
                            <input class="quantity-input js-quantity-input-${matchingProduct.id}">
                            <span class="link-primary save-quantity-link js-save-link" data-product-id="${matchingProduct.id}">Save</span>
                            <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingProduct.id}">
                                Delete
                            </span>
                        </div>
                    </div>
    
                    <div class="delivery-options">
                        <div class="delivery-options-title">
                            Choose a delivery option:
                        </div>
                        ${deliveryOptionsHTML(matchingProduct, item)}
                    </div>
                </div>
            </div>
        `
    
    })
    
    orderSummary.innerHTML = cartSummaryHTML
    
    
    function deliveryOptionsHTML(matchingProduct, cartItem){
        let html = '';
        deliveryOptions.forEach((deliveryOption) => {
            const dateString = calculateDeliveryDate(deliveryOption)
            const priceString = deliveryOption.priceCents === 0 ? 'FREE' : `$${formatCurrency(deliveryOption.priceCents)} -`
    
            const isChecked = deliveryOption.id === cartItem.deliveryOptionId
    
            html += `
            <div class="delivery-option js-delivery-option" data-product-id="${matchingProduct.id}" data-delivery-option-id="${deliveryOption.id}">
                <input type="radio"
                    ${isChecked ? 'checked' : ''}
                    class="delivery-option-input"
                    name="delivery-option-${matchingProduct.id}">
                <div>
                    <div class="delivery-option-date">
                        ${dateString}
                    </div>
                    <div class="delivery-option-price">
                        ${priceString} Shipping
                    </div>
                </div>
            </div>
            `
        })
        return html
    }
    
    // CONTROLLER

    document.querySelectorAll('.js-update-link').forEach((link) => {
        link.addEventListener('click', () => {
            const productId = link.dataset.productId
            const container = document.querySelector(`.js-cart-item-container-${productId}`)
            container.classList.add('is-editing-quantity')
        })
    })
    
    document.querySelectorAll('.js-save-link').forEach((link) => {
        link.addEventListener('click', () => {
            const productId = link.dataset.productId
            const quantityInput = document.querySelector(`.js-quantity-input-${productId}`)
            const newQuantity = Number(quantityInput.value)
            const quantityLabel = document.querySelector(
                `.js-quantity-label-${productId}`
            );
            quantityLabel.innerHTML = newQuantity;
            if(newQuantity < 1 || newQuantity > 100){
                alert('Quantity must be at least 1 and less than 100')
                return 
            }
            updateQuantity(productId, newQuantity)
            const container = document.querySelector(`.js-cart-item-container-${productId}`)
            container.classList.remove('is-editing-quantity')
            renderCheckoutHeader()
            renderPaymentSummary();
            calculateCartQuantity();
        })
    })
    
    document.querySelectorAll('.js-delete-link').forEach((link) =>{
        link.addEventListener('click', () =>{
            const productId = link.dataset.productId
            removeFromCart(productId)
            renderCheckoutHeader()
            renderOrderSummary()
            renderPaymentSummary()
            calculateCartQuantity()
        })
    })
    
    document.querySelectorAll('.js-delivery-option').forEach((element) => {
        element.addEventListener('click', () => {
            const {productId, deliveryOptionId} = element.dataset
            updateDeliveryOption(productId, deliveryOptionId)
            renderOrderSummary()
            renderPaymentSummary()
        })
    })
}

