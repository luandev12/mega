import styled from 'styled-components';

const Style = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  font-family: 'Azeret Mono';
  .items__container {
    width: 450px;
    height: 100vh;
    position: relative;
  }

  .canvas__container {
    width: ${props => (!props.theme.width ? 'calc(100vw - 450px)' : `${props.theme.width}px`)};
    height: 100vh;
    position: relative;
  }

  .canvas-container {
    width: ${props =>
      !props.theme.width ? 'calc(100vw - 450px)' : `${props.theme.width}px`}!important;
    height: 100vh !important;
    position: relative;
  }

  .canvas__fill {
    position: absolute;
    top: 70px;
    right: 50px;
    cursor: pointer;
  }
`;

export default Style;
