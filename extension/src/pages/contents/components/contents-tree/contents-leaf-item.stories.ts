import type { Meta, StoryObj } from '@storybook/react';
import { ContentsLeafItem } from './contents-leaf-item';

const meta = {
  component: ContentsLeafItem,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof ContentsLeafItem>
export default meta

type Story = StoryObj<typeof meta>

export const Excluded: Story = {
  args: {
    label: 'The excluded content',
    contentsLeaf: {
      url: '',
      status: {
        code: 'excluded'
      },
    },
  },
}

export const Pending: Story = {
  args: {
    label: 'The pending content',
    contentsLeaf: {
      url: '',
      status: {
        code: 'pending'
      },
    },
  },
}

export const Downloading: Story = {
  args: {
    label: 'The downloading content',
    contentsLeaf: {
      url: '',
      status: {
        code: 'downloading'
      },
    },
  },
}

export const Interrupted: Story = {
  args: {
    label: 'The interrupted content',
    contentsLeaf: {
      url: '',
      status: {
        code: 'interrupted',
        message: 'Reason why interrupted'
      },
    },
  },
}

export const Completed: Story = {
  args: {
    label: 'The completed content',
    contentsLeaf: {
      url: '',
      status: {
        code: 'completed'
      },
    },
  },
}
