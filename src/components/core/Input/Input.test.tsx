import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Input from '.';

describe('Input', () => {
  it('matches snapshot', () => {
    const { asFragment } = render(<Input />);

    expect(asFragment()).toMatchSnapshot();
  });

  it('should be able to type', async () => {
    render(<Input />);

    const RenderedInput = screen.getByRole('textbox');

    await waitFor(() => userEvent.type(RenderedInput, 'test'));

    expect(RenderedInput).toHaveValue('test');
  });

  it('should have a default type of text', () => {
    render(<Input />);

    const RenderedInput = screen.getByRole('textbox');

    expect(RenderedInput).toHaveAttribute('type', 'text');
  });
});
