import React, {useState} from "react"
import 'antd/dist/antd.css'
import { Card, Input, Button, Spin, message} from "antd";
import '../static/style/Login.css'
import {
    UserOutlined,
    KeyOutlined,
} from '@ant-design/icons'
import servicePath from "../config/apiUrl"
import axios from 'axios'

const Login = (props) => {

    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setInLoading] = useState(false);
    const checkLogin = () => {
        setInLoading(true);
        if(!userName){
            message.error('用户名不能为空');
            setTimeout(()=>{
                setInLoading(false)
            },500);
            return false
        } else if (!password){
            message.error('密码不能为空');
            setTimeout(()=>{
                setInLoading(false)
            },500);
            return false
        }
        let dataProps = {
            'userName': userName,
            'password': password,
        };

        axios({
            method: 'post',
            url: servicePath.checkLogin,
            data: dataProps,
            withCredentials: true
        }).then(
            res => {
                setInLoading(false);
                if(res.data.data === '登录成功'){
                    localStorage.setItem('openId',res.data.openId);
                    props.history.push('/index');
                } else {
                    message.error('用户名密码错误');
                    return false
                }
            }
        )
    };

    return (
        <div className='login-div'>
            <Spin tip={'Loading...'} spinning={isLoading}>
            <Card title={'QYL blog System'} bordered={true} style={{width:400}}>
                <Input
                    id={'userName'}
                    size={'large'}
                    placeholder={'Enter your userName'}
                    prefix={<UserOutlined type={'user'} style={{color:'rgba(0,0,0,.25)'}}/>}
                    onChange={e => {setUserName(e.target.value)}}
                />
                <br/><br/>
                <Input.Password
                    id={'password'}
                    size={'large'}
                    placeholder={'Enter your password'}
                    prefix={<KeyOutlined type={'key'} style={{color:'rgba(0,0,0,.25)'}}/>}
                    onChange={e => {setPassword(e.target.value)}}
                />
                <br/><br/>
                <Button type={'primary'} size={'large'} block onClick={checkLogin} >Login</Button>
            </Card>
            </Spin>
        </div>
    )
}



export default Login;