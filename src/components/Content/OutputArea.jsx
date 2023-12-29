import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { List, Button, ConfigProvider, Modal, Input } from 'antd';
import { FileImageOutlined } from '@ant-design/icons';
import "./style.css"

class Code extends React.Component {
    render() {
        return <SyntaxHighlighter showLineNumbers={true}
            // startingLineNumber={0}
            language={this.props.lang}
            style={atomDark}
            lineNumberStyle={{ color: '#ddd', fontSize: 15 }}
            wrapLines={true}>
            {this.props.children.replace(/^\s+|\s+$/g, '')}
        </SyntaxHighlighter>
    }
}
function OutputArea(prop, ref) {
    const [parent] = useAutoAnimate()
    const [table, enableTableAnimations] = useAutoAnimate()
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [putText, setPutText] = useState()
    const [putId, setPutId] = useState()

    const showModal = (item) => {
        setPutText(item.content)
        setPutId(item.id)
        setIsModalOpen(true);
    };

    const handleOk = () => {
        // console.log(current+"sa")
        resetContent(putId, putText)
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    function resetContent(item, newContent) {
        let newPC = prop.previewContent
        newPC.forEach(it => {
            if (it['id'] == item) {
                it['content'] = <tr>
                    <td className="left">{newContent}
                    </td>
                    <td className="right">数据将显示于此
                    </td>
                </tr>
            }
        })
        let newC = prop.pureContent
        newC.forEach(it => {
            it['id'] === item ? it['content'] = newContent : null
        })
        prop.setPreviewContent(newPC)
        prop.setPureContent(newC)
    }

    let code = `
{| class="wikitable" style="width: 25em; color:#72777D; font-size: 90%; border: 1px solid #aaaaaa; margin-bottom: 0.5em; margin-left: 1em; padding: 0.2em; float: right; clear: right; text-align:right;"
! style="text-align: center; background-color:${prop.titleColor}; color:white;" colspan="2" |<span style="font-size:150%;font-weight:bold;"><i>{{PAGENAME}}</i></span>
|-
| colspan="2" class="image" | [[File:{{#if: {{{Image|}}}|{{{Image|}}}|No Image Available.png}}|thumb|center]]${prop.content.length != 0 ? prop.content.join('') : ""}
|}
`

    let codeRef = `
{{${prop.title ? prop.title : "出现错误：title未定义"}
|Image = ${prop.contentRef.length != 0 ? prop.contentRef.join('') : ""}
}}
    `
    useImperativeHandle(ref, () => {
        return { enableTableAnimations }
    })
    return (
        <div style={{ margin: "24px 60px 0", }} ref={parent}>
            <Modal title="修改内容" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} cancelText="取消" okText="确认">
                <p>请输入欲修改为的内容</p>
                <Input value={putText} onChange={(e) => setPutText(e.target.value)} onPressEnter={handleOk}/>
            </Modal>
            {prop.showCode ?
                <>
                    <pre><h1>模板页</h1>
                        <Code lang="jsx">
                            {code}
                        </Code>
                    </pre>
                    <pre><h1>模板引用</h1>
                        <Code lang="jsx">
                            {codeRef}
                        </Code>
                    </pre>
                </> :
                <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-around", flexWrap: "wrap" }}>
                    <div><h1 style={{ textAlign: "center" }}>预览</h1>
                        <table className='wikiTable'>
                            <tbody ref={table}>
                                <tr>
                                    <th style={{ textAlign: "center", backgroundColor: prop.titleColor, color: "white" }} colSpan="2">
                                        <span style={{ fontSize: "150%", fontWeight: "bold" }}><i>
                                            {prop.title ? prop.title : "出现错误：title未定义"}
                                        </i></span>
                                    </th>
                                </tr>
                                <tr>
                                    <td colSpan="2" className="image"><div className="center"><div className="thumb tnone"><div className="thumbinner" style={{ width: "182px" }}>
                                        <a title="No Image Available.png"><FileImageOutlined style={{ fontSize: "100px" }} /></a>
                                        <div className="thumbcaption"></div></div></div></div>
                                    </td>
                                </tr>
                                {prop.previewContent.map(item => <>{item.content}</>)}
                            </tbody>
                        </table>
                    </div>
                    <div style={{ minWidth: "400px" }}><h1 style={{ textAlign: "center" }}>已添加项</h1>
                        <ConfigProvider theme={{ components: { List: { contentWidth: 500 } } }}>
                            <List
                                header={<div>列表内容</div>}
                                bordered
                                dataSource={prop.pureContent}
                                renderItem={(item, index) => (
                                    <List.Item key={index} actions={[<ConfigProvider key={index + "CP"} theme={{ components: { Button: { ghostBg: "white" } } }}>
                                        <Button key={index + "buttonPut"} type='primary' onClick={() => showModal(item)} ghost>修改</Button>
                                    </ConfigProvider>, <Button key={index + "buttonDel"} onClick={() => prop.deleteItem(item.id)} danger>删除</Button>]}>
                                        {item.content}
                                    </List.Item>
                                )}
                            /></ConfigProvider>
                    </div>
                </div>
            }
        </div>
    )
}

export default forwardRef(OutputArea)