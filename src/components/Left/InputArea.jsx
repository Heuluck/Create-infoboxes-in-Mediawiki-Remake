import { Space, Input, Button, Progress, Tooltip, ColorPicker, Alert } from "antd"
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
    const [showAlert,setShowAlert] = useState(false)
    const [parent, enableAnimations] = useAutoAnimate()

    function titleSubmitHandler() {
        setTitleVisibility(false)
        setContentAvailability(false)
        prop.setTitle(title)
        setPercent(30)
    }

    function contentSubmitHandler(content) {
        prop.enableTableAnimations(true)
        setCount(current => current + 1)
        prop.setPreviewContent(current => [...current, {
            "id": count, "content": <tr>
                <td className="left">{content}
                </td>
                <td className="right">数据将显示于此
                </td>
            </tr>
        }])

        prop.setPureContent(current => [...current, { "id": count, "content": content }])
        inputSingle()
        setPercent(current => current < 90 ? current + 2 : current)
        setComfirmVisibility(true)
    }

    const onFinishHandler = () => {
        prop.pureContent.forEach(item=>{
            const content = item.content
            prop.setContent(current => [...current,
            `\n|-
{{#if: {{{${content}|}}} |
{{!}}  class="left" {{!}} ${content}
{{!}}  class="right" {{!}} {{{${content}|}}}}}`
            ])
        prop.setContentRef(current => [...current,
        `\n|${content} =`])
            console.log(content)
    })
        prop.setShowCode(true);
        setContentVisibility(false);
        setComfirmVisibility(false);
        setPercent(100);
    }

    const preventEmpty=(cont,func)=>{
        if (cont == null||cont.replace(/[ ]+$/g, "").length == 0)//是否为null/空/空格
            setShowAlert(true)
        else{
            setShowAlert(false)
            func(cont)
        }
    }

    return (
        <div ref={parent}>
            {contentVisibility && <><Space.Compact style={{ width: '98%', margin: "5px auto", alignItems: "center", justifyContent: "center", padding: "25px" }}><Progress percent={percent} size={["default", 20]} /></Space.Compact>
                <p style={{ textAlign: "center" }}>在下方填写相关信息</p>{showAlert?<Space style={{ width: '98%', margin: "5px 0 0 0 ", alignItems: "center", justifyContent: "center", padding: "0" }}><Alert message="内容为必填项" type="warning" showIcon /></Space>:null}</>}
            {titleVisibility && <CenterIt>
                <Input addonBefore="标题" placeholder="请输入Infobox的标题" style={{ width: "70%" }} allowClear suffix={
                    <Tooltip title="也就是模板页的页面标题">
                        <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                    </Tooltip>} value={title} onChange={(e) => inputTitle(e.target.value)} onPressEnter={() => { preventEmpty(title,titleSubmitHandler) }} />
                <Button type="primary" onClick={() => { preventEmpty(title,titleSubmitHandler) }}>提交</Button>
            </CenterIt>}
            {contentVisibility && <><CenterIt>
                <Input addonBefore={`第${count}条内容`} placeholder={`请输入第${count}条内容`} style={{ width: "70%" }} disabled={contentAvailability} allowClear
                    value={singleContent} onChange={(e) => inputSingle(e.target.value)} onPressEnter={() => { preventEmpty(singleContent,contentSubmitHandler) /*在这里传入防止一些奇怪问题*/ }} />
                <Button type="primary" onClick={() => { preventEmpty(singleContent,contentSubmitHandler) /*在这里传入防止一些奇怪问题*/ }} disabled={contentAvailability}>提交</Button>
            </CenterIt>
                <Center><ColorPicker defaultValue="#3366CC" onChange={(e) => { prop.setTitleColor(e.toHexString()) }} showText={(color) => <span>标题颜色：{color.toHexString()}</span>} disabled={contentAvailability} /></Center></>}
            {comfirmVisibility && <Center><Button type="primary" onClick={() => { onFinishHandler() }} block>完成</Button></Center>}
            <CenterIt><Progress type="circle" percent={percent} style={{ backgroundColor: "white", borderRadius: "80px" }} /></CenterIt>
        </div>
    )
}