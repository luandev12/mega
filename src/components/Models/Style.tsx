import styled from 'styled-components';

const Style = styled.div`
  padding: 20px;
  font-family: 'asd';

  overflow: scroll;
  height: 100vh;

  .model-wrap {
    margin-bottom: 100px;
  }

  p {
    text-align: start;
    font-size: 18px;
  }

  .header__models {
    display: flex;
    justify-content: space-around;
  }

  .item-image {
    border: 1px solid red;
    padding: 5px 20px;
    border-radius: 15px;
    background: #ffffff;
    color: #333;
    cursor: pointer;
  }
`;

export default Style;
