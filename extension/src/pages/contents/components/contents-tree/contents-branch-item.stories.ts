import type { Meta, StoryObj } from '@storybook/react';
import { ContentsTreeItem } from './contents-branch-item';

const meta = {
  component: ContentsTreeItem,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof ContentsTreeItem>
export default meta

type Story = StoryObj<typeof meta>

export const Standard: Story = {
  args: {
    contentsBranch: {
      url: '',
      children: new Map([
        [
          'branch 1',
          {
            url: '',
            children: new Map([
              [
                'sub branch 1',
                {
                  url: '',
                  children: new Map(),
                },
              ],
              [
                'sub leaf 1',
                {
                  url: '',
                  status: {
                    code: 'excluded'
                  }
                },
              ],
              [
                'sub leaf 2',
                {
                  url: '',
                  status: {
                    code: 'pending'
                  }
                },
              ],
              [
                'sub branch 2',
                {
                  url: '',
                  children: new Map(),
                },
              ],
            ])
          },
        ],
        [
          'leaf 1',
          {
            url: '',
            status: {
              code: 'downloading'
            }
          },
        ],
        [
          'branch 2',
          {
            url: '',
            children: new Map([
              [
                'sub branch 1',
                {
                  url: '',
                  children: new Map(),
                },
              ],
              [
                'sub leaf 1',
                {
                  url: '',
                  status: {
                    code: 'interrupted',
                    message: 'Some error occurred'
                  }
                },
              ],
              [
                'sub leaf 2',
                {
                  url: '',
                  status: {
                    code: 'completed'
                  }
                },
              ],
              [
                'sub branch 2',
                {
                  url: '',
                  children: new Map([
                    [
                      'sub sub branch 1',
                      {
                        url: '',
                        children: new Map(),
                      },
                    ],
                    [
                      'sub sub leaf 1',
                      {
                        url: '',
                        status: {
                          code: 'interrupted',
                          message: 'Some error occurred'
                        }
                      },
                    ],
                    [
                      'sub sub leaf 2',
                      {
                        url: '',
                        status: {
                          code: 'completed'
                        }
                      },
                    ],
                    [
                      'sub sub branch 2',
                      {
                        url: '',
                        children: new Map(),
                      },
                    ],
                  ])
                },
              ],
            ])
          },
        ],
      ])
    }
  }
}
