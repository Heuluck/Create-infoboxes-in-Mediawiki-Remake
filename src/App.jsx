import { useState,useEffect } from 'react'
import { Layout} from "antd"
import './App.css'
const { Header, Content, Footer, Sider } = Layout;
import InputArea from './components/Left/InputArea';
import OutputArea from './components/Content/OutputArea';
import { Routes, Route, useNavigate } from "react-router-dom"
function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Index />}></Route>
      </Routes>
    </>
  )
}

function Index(){
  const [count, setCount] = useState(0)
  const [title, setTitle] = useState('待输入')
  const [content, setContent] = useState([])
  const [contentRef, setContentRef] = useState([])
  function getWindowSize() {
    const {innerWidth, innerHeight} = window;
    return {innerWidth, innerHeight};
  }
  const [windowSize, setWindowSize] = useState(getWindowSize());

  useEffect(() => {
    function handleWindowResize() {
      setWindowSize(getWindowSize());
    } 
    window.addEventListener('resize', handleWindowResize);
    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);
  return(
    <Layout style={{ minHeight: '100vh' }}>
        <Sider width={"22%"} >
          <InputArea setTitle={setTitle} setContent={setContent} setContentRef={setContentRef} />
        </Sider>
        <Layout>
          <Content style={{overflowY:"scroll",height:windowSize.innerHeight,flex:"none"}}>
            <OutputArea title={title} content={content} contentRef={contentRef}/>
          </Content>
        </Layout>
      </Layout>
  )
}

export default App
