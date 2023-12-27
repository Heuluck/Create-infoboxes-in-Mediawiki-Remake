import React from 'react'
import ReactDOM from 'react-dom/client'
import { ConfigProvider } from "antd"
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ConfigProvider
      theme={{
        components: {
          Layout: {
            siderBg:"#ced6e0",
            triggerBg:"#ced6e0",
            triggerColor:"black",
          },
          Input:{
            colorBgContainerDisabled:"#ebebeb",
            addonBg:"#ebebeb",
          },
          Button:{
            colorBgContainerDisabled:"#c4c4c4"
          }
        },
      }}>
      <App />
    </ConfigProvider>
  </React.StrictMode>,
)
