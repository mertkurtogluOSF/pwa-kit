import React from 'react'
import {
    createServerEffectContext,
    getAllContexts,
} from 'pwa-kit-react-sdk/ssr/universal/server-effects'

// NOTE: This is the important part of the API, here we get a context with a hook that will
// use that context.
const {ServerEffectProvider, useServerEffect} = createServerEffectContext('scapiHooks')

const SCAPIContext = React.createContext()
const initialValue = {name: 'scapiHooks', data: {}, requests: []}

const SCAPIProvider = (props) => {
    // TODO: Figure out a cleaner API for getting the current value for the context.
    const {scapiHooks} = getAllContexts()
    const effectsValues =
        typeof window === 'undefined'
            ? scapiHooks || initialValue
            : window.__PRELOADED_STATE__.scapiHooks

    return (
        <SCAPIContext.Provider value={{}}>
            <ServerEffectProvider value={effectsValues}>{props.children}</ServerEffectProvider>
        </SCAPIContext.Provider>
    )
}

const AppConfig = ({children}) => {
    return <SCAPIProvider>{children}</SCAPIProvider>
}

AppConfig.restore = () => {}
AppConfig.freeze = () => {}
AppConfig.extraGetPropsArgs = () => {}

export default AppConfig
export {useServerEffect}
