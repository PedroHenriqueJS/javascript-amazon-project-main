import { renderCheckoutHeader } from "./checkout/checkoutHeader.js";
import { renderOrderSummary } from "./checkout/orderSummary.js";
import { renderPaymentSummary} from "./checkout/paymentSummary.js";
import { loadProducts } from "../data/products.js";
// import '../data/cart-class.js'
import '../data/car.js'
// import '../data/backend-practice.js'
loadProducts(() => {
    renderCheckoutHeader()
    renderPaymentSummary()
    renderOrderSummary()
})