import type { Schema, Struct } from '@strapi/strapi';

export interface SharedRichText extends Struct.ComponentSchema {
  collectionName: 'components_shared_rich_texts';
  info: {
    description: '';
    displayName: 'Rich text';
    icon: 'align-justify';
  };
  attributes: {
    body: Schema.Attribute.RichText;
  };
}

export interface SharedVisualization extends Struct.ComponentSchema {
  collectionName: 'components_shared_visualizations';
  info: {
    description: 'Embed a pre-built data visualization by id. The id must match a folder name under frontend/src/assets/visualizations/.';
    displayName: 'Visualization';
    icon: 'chart-pie';
  };
  attributes: {
    align: Schema.Attribute.Enumeration<['inline', 'wide', 'full-bleed']> &
      Schema.Attribute.DefaultTo<'inline'>;
    caption: Schema.Attribute.Text;
    height: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          max: 1200;
          min: 160;
        },
        number
      > &
      Schema.Attribute.DefaultTo<520>;
    vizId: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'shared.rich-text': SharedRichText;
      'shared.visualization': SharedVisualization;
    }
  }
}
