// @ts-ignore
// import SeoPane from 'sanity-plugin-seo-pane'
import S from '@sanity/desk-tool/structure-builder'

const hiddenDocTypes = ["config"]

export default () =>
  S.list()
    .title('Content')
    .items([
      // S.listItem()
      //   .title('Config')
      //   .child(
      //     S.document()
      //       .id('config')
      //       .documentId('globalConfig')
      //       // .views([
      //       //   S.view.form(),
      //       //   // S.view.component(ConfigPreview)
      //       // ])
      //   ),
      ...S.documentTypeListItems().filter((listItem) => !hiddenDocTypes.includes(listItem.getId() ?? '')),
    ])