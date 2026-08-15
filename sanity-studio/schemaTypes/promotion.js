import {defineField, defineType} from 'sanity'

export const promotion = defineType({
  name: 'promotion',
  title: 'Promoção',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Título',
      type: 'string',
      validation: (Rule) => Rule.required().max(80),
    }),
    defineField({
      name: 'description',
      title: 'Descrição',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required().max(500),
    }),
    defineField({
      name: 'price',
      title: 'Preço promocional (opcional)',
      type: 'string',
      description: 'Deixe em branco quando a promoção não precisar exibir um preço.',
    }),
    defineField({
      name: 'startDate',
      title: 'Data inicial',
      type: 'date',
      options: {dateFormat: 'DD/MM/YYYY'},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'endDate',
      title: 'Data final',
      type: 'date',
      options: {dateFormat: 'DD/MM/YYYY'},
      validation: (Rule) =>
        Rule.required().custom((endDate, context) => {
          const startDate = context.document?.startDate
          if (!endDate || !startDate) return true
          return endDate >= startDate || 'A data final deve ser igual ou posterior à data inicial.'
        }),
    }),
    defineField({
      name: 'active',
      title: 'Ativa',
      type: 'boolean',
      initialValue: true,
      description: 'Desative para esconder a promoção imediatamente, mesmo dentro do período de datas.',
    }),
  ],
  orderings: [
    {
      title: 'Data inicial — mais recente',
      name: 'startDateDesc',
      by: [{field: 'startDate', direction: 'desc'}],
    },
  ],
  preview: {
    select: {
      title: 'title',
      active: 'active',
      startDate: 'startDate',
      endDate: 'endDate',
    },
    prepare({title, active, startDate, endDate}) {
      const status = active ? 'Ativa' : 'Inativa'
      const period = startDate && endDate ? `${startDate} → ${endDate}` : 'Período não definido'
      return {title, subtitle: `${status} · ${period}`}
    },
  },
})
