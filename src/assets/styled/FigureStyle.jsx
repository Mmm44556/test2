import styled from 'styled-components';
const Figure = styled.div`
  display:inline-block;
  margin-right:3px;
  width: 26px;
  height: 26px;
  background: ${({ bg }) => bg ?? '#264dd9'};
  color: #000;
  font-weight: bold;
  border-radius: 50%;
  line-height: 26px;
  text-align: center;
  font-size: 14px;
  font-variant: small-caps;
  text-transform: capitalize;
`

export default Figure;