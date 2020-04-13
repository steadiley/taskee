# taskee

タスク管理 + タイムロガーを一つのアプリで

- 日毎に管理できる
- タスクごとの使用時間を測る
- 記録を保存して、可視化

# インストール

```
yarn install
```

# 開発時の使い方

- 開発用サーバーを走らせる

```
yarn serve
```

- プロダクション用コードをビルド

```
yarn build
```

- ユニットテストを実行

```
yarn test:unit
```

- E2E テストを実行

```
yarn test:e2e
```

- 静的解析やフォーマッターを掛ける

```
yarn lint
```

# 使用技術

- Vue2 + composition-api(with Typescript)
- firebase (firestore)  
  API サーバは別途用意しない
- SCSS  
  ライブラリは使わずにやってみる

# 開発上のルール

- 静的解析やフォーマッターを掛ける
- PR ベースで行う
- PR にはコードに対して基本的にユニットテストも付随させる
