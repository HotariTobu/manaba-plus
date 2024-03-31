import { defineConfig } from "vitepress";
import { defineThemeConfig } from "./themeConfig";

export const ja = defineConfig({
  lang: 'ja',
  description: 'Manaba PlusのPRサイト',

  themeConfig: defineThemeConfig({
    nav: [
      { text: 'ガイド', link: '/ja/guide/' },
      { text: '機能一覧', link: '/ja/feature/' },
      { text: '開発者向け', link: '/ja/development/' },
      { text: 'ご意見 / ご要望', link: 'https://docs.google.com/forms/d/e/1FAIpQLSck4FPegpn6G3xgVcFrTTanJ1V4HggBnyrqtF8ombUX28yt9A/viewform?usp=sf_link' },
    ],

    sidebar: [
      {
        text: '⭐️ガイド⭐️',
        items: [
          { text: '使ってみる', link: '/ja/guide/' },
          { text: '対応している学校のリスト', link: '/ja/guide/host-list' },
          { text: '好きなバージョンを追加する', link: '/ja/guide/manual-load/' },
          // { text: 'ダウンロードの確認ダイアログ', link: '/ja/guide/download-dialog/' },
          // { text: 'Googleカレンダーの通知設定', link: '/ja/guide/google-calendar/' },
        ]
      },
      {
        text: '⭐️機能一覧⭐️',
        items: [
          { text: '各機能について', link: '/ja/feature/' },
          { text: 'そしてログインページへ', link: '/ja/feature/modifiers/bad-status/' },
          { text: '外部へ直リンク', link: '/ja/feature/modifiers/common/external-anchors/' },
          // { text: 'メモを非表示に', link: '/ja/feature/modifiers/common/notes/' },
          { text: 'レスポンシブデザイン', link: '/ja/feature/modifiers/common/responsive/' },
          { text: 'レポートへのリンク', link: '/ja/feature/modifiers/grade/' },
          { text: '課題一覧', link: '/ja/feature/modifiers/home/assignments/' },
          { text: 'コースを非表示に', link: '/ja/feature/modifiers/home/courses/hide/' },
          { text: '⭐️', link: '/ja/feature/modifiers/home/courses/star/' },
          { text: 'アイコンから飛ぶ', link: '/ja/feature/modifiers/home/courses/status/' },
          { text: '時間割表', link: '/ja/feature/modifiers/home/courses/timetable/' },
          { text: 'トップページのレイアウト', link: '/ja/feature/modifiers/home/' },
          // { text: '公開期間の強調', link: '/ja/feature/modifiers/page/open-period/' },
          { text: 'レポートのバックアップ', link: '/ja/feature/modifiers/report/backup/' },
          { text: 'DnDで提出', link: '/ja/feature/modifiers/report/dnd/' },
          { text: 'シラバスから自己登録', link: '/ja/feature/modifiers/syllabus/self-registration/' },
          // { text: 'ダウンロードのお誘い', link: '/ja/feature/pages/contents/notification/' },
          // { text: 'コンテンツのダウンロード', link: '/ja/feature/pages/contents/' },
          { text: 'ポップアップページ', link: '/ja/feature/pages/popup/' },
        ]
      },
      {
        text: '⭐️開発者向け⭐️',
        items: [
          { text: 'はじめに', link: '/ja/development/' },
        ]
      }
    ],

    editLink: {
      pattern: 'https://github.com/HotariTobu/manaba-plus/edit/main/docs/:path',
      text: 'GitHubでこのページを編集する'
    },

    lastUpdated: {
      text: '最終更新',
      formatOptions: {
        dateStyle: 'long',
        timeStyle: 'medium'
      }
    }
  })
})
