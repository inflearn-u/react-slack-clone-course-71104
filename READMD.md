# Front 초기 세팅

## 1. BackEnd Server 구동하기

1. 패키지 install

```
cd back
npm i // module들 설치
```

2. .env 파일 작성

```
COOKIE_SECRET=sleactcookie
MYSQL_PASSWORD=root
```

3. MySQL에 sleact DB 생성

```
npx sequelize db:create
```

4. Table 생성

```
# npm run dev > DB 연결 성공 확인후

npx sequelize db:seed:all
```

- seeders > ~-sleact.js 실행 (더미데이터 만드는 과정 )

  - workspace 만듦
  - channel 만듦

  workspace(회사) => channel(부서)

## 2. Front End 세팅하기

1. npm init

```
mkdir alecture // 프론트 폴더
cd alecture
npm init
```

2. react 설치

```
npm i react react-dom
```

3. (option) ts 설치

```
npm i typescript
npm i @types/react @types/react-dom
```

[+참고]

- package-lock.json : 노드의 버전들 문제
  - 패키지들간의 dependency -> 의존관계 커짐
  - A,B가 C 패키지의 2버전, 3버전 의존하고 있을때... package-lock.json 의존하고 있는 패키지의 버전까지 적혀있음

4. 개발전 세팅

```
npm i -D eslint // 코드검사도구, 오타, 안쓰는변수
npm i -D prettier eslint-plugin-prettier eslint-config-prettier // 코드 자동 정렬 도구, eslint와 연결
// prettier와 어긋나는 코드 알려줌
```

- alecture 하위 .eslintrc 랑 .prettierrc 파일 만들어줌

```
// .eslintrc
{
    "extends": ["plugin:prettier/recommended"]
}
prettier가 추천한 대로 따르겠다
```

(prettier > vsCode에서 안되는 문제 : https://yjg-lab.tistory.com/91)

- ts를 js로 바꿀때 크게 2가지
  1. ts가 바꿔주는대로 그대로
  2. ts가 바꿔주고, 그걸 바벨이 이어받아서 바꿔주는거.
     -> 우린 2번째로
     -> why? fe 개발 css, img 등.. 이 있으므로.. 바벨은 모든걸 js로 변환해준다.

### Babel과 Webpack 설정

- ts 파일에서 : (콜론)
  -> js의 변수 , 함수의 매개변수, 함수의 리턴값에 어떤 type인지 적어줌.

- webpack.config.ts

  - resolve > extensions -> 바벨이 처리할 확장자 목록
  - paths > .prettierrc에서도 웹팩에서도 해줘야
  - entry : client.txs (메인파일, react에서 jsx쓰면 ts에서는 txs 씀)
  - module : ts나 tsx 파일을 babel-loader가 js 로 바꿔줌
  - env presets : 타켓에 적은 브라우저가 사용가능한 버전으로
  - babel/preset-react (react 코드 바꿔줌) , babel/prest-typescript (ts 코드 바꿔줌)

  - css : style-loader, css-loader : css파일을 js 파일로 바꿔줌

  - ForkTsCheckerWebpackPlugin

    - EnvironmentPlugin : NODE_ENV 쓸수있게 만들어줌. 원래는 백엔드에서만 쓸수 있었음

  - output : 결과물 위치

  - 개발환경일때 쓸 플러그인, 개발환경이 아닐때 쓸 플러그인

- webpack 설치

```
npm i -D webpack @babel/core babel-loader @babel/preset-env @babel/preset-react
```

- ts 쓴다면

```
npm i -D @types/webpack @types/node @babel/preset-typescript
```

    fe개발의 최종 결과물은 항상 css, html, js 여야 한다. (ts는 항상 js로 변환해 줘야 한다. )

- css 처리해주려면

```
npm i style-loader css-loader
```

- index.html 파일 생성

  - 중요성 : 사용자나 검색엔진이 제일 먼저 만나는 페이지.
    - spa할때 가장 문제 : 성능 -> js파일 용량이 크니까..
    - 결국은 index.html - 핵심 css를 몰아넣고 사용자 경험에 덜 중요한 css는 js로 처리하고

  ```
  <div id="app">
  <script src="/dist/app.js"/>
  ```

  - react 소스코드가 여기에 불러와지는데, id가 app인 태그들에 js로 만든태그들이 들어감 - /dist/app.js 는 webpack 실행하면 생김

- 웹팩 처음 실행시키기

```
npm i webpack
npx webpack
```

-> 에러남. Unable to use specified module loaders for ".ts".

config.ts를 webpack이 인식을 못해서..

- tsconfig-for-webpack-config.json 파일 생성하고 넣어줌
  (webpack 공식문서에 가서 typscript랑 연동하는 방법 나옴)
- 파일 만든 담에 TS_NODE_PRODUCT=\"tsconfig-for-webpack-config.json\" webpack

```
 "scripts": {
    "build": "cross-env NODE_ENV=production TS_NODE_PROJECT=\"tsconfig-for-webpack-config.json\" webpack",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
```

- cross-env는 윈도우에서도 돌아가게 하는거

```
npm i cross-env
```

- npm run build
  -> 또 오류

```
[webpack-cli] Unable to use specified module loaders for ".ts".

npm i ts-node

npm run build
```

### 웹팩 데브 서버 세팅하기

- 수정시 다시 빌드해야함
  -> 수정하면 알아서 업데이트 하고 새로고침 해주는 hot reloading 세팅

```
npm i webpack-dev-server -D // - 나중에 프록시 서버 역할도 해줌  (cors 에러)
npm i webpack-cli
npm i -D @types/webpack-dev-server
npm i @pmmmwh/react-refresh-webpack-plugin
npm i react-refresh
npm i fork-ts-checker-webpack-plugin -D // ts 검사를 할때 blocking 식으로 검사를 하는데 (다음 동작 막음)
// fork 하면 ts체킹이랑 webpack 실행이랑 동시에 돌아가게 -> 성능 좋아짐
```

- webpack.config.ts

* devServer 주석 제거
* 과련 주석 제거
* index.html 바로 실행할땐 . 붙여줘야 하고 webpack config dev server 통해서 할땐 . 빼줘야 함

```
<script src="/dist/app.js"></script>
```

### 폴더구조와 리액트 라우터

- 폴더구조 (영상참고)

- 리액트 라우터

```
npm i react-router react-router-dom
npm i -D @types/react-router @types/react-router-dom
```

    - Switch는 여러개 Router 중에 하나만 표시해주는 장치이다.
    - Route 는 컴포넌트를 화면에 띄워주는 역할.
    - Redirect는 다른페이지로 돌려주는 역할. 주소가 / 이면 /login으로

#### webpack.config.ts

```
devServer: {
    historyApiFallback: true, // react router
```

역할
-> 주소 바꾸고 새로고침하면 원래 react는 못알아 먹음
but historyApiFallback : true 하면 뜸.
주소를 사기쳐줌

spa는 사실 페이지가 index.html 하나임.
historyApi가 가짜주소를 입력해주는 건데
새로고침을 할때 주소는 프론트로 안가고 서버로 간다.
서버는 오로지 한 주소만 알고 있다.
login을 치던 signup을 치던 localhost:3090으로만 보낸다.
그걸 historyApiFallback true로 하면
실제로 서버에 없는 주소를 진짜 있는거마냥 해줘서 간다..

### 코드 스플리팅과 이모션

- 코드 스플리팅
  웹사이트가 커지면서 수백개 페이지가 되는데
  하나의 js로 만들면 로딩되는데 오래걸림
  -> 그때그때 필요한 컴포넌트만 불러오는거
- 어떤 컴포넌트를 분리할 것인가?
  1. 페이지를 분리한다.
  2. server side rendering이 필요없는애들

```
npm i @loadable/component
npm i --save-dev @types/loadable__component
```

```
import loadable from '@loadable/component';
import { Switch, Route, Redirect } from 'react-router-dom';
// import LogIn from '@pages/LogIn';
// import SignUp from '@pages/SignUp';

const LogIn = loadable(() => import('@pages/LogIn'));
const SignUp = loadable(() => import('@pages/SignUp'));
```

알아서 코드스필리트 한다

- css 적용방법

1. inline style
2. css 파일 import하여 class name 연결
3. styled 컴포넌트나 이모션 (css in js) --> 요거씀
   ㄴ css도 자바스크립트로
   ㄴ 이모션이 설정이 간단함

```
npm i @emotion/react @emotion/styled
```

```
export const Label = styled.label`
  margin-bottom: 16px;
  & > span {

```

- label & > label 안에 span (& 사스)
- 최대한 styled component는 조금만 만들도록

### Q&A

```
npm i @emotion/babel-plugin
```

- 아래같은 문법도 가능 Form 안의 Label component에 css 주기

```
export const Form = styled.form`
  margin: 0 auto;
  width: 400px;
  max-width: 400px;
  & > ${Label} {
    ...
`;

```
