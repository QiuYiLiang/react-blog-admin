import React,{ useState, useEffect } from 'react'
import marked from 'marked'
import '../static/style/AddArticle.css'
import { Row, Col, Input, Select, Button, DatePicker, message } from 'antd'
import axios from 'axios'
import servicePath from "../config/apiUrl";
import moment from "moment";
const { Option } = Select;
const { TextArea } = Input;

const AddArticle = (props) => {

    const [articleId,setArticleId] = useState(0);  // 文章的ID，如果是0说明是新增加，如果不是0，说明是修改
    const [articleTitle,setArticleTitle] = useState('');   //文章标题
    const [articleContent , setArticleContent] = useState('');  //markdown的编辑内容
    const [markdownContent, setMarkdownContent] = useState('预览内容'); //html内容
    const [introduceMd,setIntroduceMd] = useState();            //简介的markdown内容
    const [introduceHtml,setIntroduceHtml] = useState('等待编辑'); //简介的html内容
    const [showDate,setShowDate] = useState();   //发布日期
    const [typeInfo ,setTypeInfo] = useState([]); // 文章类别信息
    const [selectedType,setSelectType] = useState('分类'); //选择的文章类别

    useEffect(() => {
        getTypeInfo();
        let tmpId = props.match.params.id;
        if (tmpId) {
            setArticleId(tmpId);
            getArticleById(tmpId);
        }
    },[]);

    marked.setOptions({
        renderer: marked.renderer,
        gfm: true,
        pedantic: false,
        sanitize: false,
        tables: true,
        breaks: false,
        smartLists: true,
        smartypants: false,
    });

    const changeContent = e => {
        setArticleContent(e.target.value);
        let html = marked(e.target.value);
        setMarkdownContent(html);
    };

    const changeIntroduce = e => {
        setIntroduceMd(e.target.value);
        let html = marked(e.target.value);
        setIntroduceHtml(html);
    };

    const getTypeInfo = () => {
      axios({
          method: 'get',
          url: servicePath.getTypeInfo,
          withCredentials: true
      }).then(
          res => {
              if(res.data.data === '没有登录'){
                  localStorage.removeItem('openId');
                  props.history.push('/')
              } else {
                  setTypeInfo(res.data.data)
              }
          }
      )
    };

    const selectTypeHandler = (value) => {
        setSelectType(value)
    };

    const saveArticle = () => {
        if (!articleContent) {
            message.error('文章内容不能为空');
            return false
        } else if (!articleTitle) {
            message.error('文章标题不能为空');
            return false
        } else if (!introduceMd) {
            message.error('文章简介不能为空');
            return false
        } else if (selectedType === '分类') {
            message.error('选择文章类型');
            return false
        } else if (!showDate) {
            message.error('选择发布时间');
            return false
        }
        let dataProps = {};
        dataProps.article_content = articleContent;
        dataProps.title = articleTitle;
        dataProps.introduce = introduceMd;
        dataProps.type_id = selectedType;
        let dateText = showDate.replace('-','/');
        dataProps.addTime = (new Date(dateText).getTime())/1000;

        if(articleId === 0){
            dataProps.view_count = 0;
            axios({
                method: 'post',
                url: servicePath.addArticle,
                data: dataProps,
                withCredentials: true
            }).then(
                res => {
                    if (res.data.isSuccess) {
                        message.success('文章保存成功')
                    } else {
                        message.error('文章保存失败')
                    }
                    setArticleId(res.data.insertId);
                }
            )
        } else {
            dataProps.id = articleId;
            axios({
                method: 'post',
                url: servicePath.updateArticle,
                data: dataProps,
                withCredentials: true
            }).then(
                res => {
                    if (res.data.isSuccess) {
                        message.success('文章修改成功')
                    } else {
                        message.error('文章修改失败')
                    }
                }
            )
        }
    };

    const getArticleById = (id) => {
        axios({
            method: 'get',
            url: servicePath.getArticleById + id,
            withCredentials: true
        }).then(
            res => {
                let articleInfo = res.data.data[0];
                setArticleTitle(articleInfo.title);
                setArticleContent(articleInfo.article);
                let html = marked(articleInfo.article);
                setMarkdownContent(html);
                setIntroduceMd(articleInfo.introduce);
                let tmpInt = marked(articleInfo.introduce);
                setIntroduceHtml(tmpInt);
                setShowDate(articleInfo.addTime);
                setShowDate(articleInfo.addTime);
                setSelectType(articleInfo.typeId);
            }
        )
    };

    return (
        <div>
            <Row gutter={5}>
                <Col span={18}>
                    <Row gutter={10}>
                        <Col span={20}>
                            <Input
                                onChange={(e) => {setArticleTitle(e.target.value)}}
                                placeholder={'博客标题'}
                                size={'large'}
                                value={articleTitle}
                            />
                        </Col>
                        <Col span={4}>
                            &nbsp;
                            <Select
                                defaultValue={selectedType}
                                size={'large'}
                                onChange={selectTypeHandler}
                                value={selectedType}
                            >
                                {
                                    typeInfo.map((item,index) => {
                                        return <Option key={index} value={item.id}>{item.typeName}</Option>
                                    })
                                }
                            </Select>
                        </Col>
                    </Row>
                    <br/>
                    <Row gutter={10}>
                        <Col span={12}>
                            <TextArea
                                className={'markdown-content'}
                                rows={35}
                                placeholder={'文章内容'}
                                onChange={changeContent}
                                value={articleContent}
                            />
                        </Col>
                        <Col span={12}>
                            <div className="show-html"
                                dangerouslySetInnerHTML={{__html:markdownContent}}
                            />
                        </Col>
                    </Row>
                </Col>
                <Col span={6}>
                    <Row>
                        <Col span={24}>
                            <Button size={"large"}>暂存文章</Button>
                            <Button type={"primary"} size={"large"} onClick={saveArticle}>发布文章</Button>
                            <br/>
                        </Col>
                        <Col span={24}>
                            <br/>
                            <TextArea
                                rows={4}
                                placeholder={'文章简介'}
                                onChange={changeIntroduce}
                                value={introduceMd}
                            />
                            <br/><br/>
                            <div className={'introduce-html'}
                                 dangerouslySetInnerHTML={{__html:'文章简介：' + introduceHtml}}
                            >
                            </div>
                        </Col>
                        <Col span={12}>
                            <div className="data-select">
                                <DatePicker
                                    onChange={(date,dateString) => {setShowDate(dateString)}}
                                    placeholder={'发布日期'}
                                    size={'large'}
                                    defaultValue={moment(showDate)}
                                />
                            </div>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>
    )
};

export default AddArticle