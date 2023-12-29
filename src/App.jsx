import { useState, useEffect, useRef } from 'react'
import { Layout } from "antd"
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

function Index() {
  const [collapsed, setCollapsed] = useState(false);
  const [title, setTitle] = useState('标题待输入')
  const [content, setContent] = useState([])
  const [contentRef, setContentRef] = useState([])
  const [previewContent, setPreviewContent] = useState([])
  let [pureContent, setPureContent] = useState([])
  const [titleColor, setTitleColor] = useState('#3366CC')
  const [showCode, setShow] = useState(false)
  const outPutRef = useRef(null)
  function getWindowSize() {
    const { innerWidth, innerHeight } = window;
    return { innerWidth, innerHeight };
  }
  const [windowSize, setWindowSize] = useState(getWindowSize());

  const deleteItem = (index) => {
    enableTableAnimations(false)
    setPreviewContent(current=>current.filter(a =>
      a.id !== index
      ))
    setPureContent(current=>current.filter(a =>
      a.id !== index
    ))
  }
  function enableTableAnimations(bool){
    outPutRef.current.enableTableAnimations(bool)
  }

  useEffect(() => {
    function handleWindowResize() {
      setWindowSize(getWindowSize());
    }
    window.addEventListener('resize', handleWindowResize);
    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={"360px"} collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)} breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={(broken) => {
          console.log(broken);
        }}>
        <InputArea pureContent={pureContent} setTitle={setTitle}
        setContent={setContent} setContentRef={setContentRef}
        setShowCode={setShow} setPreviewContent={setPreviewContent}
        setTitleColor={setTitleColor} setPureContent={setPureContent} 
        enableTableAnimations={enableTableAnimations}/>
      </Sider>
      <Layout>
        <Content style={{ overflowY: "scroll", height: windowSize.innerHeight, flex: "none" }}>
          <OutputArea title={title} content={content}
            contentRef={contentRef} showCode={showCode}
            previewContent={previewContent} titleColor={titleColor}
            pureContent={pureContent} setPureContent={setPureContent}
            deleteItem={deleteItem} ref={outPutRef} />
        </Content>
      </Layout>
    </Layout>
  )
}

export default App
