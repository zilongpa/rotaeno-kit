import type { Meta, StoryObj } from '@storybook/react'

import { RatingDisplay } from '@/components/rating-page/RatingDisplay'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'RatingDisplay',
  component: RatingDisplay,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    rating: { control: { type: 'number', min: 0, step: 1 } },
  },
} satisfies Meta<typeof RatingDisplay>

export default meta
type Story = StoryObj<typeof meta>

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Initial: Story = {
  args: {
    rating: 0,
  },
}

export const TheoreticalMax: Story = {
  args: {
    rating: 16.742,
  },
}
