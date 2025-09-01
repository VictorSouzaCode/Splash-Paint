import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './redux/store.ts'
import App from './App.tsx'
import "./splashOutput.css"

// New fixes to do
// the performance got a little bit slower, this one is more tricky to solve though, look at chat gpt readme review feedback conversation to better understand how to improve the performance of the strokes
// When i minimize the screen if i have it colored the full screen when i make it bigger again i get white borders around the colored space

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
      <App />
    </Provider>
)

/* <StrictMode>
    
  </StrictMode>, */
