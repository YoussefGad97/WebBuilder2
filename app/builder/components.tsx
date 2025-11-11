import React from 'react';
import { Button, Typography, Box, Paper, TextField, Card, CardContent, CardActions } from '@mui/material';
import { componentRegistry } from './componentRegistry';

export interface ComponentProps {
  children?: React.ReactNode;
  [key: string]: unknown;
}

export interface AvailableComponent {
  id: string;
  name: string;
  type: string; // e.g., 'mui-button', 'mui-typography', 'layout-section'
  category: string; // e.g., 'Layout', 'Basic', 'MUI Components'
  render: (props: ComponentProps) => React.ReactNode;
  initialProps: Record<string, unknown>;
  layout: 'section' | 'row' | 'column' | 'content'; // Distinguish layout components
  description: string; // Description for better UX
}

export const muiComponents: AvailableComponent[] = [
  // Layout Components - These should not have their own styling as it's handled by CanvasComponent
  {
    id: 'layout-section',
    name: 'Section',
    type: 'layout-section',
    category: 'MUI/Layout',
    render: (props) => <div {...(props as any)}>{props.children}</div>, // eslint-disable-line @typescript-eslint/no-explicit-any
    initialProps: {},
    layout: 'section',
    description: 'A container for organizing page sections',
  },
  {
    id: 'layout-row',
    name: 'Row',
    type: 'layout-row',
    category: 'MUI/Layout',
    render: (props) => <div {...(props as any)}>{props.children}</div>, // eslint-disable-line @typescript-eslint/no-explicit-any
    initialProps: {},
    layout: 'row',
    description: 'A horizontal container for columns',
  },
  {
    id: 'layout-column',
    name: 'Column',
    type: 'layout-column',
    category: 'MUI/Layout',
    render: (props) => <div {...(props as any)}>{props.children}</div>, // eslint-disable-line @typescript-eslint/no-explicit-any
    initialProps: {},
    layout: 'column',
    description: 'A vertical container within a row',
  },
  // MUI Components
  {
    id: 'mui-button',
    name: 'Button',
    type: 'mui-button',
    category: 'MUI/Inputs',
    render: (props) => <Button {...(props as any)}>{props.children || 'Button'}</Button>, // eslint-disable-line @typescript-eslint/no-explicit-any
    initialProps: { variant: 'contained', children: 'Click Me' },
    layout: 'content',
    description: 'A clickable button component',
  },
  {
    id: 'mui-typography',
    name: 'Text',
    type: 'mui-typography',
    category: 'MUI/Display',
    render: (props) => <Typography {...(props as any)}>{props.children || 'Text'}</Typography>, // eslint-disable-line @typescript-eslint/no-explicit-any
    initialProps: { variant: 'body1', children: 'Some text' },
    layout: 'content',
    description: 'Text display component with various styles',
  },
  {
    id: 'mui-text-field',
    name: 'Text Field',
    type: 'mui-text-field',
    category: 'MUI/Inputs',
    render: (props) => <TextField {...(props as any)} />, // eslint-disable-line @typescript-eslint/no-explicit-any
    initialProps: { label: 'Text Field', variant: 'outlined' },
    layout: 'content',
    description: 'Input field for text entry',
  },
  {
    id: 'mui-card',
    name: 'Card',
    type: 'mui-card',
    category: 'MUI/Layout',
    render: (props) => (
      <Card {...(props as any)}> {/* eslint-disable-line @typescript-eslint/no-explicit-any */}
        <CardContent>
          <Typography variant="h5">Card Title</Typography>
          <Typography variant="body2">Card content goes here.</Typography>
        </CardContent>
        <CardActions>
          <Button size="small">Action</Button>
        </CardActions>
      </Card>
    ),
    initialProps: {},
    layout: 'content',
    description: 'A card component for displaying content',
  },
];

// Register components in the registry
componentRegistry.registerComponents(muiComponents);

// You can add other libraries here later, e.g.,
// export const otherLibraryComponents: AvailableComponent[] = [ ... ];
