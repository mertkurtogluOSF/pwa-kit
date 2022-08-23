/*
 * Copyright (c) 2022, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import {render, RenderOptions} from '@testing-library/react'
import jwt from 'jsonwebtoken'
import nock from 'nock'
import React from 'react'
import CommerceApiProvider from './provider'

export const TEST_CONFIGS = {
    proxy: 'http://localhost:3000/mobify/proxy/api',
    clientId: 'c9c45bfd-0ed3-4aa2-9971-40f88962b836',
    organizationId: 'f_ecom_zzrf_001',
    shortCode: '8o7m175y',
    redirectURI: 'http://localhost:3000/callback',
    siteId: 'RefArchGlobal',
    locale: 'en_US',
    currency: 'USD',
}
const TestProviders = (props: {children: React.ReactNode}) => {
    return (
        <CommerceApiProvider
            {...TEST_CONFIGS}
            queryClientConfig={{
                defaultOptions: {queries: {retry: false}, mutations: {retry: false}},
            }}
        >
            {props.children}
        </CommerceApiProvider>
    )
}

/**
 * Render your component, which will be wrapped with all the necessary Provider components
 *
 * @param component
 * @param options - additional options for testing-library's render function
 */
export const renderWithProviders = (
    component: React.ReactElement,
    options?: Omit<RenderOptions, 'wrapper'>
): void => {
    render(component, {wrapper: TestProviders, ...options})
}

type NockBackOptions = {
    directory: string
    mode?: nock.BackMode
}

/**
 * Enable recording and mocking of the http responses
 *
 * @param options -
 *
 * @example
 * ```
 * const {withMocks} = mockHttpResponses({directory: `${__dirname}/mock-responses`})
 * test('some hook', withMocks(() => {
 *   // your test that makes http requests
 * }))
 * ```
 */
export const mockHttpResponses = (options: NockBackOptions) => {
    const mode = (process.env.NOCK_BACK_MODE as nock.BackMode) || options.mode || 'record'

    const nockBack = nock.back
    nockBack.fixtures = options.directory

    const USID = 'USID'
    const CODE = 'CODE'
    const CLIENT_ID = 'CLIENT_ID'
    const CODE_CHALLENGE = 'CODE_CHALLENGE'

    const mockAuthCalls = () => {
        nock('http://localhost:3000')
            .persist()
            .get((uri) => uri.includes('/oauth2/authorize'))
            .query((q) => {
                return !!q['code_challenge']
            })
            .reply(303, undefined, {
                Location: `/callback?usid=${USID}&code=${CODE}`,
            })
            .get(`/callback?usid=${USID}&code=${CODE}`)
            .reply(200)

        nock('http://localhost:3000')
            .persist()
            .post(
                (uri) => uri.includes('/oauth2/token'),
                () => true
            )
            .reply(200, {
                access_token: jwt.sign({exp: Math.floor(Date.now() / 1000) + 1800}, 'secret'),
                id_token: '',
                refresh_token: 'tZpYZo4_SN91L57tvQR1p8INr8E32M0FX4-P_f7T0Lg',
                expires_in: 1800,
                token_type: 'BEARER',
                usid: '851fd6b0-ef19-4eac-b556-fa13827708ed',
                customer_id: 'bcmbsVxKo0wHaRxuwVmqYYxudH',
                enc_user_id: 'adb831a7fdd83dd1e2a309ce7591dff8',
                idp_access_token: null,
            })
    }

    // Every time we update the Nock recordings, we'd like to run
    // this afterRecord function to modify the recording. Reasons:
    // 1. SLAS calls include random unique identifiers and we need to mock them
    // 2. For security reasons, we don't want to store real credentials in the repo
    const afterRecord = (defs: nock.Definition[]) => {
        const recordPatchers = [
            {
                matcher: (path: string | RegExp) => {
                    return path.toString().includes('code_challenge')
                },
                patcher: (def: nock.Definition & {rawHeaders: string[]}) => {
                    def.path = def.path
                        .toString()
                        .replace(/client_id=.*&/, `client_id=${CLIENT_ID}&`)
                        .replace(/code_challenge=.*/, `code_challenge=${CODE_CHALLENGE}`)

                    const locationHeaderIndex =
                        def.rawHeaders.findIndex((val) => val === 'location') + 1
                    def.rawHeaders[locationHeaderIndex] = (
                        def.rawHeaders[locationHeaderIndex] as string
                    )
                        .replace(/usid=.*&/, `usid=${USID}&`)
                        .replace(/code=.*/, `code=${CODE}`)
                },
            },
            {
                matcher: (path: string | RegExp) => {
                    return path.toString().includes('/callback')
                },
                patcher: (def: nock.Definition) => {
                    def.path = def.path
                        .toString()
                        .replace(/usid=.*&/, `usid=${USID}&`)
                        .replace(/code=.*/, `code=${CODE}`)
                },
            },
        ]
        return defs.map((def) => {
            recordPatchers.forEach(({matcher, patcher}) => {
                if (matcher(def.path)) {
                    // @ts-ignore Nock types missing property rawHeaders
                    patcher(def)
                }
            })
            return def
        })
    }

    const withMocks = (testFn: () => Promise<void> | void) => {
        return async () => {
            const testName = expect.getState().currentTestName
            const fileName = `${slugify(testName)}.json`

            nockBack.setMode(mode)
            const {nockDone} = await nockBack(fileName, {afterRecord})
            mockAuthCalls()
            await testFn()
            nockDone()

            // Make sure nock do not interfere with other tests that do not call `withMocks`
            nockBack.setMode('wild')
        }
    }

    return {withMocks}
}

const slugify = (text: string) => {
    return text
        .toString()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '')
}
