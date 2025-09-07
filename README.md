# Puzzle Site Project

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

---

## 概要 (Overview)

このプロジェクトは、複数のページと隠し要素で構成されるインタラクティブなパズルサイトです。

## ページフロー (Page Flow)

ユーザーは以下の順序でページを遷移します。各ステップには特定の条件が設定されています。

1.  **`/` (トップページ)**
    *   パスワード入力画面が表示されます。
    *   パスワード: `V3pXa3Vh`
    *   正解すると `/puzzle/1` に遷移します。

2.  **`/puzzle/1` (パズルページ1)**
    *   メインの対話型パズルページです。
    *   特定の対話（`restart`ノードに到達するルート）を3つ完了すると、「助けて」というリンクが表示されます。
    *   「助けて」リンクをクリックすると `/help` に遷移します。

3.  **`/help` (ヘルプページ)**
    *   別のパスワード入力が求められます。
    *   パスワード: `WzWkua`
    *   正解すると `/puzzle/facade` に遷移します。

4.  **`/puzzle/facade` (偽装ページ)**
    *   一見すると404ページのような見た目をしています。
    *   **隠し要素:** ページの背景（テキスト以外の部分）を10回クリックすると、モーダルが表示され、`/puzzle/self-destruct` へ自動的に遷移します。

5.  **`/puzzle/self-destruct` (自己破壊シーケンス)**
    *   BGMと共に、ターミナル風のアニメーションが進行します。
    *   アニメーションが完了すると、自動的に `/puzzle/end` に遷移します。

6.  **`/puzzle/end` (エンドページ)**
    *   一枚の画像が表示されます。
    *   **隠し要素:** 画像の中の特定領域（中心座標 (105, 100) を中心とする半径20pxの円内）をクリックすると、`/puzzle/goal` に遷移します。クリック判定は画像の元解像度に基づいています。

7.  **`/puzzle/goal` (最終ページ)**
    *   最終到達ページです。「GOAL」と表示されます。

## 主要な技術要素 (Key Technical Features)

*   **BGM管理 (`src/app/bgmService.ts`)**: `playPersistent` メソッドにより、ページ遷移後もBGMの再生を継続します。`/puzzle/self-destruct` ではループしない設定が適用されています。
*   **状態管理**: 各ページの状態は主にReactの `useState`, `useEffect`, `useContext` を利用して管理されています。
*   **カスタムフック**: 対話ロジック (`useDialogueManager`) やアニメーション (`usePurgeAnimation`) など、複雑なロジックはカスタムフックに分離されています。

## 開発 (Development)

### 起動方法

開発サーバーを起動するには、以下のコマンドを実行してください。

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

---

(The following is the original content from create-next-app)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.