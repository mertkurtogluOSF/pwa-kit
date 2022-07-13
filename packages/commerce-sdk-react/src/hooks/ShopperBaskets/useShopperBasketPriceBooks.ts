/*
 * Copyright (c) 2022, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import {PriceBookIds} from 'commerce-sdk-isomorphic'
import {QueryResponse} from '../../types'
import {ShopperBasketParams} from './types'

const useShopperBasketPriceBooks = (
    params: ShopperBasketParams,
    source: []
): QueryResponse<PriceBookIds> => {
    return {
        data: {},
        isLoading: true,
        error: undefined
    }
}

export default useShopperBasketPriceBooks