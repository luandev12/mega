import styled from 'styled-components';

const Style = styled.div`
  background-color: #454545;
  width: 40px;
  position: fixed;
  z-index: 9999;
  right: ${props => `${props.theme.right}px`};
  top: ${props => `${props.theme.top + 30}px`};
  display: ${props => props.theme.display};
  border-radius: 20px;
  height: auto;
  padding: 15px 0;

  .wrap__icon {
    cursor: pointer;
  }
`;

export default Style;
