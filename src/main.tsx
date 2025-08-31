import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './redux/store.ts'
import App from './App.tsx'
import "./splashOutput.css"

// bug needing fix asap, when the app initializes, the smooth effect is not applied to the brush, it only gets applied when the user interacts with the ui and then draw a stroke again on the screen, see chat gpt for clues on what to do

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
      <App />
    </Provider>
)

/* <StrictMode>
    
  </StrictMode>, */
