import { Space, Input, Button, Progress, Tooltip } from "antd"
import { useState } from "react"
import { useAutoAnimate } from '@formkit/auto-animate/react'
import React from "react"
import { InfoCircleOutlined } from '@ant-design/icons';

class CenterIt extends React.Component {
    render() {
        return <Space.Compact style={{ width: '100%', margin: "40px auto", alignItems: "center", justifyContent: "center" }}>
            {this.props.children}
        </Space.Compact>
    }
}

export default function InputArea(prop) {
    const [percent, setPercent] = useState(0)
    const [titleVisibility, setTitleVisibility] = useState(true)//标题输入是否显示
    const [contentVisibility, setContentVisibility] = useState(true)//内容输入是否【禁用】
    const [title, inputTitle] = useState()
    const [singleContent, inputSingle] = useState()
    const [count, setCount] = useState(1)
    const [parent, enableAnimations] = useAutoAnimate()

    function titleSubmitHandler() {
        setTitleVisibility(false)
        setContentVisibility(false)
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
        inputSingle()
        setPercent(current=>current<90?current+2:current)
        setCount(current=>current+1)
    }

    return (
        <div ref={parent}>
            <Space.Compact style={{ width: '100%', margin: "5px auto", alignItems: "center", justifyContent: "center", padding: "25px" }}><Progress percent={percent} size={["default", 20]} /></Space.Compact>
            <p style={{ textAlign: "center" }}>在下方填写相关信息</p>
            {titleVisibility && <CenterIt>
                <Input addonBefore="标题" placeholder="请输入Infobox的标题" style={{ width: "70%" }} allowClear suffix={
                    <Tooltip title="也就是模板页的页面标题">
                        <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                    </Tooltip>} value={title} onChange={(e) => inputTitle(e.target.value)} />
                <Button type="primary" onClick={() => { titleSubmitHandler() }}>提交</Button>
            </CenterIt>}
            <CenterIt>
                <Input addonBefore={`第${count}条内容`}placeholder={`请输入第${count}条内容`} style={{ width: "70%" }} disabled={contentVisibility} allowClear
                    value={singleContent} onChange={(e) => inputSingle(e.target.value)} />
                <Button type="primary" onClick={() => { contentSubmitHandler(singleContent) /*在这里传入防止一些奇怪问题*/ }} disabled={contentVisibility}>提交</Button>
            </CenterIt>
            <CenterIt><Progress type="circle" percent={percent} /></CenterIt>
        </div>
    )
}