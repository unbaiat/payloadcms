import type { CollectionConfig } from 'payload'

export const Domains: CollectionConfig = {
  slug: 'domains',
  admin: {
    defaultColumns: ['name', 'status', 'updatedAt'],
    useAsTitle: 'name',
  },
  access: {
    create: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Domain',
      required: true,
      unique: true,
      admin: {
        placeholder: 'example.com',
      },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'pending',
      options: [
        {
          label: 'Pending Verification',
          value: 'pending',
        },
        {
          label: 'Verified',
          value: 'verified',
        },
      ],
      required: true,
    },
  ],
}
