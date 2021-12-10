import React, { useState } from "react";
import { Modal, Tabs } from 'antd'

import Login from './Login'
import Register from './Register'

const { TabPane } = Tabs

const Index = ({ visible, onCancel }) => {

  return (
    <div>
      <Modal
        title="Basic Modal"
        visible={visible}
        onCancel={onCancel}
        footer={false}
      >
        <Tabs defaultActiveKey="1">
          <TabPane tab="Login" key="1">
            <Login />
          </TabPane>
          <TabPane tab="Register" key="2">
            <Register />
          </TabPane>
        </Tabs>
      </Modal>
    </div>
  )
}

export default Index