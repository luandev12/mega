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
    display: flex;
    width: 100px;
  }

  .your-hand {
    svg {
      width: 28px;
      height: 28px;
    }
    padding: 0 5px;

    &:hover {
      background-color: #2e2e2e;
      border-radius: 5px;
      height: 48px;
      cursor: pointer;
    }
  }
  .your-hand.disactive {
    opacity: .5;
  }

  .mouse-hand {
    padding: 0 5px;

    &:hover {
      background-color: #2e2e2e;
      border-radius: 5px;
      cursor: pointer;
    }
  }
`;

export default Style;
