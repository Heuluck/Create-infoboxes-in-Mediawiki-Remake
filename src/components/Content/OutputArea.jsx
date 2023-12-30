import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { List, Button, ConfigProvider, Modal, Input, FloatButton } from 'antd';
import { FileImageOutlined, GlobalOutlined, CopyOutlined } from '@ant-design/icons';
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
    const t = prop.t;
    const i18n = prop.i18n;
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
                    <td className="right">{t('Output.Preview.contentShowHere')}
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

    let code = `{| class="wikitable" style="width: 25em; color:#72777D; font-size: 90%; border: 1px solid #aaaaaa; margin-bottom: 0.5em; margin-left: 1em; padding: 0.2em; float: right; clear: right; text-align:right;"
! style="text-align: center; background-color:${prop.titleColor}; color:white;" colspan="2" |<span style="font-size:150%;font-weight:bold;"><i>{{PAGENAME}}</i></span>
|-
| colspan="2" class="image" | [[File:{{#if: {{{Image|}}}|{{{Image|}}}|No Image Available.png}}|thumb|center]]${prop.content.length != 0 ? prop.content.join('') : ""}
|}`

    let codeRef = `{{${prop.title ? prop.title : t('Output.Usage.titleUndefined')}
|Image = ${prop.contentRef.length != 0 ? prop.contentRef.join('') : ""}
}}`
    useImperativeHandle(ref, () => {
        return { enableTableAnimations }
    })
    return (
        <div style={{ margin: "24px 60px 0", }} ref={parent}>
            <Modal title={t("Output.List.inputChange")} open={isModalOpen} onOk={handleOk} onCancel={handleCancel} cancelText={t("Output.List.cancle")} okText={t("Output.List.confirm")}>
                <p>{t("Output.List.inputChangeTo")}</p>
                <Input value={putText} onChange={(e) => setPutText(e.target.value)} onPressEnter={handleOk} />
            </Modal>
            {prop.showCode ?
                <><h1 className="codeH1">{t("Output.Template.title")} <Button onClick={()=>navigator.clipboard.writeText(code)} icon={<CopyOutlined />}>{t("Output.Template.copy")}</Button></h1>
                    <pre>
                        <Code lang="jsx">
                            {code}
                        </Code>
                    </pre>
                    <h1 className="codeH1">{t("Output.Usage.title")} <Button onClick={()=>navigator.clipboard.writeText(codeRef)} icon={<CopyOutlined />}>{t("Output.Template.copy")}</Button></h1>
                    <pre>
                        <Code lang="jsx">
                            {codeRef}
                        </Code>
                    </pre>
                </> :
                <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-around", flexWrap: "wrap" }}>
                    <div><h1 style={{ textAlign: "center" }}>{t("Output.Preview.title")}</h1>
                        <table className='wikiTable'>
                            <tbody ref={table}>
                                <tr>
                                    <th style={{ textAlign: "center", backgroundColor: prop.titleColor, color: "white" }} colSpan="2">
                                        <span style={{ fontSize: "150%", fontWeight: "bold" }}><i>
                                            {prop.title ? prop.title : t('Output.Preview.defaultTitle')}
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
                    <div style={{ minWidth: "400px" }}><h1 style={{ textAlign: "center" }}>{t("Output.List.title")}</h1>
                        <ConfigProvider theme={{ components: { List: { contentWidth: 500 } } }}>
                            <List
                                header={<div>{t("Output.List.header")}</div>}
                                bordered
                                dataSource={prop.pureContent}
                                renderItem={(item, index) => (
                                    <List.Item key={index} actions={[<ConfigProvider key={index + "CP"} theme={{ components: { Button: { ghostBg: "white" } } }}>
                                        <Button key={index + "buttonPut"} type='primary' onClick={() => showModal(item)} ghost>{t("Output.List.change")}</Button>
                                    </ConfigProvider>, <Button key={index + "buttonDel"} onClick={() => prop.deleteItem(item.id)} danger>{t("Output.List.delete")}</Button>]}>
                                        {item.content}
                                    </List.Item>
                                )}
                            /></ConfigProvider>
                    </div>
                </div>
            }
            <FloatButton.Group
                trigger="click"
                type="primary"
                style={{ right: "4%" }}
                icon={<GlobalOutlined />}
                tooltip={<span>语言 / Language</span>}
            >
                <FloatButton description="中文" onClick={()=>{i18n.changeLanguage("zh")}}/>
                <FloatButton description="EN" onClick={()=>{i18n.changeLanguage("en")}}/>
            </FloatButton.Group>
        </div>
    )
}

export default forwardRef(OutputArea)