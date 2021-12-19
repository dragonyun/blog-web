import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import router from './router';

function App() {

  return (
    <ConfigProvider
      locale={zhCN}
    >
      <Router>
        {
          router.map((item, index) => {
            return (
              <Route exact key={index} path={item.path} component={item.component} />
            )
          })
        }
      </Router>
    </ConfigProvider>

  );
}


export default App;
