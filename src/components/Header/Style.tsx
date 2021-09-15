import styled from 'styled-components';

const Style = styled.div`
  color: #fff;
  z-index: 999;
  position: absolute;
  width: 100%;
  height: 48px;
  line-height: 48px;
  border-bottom: 1px solid hsla(0, 0%, 100%, 0.05);

  .header-export {
    margin-right: 30px;
    cursor: pointer;
  }

  .tool-icon {
    padding-left: 15px;
  }

  .mouse-hand {
    padding: 5px;
    &:hover {
      background-color: #2e2e2e;
      border-radius: 5px;
    }
  }
`;

export default Style;
