import React, { Component } from 'react';
import { Layout, Menu, Breadcrumb } from 'antd';
// import mainStyle from './index.module.sass';
import Page from '../page';
import { UserOutlined, LaptopOutlined, NotificationOutlined } from '@ant-design/icons';

const { Header, Sider, Content, Footer } = Layout;
const { SubMenu } = Menu;

class Main extends Component {

    render() {
        return (
            <Layout style={{ height: '100%' }}>
                <Header >
                    <div className="logo" style={{ height: '64px', width: '64px', float: 'left', color: 'ButtonShadow' }}>
                        物之大同
                        {/* <img
                            src={process.env.PUBLIC_URL + '/yun2.png'}
                            style={{ height: '60px', width: '60px', marginBottom: '3px' }}
                        /> */}
                    </div>
                    <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
                        <Menu.Item key="1">nav 1</Menu.Item>
                        <Menu.Item key="2">nav 2</Menu.Item>
                        <Menu.Item key="3">nav 3</Menu.Item>
                    </Menu>
                </Header>
                <Layout>
                    {/* <Content style={{ background: '#adacb9' }}>Content</Content> */}
                    <Layout style={{ padding: '0 24px 24px' }}>
                        <Breadcrumb style={{ margin: '16px 0' }}>
                            <Breadcrumb.Item>Home</Breadcrumb.Item>
                            <Breadcrumb.Item>List</Breadcrumb.Item>
                            <Breadcrumb.Item>App</Breadcrumb.Item>
                        </Breadcrumb>
                        <Content
                            className="site-layout-background"
                            style={{
                                padding: 24,
                                margin: 0,
                                minHeight: 280,
                                background: '#fff'
                            }}
                        >
                            个人学习博客网站，待更新，敬请期待。。。。
                            <Page />
                        </Content>
                        <Footer style={{ textAlign: 'center' }}>
                            ICP证：<a href="https://beian.miit.gov.cn/" target="_blank">浙ICP备17017202号-3</a>
                        </Footer>
                    </Layout>
                    {/* <Sider width={200} style={{ background: '#f1f' }}>Sider</Sider> */}
                    <Sider width={200} className="site-layout-background" style={{ background: '#fff' }}>
                        <Menu
                            mode="inline"
                            defaultSelectedKeys={['1']}
                            defaultOpenKeys={['sub1']}
                            style={{ height: '100%', borderRight: 0 }}
                        >
                            <SubMenu key="sub1" icon={<UserOutlined />} title="subnav 1">
                                <Menu.Item key="1">option1</Menu.Item>
                                <Menu.Item key="2">option2</Menu.Item>
                                <Menu.Item key="3">option3</Menu.Item>
                                <Menu.Item key="4">option4</Menu.Item>
                            </SubMenu>
                            <SubMenu key="sub2" icon={<LaptopOutlined />} title="subnav 2">
                                <Menu.Item key="5">option5</Menu.Item>
                                <Menu.Item key="6">option6</Menu.Item>
                                <Menu.Item key="7">option7</Menu.Item>
                                <Menu.Item key="8">option8</Menu.Item>
                            </SubMenu>
                            <SubMenu key="sub3" icon={<NotificationOutlined />} title="subnav 3">
                                <Menu.Item key="9">option9</Menu.Item>
                                <Menu.Item key="10">option10</Menu.Item>
                                <Menu.Item key="11">option11</Menu.Item>
                                <Menu.Item key="12">option12</Menu.Item>
                            </SubMenu>
                        </Menu>
                    </Sider>
                </Layout>

            </Layout>
        )

    }
}

export default Main;
