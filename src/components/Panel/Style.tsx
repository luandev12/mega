import styled from 'styled-components';

const Style = styled.div`
  background-color: #2e2e2e;
  height: 100vh;
  color: #f5f5f5;

  .panel-logo {
    border-bottom: 1px solid hsla(0, 0%, 100%, 0.05);
    height: 80px;
    line-height: 80px;
  }

  .panel-main {
    display: flex;
    justify-content: space-between;
  }

  .panel-tab {
    background-color: #2e2e2e;
    width: 25%;
    height: 100vh;
    padding-top: 30px;

    ul {
      margin: 0;
      padding: 0;
      width: 100%;
    }

    ul li {
      list-style: none;
      overflow: hidden;
      font-size: 14px;
      line-height: 16px;
      text-align: center;
      opacity: 0.5;
      margin-bottom: 20px;
      cursor: pointer;
    }
  }

  .panel-galery {
    width: 75%;
    padding-top: 30px;
    height: calc(100vh - 80px);
  }

  .tab-item {
    padding-top: 10px;
  }

  .tab-item-name {
    margin-top: 10px;
  }

  .tab-item-name-active {
    color: white !important;
  }

  .tab-item-icon-active {
    width: 24px;
    height: 24px;
    margin: 0;
    background-color: #373737;
    padding: 7px 9px 9px 9px;
    border-radius: 5px;
  }
`;

export default Style;
