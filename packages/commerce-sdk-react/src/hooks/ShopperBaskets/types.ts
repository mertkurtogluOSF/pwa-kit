import {QueryParams} from '../../types'

interface ShopperBasketParams extends QueryParams {
    basketId?: string
}

// The actions are manually taken from commerce-sdk-isomorphic
enum ShopperBasketActions {
    createBasket = 'createBasket',
    transferBasket = 'transferBasket',
    mergeBasket = 'mergeBasket',
    deleteBasket = 'deleteBasket',
    updateBasket = 'updateBasket',
    updateBillingAddressForBasket = 'updateBillingAddressForBasket',
    addCouponToBasket = 'addCouponToBasket',
    removeCouponFromBasket = 'removeCouponFromBasket',
    updateCustomerForBasket = 'updateCustomerForBasket',
    addGiftCertificateItemToBasket = 'addGiftCertificateItemToBasket',
    removeGiftCertificateItemFromBasket = 'removeGiftCertificateItemFromBasket',
    updateGiftCertificateItemInBasket = 'updateGiftCertificateItemInBasket',
    addItemToBasket = 'addItemToBasket',
    removeItemFromBasket = 'removeItemFromBasket',
    updateItemInBasket = 'updateItemInBasket',
    addTaxesForBasketItem = 'addTaxesForBasketItem',
    addPaymentInstrumentToBasket = 'addPaymentInstrumentToBasket',
    removePaymentInstrumentFromBasket = 'removePaymentInstrumentFromBasket',
    updatePaymentInstrumentInBasket = 'updatePaymentInstrumentInBasket',
    addPriceBooksToBasket = 'addPriceBooksToBasket',
    createShipmentForBasket = 'createShipmentForBasket',
    removeShipmentFromBasket = 'removeShipmentFromBasket',
    updateShipmentForBasket = 'updateShipmentForBasket',
    updateShippingAddressForShipment = 'updateShippingAddressForShipment',
    updateShippingMethodForShipment = 'updateShippingMethodForShipment',
    addTaxesForBasket = 'addTaxesForBasket',
}

export type {ShopperBasketParams, ShopperBasketActions}
