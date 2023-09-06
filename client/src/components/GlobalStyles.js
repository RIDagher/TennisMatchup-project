import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
    *,
    *:before,
    *:after {
      margin: 0;
      padding: 0;
      border: 0;
        box-sizing: border-box;
        
    }
    #root {
  display: flex;
  flex-direction: column;
  min-height: 100%;
}

.main-content {

}


    ol, ul {
        list-style: none;
        text-decoration: none;
    }
    body, ul, li {
        margin: 0;
        padding: 0;
    }

`;
