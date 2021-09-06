import styled from 'styled-components';

const Style = styled.div`
  background-color: red;
  width: 40px;
  height: 330px;
  position: fixed;
  z-index: 9999;
  right: ${props => `${props.theme.right}px`};
  top: ${props => `${props.theme.top}px`};
  display: ${props => props.theme.display}
`;

export default Style;
