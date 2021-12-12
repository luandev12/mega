import styled from 'styled-components';

const Style = styled.div`
  .doc-item {
    border: 1px solid #f5f5f5;
    background-color: #f5f5f5;
    border-radius: 6px;
    margin: 10px;
  }

  .canvas__wrap {
    width: 150px;
    height: 150px;
    cursor: pointer;
    position: relative;
    /* .canvas-container {
      width: 100% !important;
      height: 100% !important;
    } */
  }

  .canvas__wrap::before {
    position: absolute;
    top: 0;
    left: 0;
    content: '';
    background: transparent;
    cursor: pointer;
    width: 100%;
    height: 100%;
    z-index: 100;
  }

  .canvas__realtime {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
  }
`;

export default Style;
