/*
 * Copyright (c) 2022, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import React from 'react'
import {screen} from '@testing-library/react'
import useCommerceApi from './hooks/useCommerceApi'
import {renderWithProviders, TEST_CONFIGS} from './test-utils'

test('useCommerceApi returns a set of api clients', () => {
    const Component = () => {
        const api = useCommerceApi()
        return <div>{api?.shopperSearch && 'success'}</div>
    }
    renderWithProviders(<Component />)

    expect(screen.getByText('success')).toBeInTheDocument()
})

test('props are used properly when initializing api clients', () => {
    const Component = () => {
        const api = useCommerceApi()
        return (
            <ul>
                <li>{api?.shopperSearch?.clientConfig?.parameters?.clientId}</li>
                <li>{api?.shopperSearch?.clientConfig?.parameters?.siteId}</li>
                <li>{api?.shopperSearch?.clientConfig?.parameters?.shortCode}</li>
                <li>{api?.shopperSearch?.clientConfig?.parameters?.organizationId}</li>
            </ul>
        )
    }
    renderWithProviders(<Component />)

    expect(screen.getByText(TEST_CONFIGS.clientId)).toBeInTheDocument()
    expect(screen.getByText(TEST_CONFIGS.siteId)).toBeInTheDocument()
    expect(screen.getByText(TEST_CONFIGS.shortCode)).toBeInTheDocument()
    expect(screen.getByText(TEST_CONFIGS.organizationId)).toBeInTheDocument()
})
