export const structure = (S) =>
  S.list()
    .title('Kelly Massagens')
    .items([
      S.listItem()
        .title('Informações do site')
        .id('siteSettings')
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
            .title('Informações do site')
        ),
      S.divider(),
      S.documentTypeListItem('promotion').title('Promoções'),
    ])
