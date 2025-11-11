import React from 'react';
import { Button, Typography, Box, Paper } from '@mui/material';

export interface AvailableComponent {
  id: string;
  name: string;
  type: string; // e.g., 'mui-button', 'mui-typography', 'layout-section'
  category: string; // e.g., 'MUI - Inputs', 'MUI - Display', 'Layout'
  render: (props: any) => React.ReactNode;
  initialProps: Record<string, any>;
  layout?: 'section' | 'row' | 'column' | 'content'; // Distinguish layout components
}

export const muiComponents: AvailableComponent[] = [
  // Layout Components
  {
    id: 'layout-section-1',
    name: 'Section',
    type: 'layout-section',
    category: 'Layout',
    render: (props) => <Box {...props} sx={{ minHeight: '100px', border: '1px dashed blue', margin: '10px', padding: '10px', display: 'flex', flexDirection: 'column', gap: '10px', ...props.sx }}>{props.children}</Box>,
    initialProps: { children: [] },
    layout: 'section',
  },
  {
    id: 'layout-row-1',
    name: 'Row',
    type: 'layout-row',
    category: 'Layout',
    render: (props) => <Box {...props} sx={{ minHeight: '50px', border: '1px dashed green', display: 'flex', flexDirection: 'row', gap: '10px', ...props.sx }}>{props.children}</Box>,
    initialProps: { children: [] },
    layout: 'row',
  },
  {
    id: 'layout-column-1',
    name: 'Column',
    type: 'layout-column',
    category: 'Layout',
    render: (props) => <Box {...props} sx={{ minWidth: '100px', border: '1px dashed red', flex: 1, display: 'flex', flexDirection: 'column', gap: '10px', ...props.sx }}>{props.children}</Box>,
    initialProps: { children: [] },
    layout: 'column',
  },
  // MUI Components
  {
    id: 'mui-button-1',
    name: 'Button',
    type: 'mui-button',
    category: 'MUI - Inputs',
    render: (props) => <Button {...props}>{props.children || 'Button'}</Button>,
    initialProps: { variant: 'contained', children: 'Click Me' },
    layout: 'content',
  },
  {
    id: 'mui-typography-1',
    name: 'Text',
    type: 'mui-typography',
    category: 'MUI - Display',
    render: (props) => <Typography {...props}>{props.children || 'Text'}</Typography>,
    initialProps: { variant: 'body1', children: 'Some text' },
    layout: 'content',
  },
  {
    id: 'mui-box-1',
    name: 'Box',
    type: 'mui-box',
    category: 'MUI - Layout',
    render: (props) => <Box {...props}>{props.children}</Box>,
    initialProps: { sx: { padding: 2, border: '1px dashed grey' } },
    layout: 'content',
  },
  {
    id: 'mui-paper-1',
    name: 'Paper',
    type: 'mui-paper',
    category: 'MUI - Layout',
    render: (props) => <Paper {...props}>{props.children}</Paper>,
    initialProps: { elevation: 1, sx: { padding: 2 } },
    layout: 'content',
  },
];

// You can add other libraries here later, e.g.,
// export const otherLibraryComponents: AvailableComponent[] = [ ... ];
