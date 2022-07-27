/*
 * Copyright (c) 2022, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import {useState, useEffect} from 'react'
import {ActionResponse, QueryResponse} from './types'

export const useAsync = <T>(fn: () => Promise<T>, deps: unknown[] = []): QueryResponse<T> => {
    const [data, setData] = useState<T | undefined>()
    const [error, setError] = useState<Error | undefined>()
    const [isLoading, setIsLoading] = useState(true)
    console.log('deps', deps)
    console.log('isLoading', isLoading)
    useEffect(() => {
        // use this variable to avoid race condition
        let subscribe = true
        setIsLoading(true)

        const runAsync = async () => {
            try {
                if (subscribe) {
                    const res = await fn()
                    console.log('res', res)
                    setData(res)
                    setIsLoading(false)
                }
            } catch (error) {
                if (subscribe) {
                    setIsLoading(false)
                    if (error instanceof Error) {
                        setError(error)
                    }
                }
            }
        }

        runAsync()

        // clean up
        return () => {
            subscribe = false
        }
    }, deps)

    return {data, isLoading, error}
}

export const useAsyncCallback = <Args extends unknown[], Ret>(
    fn: (...args: Args) => Promise<Ret>
) => {
    const [isLoading, setIsLoading] = useState(false)
    const [data, setData] = useState<Ret | undefined>(undefined)
    const [error, setError] = useState<Error | undefined>(undefined)
    const result: ActionResponse<Args, Ret> = {
        data,
        error,
        isLoading,
        execute: (...arg) => {
            setIsLoading(true)
            fn(...arg)
                .then((data) => setData(data))
                .catch((error: Error) => setError(error))
                .finally(() => setIsLoading(false))
        }
    }
    return result
}
