import { Space, Input, Button, Progress, Tooltip, ColorPicker } from "antd"
import { useState } from "react"
import { useAutoAnimate } from '@formkit/auto-animate/react'
import React from "react"
import { InfoCircleOutlined } from '@ant-design/icons';

class CenterIt extends React.Component {
    render() {
        return <Space.Compact style={{ width: '100%', margin: "40px auto 10px", alignItems: "center", justifyContent: "center" }}>
            {this.props.children}
        </Space.Compact>
    }
}

class Center extends React.Component {
    render() {
        return <Space style={{ width: '100%', margin: "5px auto", alignItems: "center", justifyContent: "center" }}>
            {this.props.children}
        </Space>
    }
}

export default function InputArea(prop) {
    const [percent, setPercent] = useState(0)
    const [titleVisibility, setTitleVisibility] = useState(true)//标题输入是否显示
    const [contentAvailability, setContentAvailability] = useState(true)//内容输入是否【禁用】
    const [contentVisibility, setContentVisibility] = useState(true)//内容输入是否显示
    const [comfirmVisibility, setComfirmVisibility] = useState(false)//确认是否显示
    const [title, inputTitle] = useState()
    const [singleContent, inputSingle] = useState()
    const [count, setCount] = useState(1)
    const [parent, enableAnimations] = useAutoAnimate()

    function titleSubmitHandler() {
        setTitleVisibility(false)
        setContentAvailability(false)
        prop.setTitle(title)
        setPercent(30)
    }

    function contentSubmitHandler(content) {
        prop.setContent(current => [...current,
        `\n|-
{{#if: {{{${content}|}}} |
{{!}}  class="left" {{!}} ${content}
{{!}}  class="right" {{!}} {{{${content}|}}}}}`])

        prop.setContentRef(current => [...current,
        `\n|${content} =`])

        prop.setPreviewContent(current => [...current, <tr>
            <td className="left">{content}
            </td>
            <td className="right">数据将显示于此
            </td>
        </tr>])
        inputSingle()
        setPercent(current => current < 90 ? current + 2 : current)
        setCount(current => current + 1)
        setComfirmVisibility(true)
    }

    return (
        <div ref={parent}>
            {contentVisibility && <><Space.Compact style={{ width: '98%', margin: "5px auto", alignItems: "center", justifyContent: "center", padding: "25px" }}><Progress percent={percent} size={["default", 20]} /></Space.Compact>
                <p style={{ textAlign: "center" }}>在下方填写相关信息</p></>}
            {titleVisibility && <CenterIt>
                <Input addonBefore="标题" placeholder="请输入Infobox的标题" style={{ width: "70%" }} allowClear suffix={
                    <Tooltip title="也就是模板页的页面标题">
                        <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                    </Tooltip>} value={title} onChange={(e) => inputTitle(e.target.value)} onPressEnter={() => { titleSubmitHandler() }} />
                <Button type="primary" onClick={() => { titleSubmitHandler() }}>提交</Button>
            </CenterIt>}
            {contentVisibility && <><CenterIt>
                <Input addonBefore={`第${count}条内容`} placeholder={`请输入第${count}条内容`} style={{ width: "70%" }} disabled={contentAvailability} allowClear
                    value={singleContent} onChange={(e) => inputSingle(e.target.value)} onPressEnter={() => { contentSubmitHandler(singleContent) /*在这里传入防止一些奇怪问题*/ }} />
                <Button type="primary" onClick={() => { contentSubmitHandler(singleContent) /*在这里传入防止一些奇怪问题*/ }} disabled={contentAvailability}>提交</Button>
            </CenterIt>
                <Center><ColorPicker defaultValue="#3366CC" onChange={(e)=>{prop.setTitleColor(e.toHexString())}} showText={(color) => <span>标题颜色：{color.toHexString()}</span>}  disabled={contentAvailability} /></Center></>}
            {comfirmVisibility && <Center><Button type="primary" onClick={() => { prop.setShowCode(true); setContentVisibility(false); setComfirmVisibility(false); setPercent(100) }} block>完成</Button></Center>}
            <CenterIt><Progress type="circle" percent={percent} style={{ backgroundColor: "white", borderRadius: "80px" }} /></CenterIt>
        </div>
    )
}