import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { List, Button, ConfigProvider } from 'antd';
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
const data = [
    'Racing car sprays burning fuel into crowd.',
    'Japanese princess to wed commoner.',
    'Australian walks 100km after outback crash.',
    'Man charged over missing wedding girl.',
    'Los Angeles battles huge wildfires.',
];
export default function OutputArea(prop) {
    const [parent, enableAnimations] = useAutoAnimate()
    const [table, enableTableAnimations] = useAutoAnimate()
    let code = `
{| class="wikitable" style="width: 25em; color:#72777D; font-size: 90%; border: 1px solid #aaaaaa; margin-bottom: 0.5em; margin-left: 1em; padding: 0.2em; float: right; clear: right; text-align:right;"
! style="text-align: center; background-color:${prop.titleColor}; color:white;" colspan="2" |<span style="font-size:150%;font-weight:bold;"><i>{{PAGENAME}}</i></span>
|-
| colspan="2" class="image" | [[File:{{{图片|No Image Available.png}}}|缩略图|居中|link=]]${prop.content.length != 0 ? prop.content.map(item=><>{item.theContent}</>) : ""}
|}
`

    let codeRef = `
{{${prop.title ? prop.title : "出现错误：title未定义"}${prop.contentRef.length != 0 ? prop.contentRef.map(item=><>{item.theContent}</>) : ""}
}}
    `
    return (
        <div style={{ margin: "24px 60px 0", }} ref={parent}>
            {prop.showCode ? <>
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
                <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-around",flexWrap:"wrap" }}>
                    <div><h1 style={{textAlign:"center"}}>预览</h1>
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
                                        <a title="文件:No Image Available.png"><FileImageOutlined style={{ fontSize: "100px" }} /></a>
                                        <div className="thumbcaption"></div></div></div></div>
                                    </td>
                                </tr>
                                {prop.previewContent.map(item=><>{item.content}</>)}
                            </tbody>
                        </table>
                    </div>
                    <div style={{minWidth:"400px"}}><h1 style={{textAlign:"center"}}>已添加项</h1>
                    <ConfigProvider theme={{ components: { List: { contentWidth: 500 } } }}><List
                            header={<div>列表内容</div>}
                            bordered
                            dataSource={prop.pureContent}
                            renderItem={(item,index) => (
                                <List.Item key={index} actions={[<Button onClick={()=>prop.deleteItem(item.id)} danger>删除</Button>]}>{/*<ConfigProvider theme={{ components: { Button: { ghostBg: "white" } } }}><Button type='primary' onClick={()=>alert(prop.pureContent[index])} ghost>修改</Button></ConfigProvider>, */}
                                    {item.content}
                                </List.Item>
                            )}
                        /></ConfigProvider>
                    </div>
                </div>}
        </div>
    )
}