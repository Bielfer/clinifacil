import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from '.';

describe('Button', () => {
  const onClick = jest.fn();

  it('matches snapshot', () => {
    const { asFragment } = render(<Button>A Simple Button</Button>);

    expect(asFragment()).toMatchSnapshot();
  });

  it('should be clickable', async () => {
    render(<Button onClick={onClick}>A Simple Button</Button>);

    const renderedButton = screen.getByRole('button');

    userEvent.click(renderedButton);

    await waitFor(() => expect(onClick).toHaveBeenCalled());
  });

  it('should be disabled', () => {
    render(<Button disabled>A Simple Button</Button>);

    const renderedButton = screen.getByText('A Simple Button');

    expect(renderedButton).toBeDisabled();
  });

  it('should display loading spinner', () => {
    render(<Button loading>A Simple Button</Button>);

    const renderedButton = screen.queryByText('A Simple Button');

    expect(renderedButton).not.toBeTruthy();
  });
});
