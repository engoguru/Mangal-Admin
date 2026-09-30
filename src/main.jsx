import ReactDOM from 'react-dom/client'
import { ConfigProvider } from 'antd'
import App from './App.jsx'
import './index.css'
import { Provider } from 'react-redux'
import { store } from './app/store.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#b3201a',
          borderRadius: 10,
          fontFamily: '"Mukta", ui-sans-serif, system-ui, sans-serif',
        },
      }}
    >
      <App />
    </ConfigProvider>
  </Provider>
);
