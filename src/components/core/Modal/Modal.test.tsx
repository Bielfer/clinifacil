import { render, screen } from '@testing-library/react';
import Modal from '.';
import Button from '../Button';

class IntersectionObserver {
  observe = jest.fn();

  disconnect = jest.fn();

  unobserve = jest.fn();
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: IntersectionObserver,
});

Object.defineProperty(global, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: IntersectionObserver,
});

describe('Modal', () => {
  const handleClose = jest.fn();
  it('matches open snapshot', () => {
    const { asFragment } = render(
      <Modal isOpen onClose={handleClose}>
        <Button>Test</Button>
      </Modal>
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('renders children', () => {
    render(
      <Modal isOpen onClose={handleClose}>
        <Button>Test</Button>
      </Modal>
    );

    expect(screen.getByRole('button')).toBeTruthy();
  });

  it(`shouldn't render children`, () => {
    render(
      <Modal isOpen={false} onClose={handleClose}>
        <Button>Test</Button>
      </Modal>
    );

    expect(screen.queryByText('Test')).not.toBeTruthy();
  });
});
