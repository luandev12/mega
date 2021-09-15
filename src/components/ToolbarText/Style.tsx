import styled from "styled-components";

const Style = styled.div`
  background-color: #2e2e2e;
  border: 1px solid #454545;
  box-shadow: 0 2px 7px rgb(0 0 0 / 15%), 0 5px 17px rgb(0 0 0 / 20%);
  border-radius: 8px;
  position: fixed;
  right: ${props => `${props.theme.right}px`};
  top: ${props => `${props.theme.top + 30}px`};
  display: ${props => props.theme.display};
  width: 380px;
  height: 144px;
  padding: 10px;

  .text__top {
    display: flex;
  }

  .text__bottom {
    display: flex;

    .text__align {
      display: flex;
      align-items: center;
      background-color: #454545;
      border: 1px solid #595959;
      border-radius: 6px;
      div {
        color: #fff;
        padding: 3px 10px;
        cursor: pointer;
      }
      div.active {
        background-color: #fff;
        color: #000;
      }
    }
  }
`

export default Style