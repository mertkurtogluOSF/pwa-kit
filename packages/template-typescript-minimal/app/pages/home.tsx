/*
 * Copyright (c) 2021, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import React from 'react'
import {useUser} from './utils'
import {withSuspense} from './with-suspense'
function Product() {
    // Try to read user info, although it might not have loaded yet
    const user = useUser();

    return <h1>{user.name}</h1>;
  }

const Home = () => {

    const user = useUser();

    return <h1>{user.name}</h1>;
}

Home.getTemplateName = () => 'home'


export default withSuspense(Home)
