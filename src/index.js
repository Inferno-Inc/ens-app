import React from 'react'
import ReactDOM from 'react-dom'
import { ApolloProvider } from 'react-apollo'
import 'core-js/es/object'
import App from 'App'
import { setupENS } from '@energywebfoundation/ens-ui'
import { SET_ERROR } from 'graphql/mutations'

import { GlobalStateProvider } from 'globalState'
import 'globalStyles'
import { setupClient } from 'apolloClient'
import { getNetworkId } from '@energywebfoundation/ens-ui'

window.addEventListener('load', async () => {
  let client
  let networkId

  try {
    if (
      process.env.REACT_APP_STAGE === 'local' &&
      process.env.REACT_APP_ENS_ADDRESS
    ) {
      await setupENS({
        reloadOnAccountsChange: true,
        customProvider: 'http://localhost:8545',
        ensAddress: process.env.REACT_APP_ENS_ADDRESS
      })
    } else {
      await setupENS({
        reloadOnAccountsChange: true
      })
    }
    networkId = await getNetworkId()
    client = await setupClient(networkId)
  } catch (e) {
    console.log(e)
    networkId = networkId || 1
    if (!client) {
      client = await setupClient(networkId)
    }

    await client.mutate({
      mutation: SET_ERROR,
      variables: { message: e.message }
    })
  }
  ReactDOM.render(
    <ApolloProvider client={client}>
      <GlobalStateProvider>
        <App />
      </GlobalStateProvider>
    </ApolloProvider>,
    document.getElementById('root')
  )
})
