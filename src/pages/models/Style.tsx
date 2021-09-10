import styled from 'styled-components';

const Style = styled.div`
  padding: 20px;

  p {
    text-align: start;
    font-size: 18px;
  }

  .header__models {
    display: flex;
    justify-content: space-around;
  }

  .list__models {
    display: flex;
    flex-wrap: wrap;
    img {
      max-width: 86px;
      max-height: 200px;
      width: auto;
      height: auto;
      border-radius: 10px;
      margin-right: 10px;
      margin-bottom: 10px;
      cursor: pointer;
    }
  }
`;

export default Style;
