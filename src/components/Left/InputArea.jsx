import { Space, Input, Button, Progress, Tooltip, ColorPicker, Alert } from "antd"
import { useState } from "react"
import { useAutoAnimate } from '@formkit/auto-animate/react'
import React from "react"
import { InfoCircleOutlined } from '@ant-design/icons';
import "./style.css"

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
    const t = prop.t;
    const i18n = prop.i18n;
    const [percent, setPercent] = useState(0)
    const [titleVisibility, setTitleVisibility] = useState(true)//标题输入是否显示
    const [contentAvailability, setContentAvailability] = useState(true)//内容输入是否【禁用】
    const [contentVisibility, setContentVisibility] = useState(true)//内容输入是否显示
    const [confirmVisibility, setConfirmVisibility] = useState(false)//确认是否显示
    const [title, inputTitle] = useState()
    const [singleContent, inputSingle] = useState()
    const [count, setCount] = useState(1)
    const [showAlert, setShowAlert] = useState(false)
    const [showMoreConfig,setShowMoreConfig] = useState(false)
    const [parent, enableAnimations] = useAutoAnimate()
    const [moreConfigAnime, enableMoreConfigAnime] = useAutoAnimate()

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
                <td className="right">{t('Output.Preview.contentShowHere')}
                </td>
            </tr>
        }])
        prop.setPureContent(current => [...current, { "id": count, "content": content }])

        inputSingle()
        setPercent(current => current < 90 ? current + 2 : current)
        setConfirmVisibility(true)
    }

    const onFinishHandler = () => {
        prop.pureContent.forEach(item => {
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
        setConfirmVisibility(false);
        setPercent(100);
    }

    const preventEmpty = (cont, func) => {
        if (cont == null || cont.replace(/[ ]+$/g, "").length == 0)//是否为null/空/空格
            setShowAlert(true)
        else {
            setShowAlert(false)
            func(cont.replace(/^\s*|\s*$/g, ''))
        }
    }

    return (
        <div ref={parent}>
            {/* 头部区域 */}
            {contentVisibility && <>
                <Space.Compact style={{ width: '98%', margin: "5px auto", alignItems: "center", justifyContent: "center", padding: "25px" }}>
                    <Progress percent={percent} size={["default", 20]} />
                </Space.Compact>
                <p style={{ textAlign: "center" }}>{t("fillInfoBelow")}</p>
                {/* 警告框 */}
                {showAlert ? <Space style={{ width: '98%', margin: "5px 0 0 0 ", alignItems: "center", justifyContent: "center", padding: "0" }}>
                    <Alert message={t("contentRequired")} type="warning" showIcon />
                </Space> : null}</>}
            {/* 标题输入 */}
            {titleVisibility && <CenterIt>
                <Input addonBefore={t("title")} placeholder={t("Input.PlzInput")} style={{ width: "70%" }} allowClear suffix={
                    <Tooltip title={t("Input.titleTip")}>
                        <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                    </Tooltip>} value={title} onChange={(e) => inputTitle(e.target.value)} onPressEnter={() => { preventEmpty(title, titleSubmitHandler) }} />
                <Button type="primary" onClick={() => { preventEmpty(title, titleSubmitHandler) }}>{t("Input.submit")}</Button>
            </CenterIt>}
            {/* 内容输入 */}
            {contentVisibility && <>
                <CenterIt>
                    <Input addonBefore={t("Input.contentNumberTitle",{count:count-prop.delItemCount})} placeholder={t("Input.contentNumberTitlePlaceHolder",{count:count-prop.delItemCount})} style={{ width: "70%" }} disabled={contentAvailability} allowClear
                        value={singleContent} onChange={(e) => inputSingle(e.target.value)} onPressEnter={() => { preventEmpty(singleContent, contentSubmitHandler) /*在这里传入防止一些奇怪问题*/ }} />
                    <Button type="primary" onClick={() => { preventEmpty(singleContent, contentSubmitHandler) /*在这里传入防止一些奇怪问题*/ }} disabled={contentAvailability}>{t("Input.submit")}</Button>
                </CenterIt>
                {/* 更多设置 */}
                {!contentAvailability && <div className="moreConfig" ref={moreConfigAnime}>
                    <strong className="moreConfig" onClick={()=>setShowMoreConfig(!showMoreConfig)}>{t("Input.moreConfig")}</strong>
                    {showMoreConfig && <div style={{ margin: "1em" }}>
                        <span className="configTitle">{t("Input.titlebg")}<ColorPicker defaultValue="#3366CC" onChange={(e) => { prop.setTitleColor(e.toHexString()) }} showText={(color) => <span>{color.toHexString()}</span>} disabled={contentAvailability} /></span>
                    </div>}
                </div>}</>}
            {/* 确认按钮 */}
            {count-prop.delItemCount > 1 && confirmVisibility && <Center>
                <Button type="primary" onClick={() => { onFinishHandler() }} block>{t("Input.finish")}</Button>
            </Center>}
            {/* 进度仪表盘 */}
            <CenterIt><Progress type="circle" percent={percent} style={{ backgroundColor: "white", borderRadius: "80px" }} /></CenterIt>
        </div>
    )
}
// border-radius: .5em;
// background-color: #fff;
// margin-bottom: 2em;