import { render, screen } from '@testing-library/react';
import Text from '.';

describe('Text', () => {
  it('renders text', () => {
    render(<Text>Test</Text>);

    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('renders a p by default', () => {
    const { container } = render(<Text>Test</Text>);

    const element = container.firstChild?.nodeName;

    expect(element).toBe('P');
  });

  it('renders a h1', () => {
    const { container } = render(<Text h1>Test</Text>);

    const element = container.firstChild?.nodeName;

    expect(element).toBe('H1');
  });

  it('renders a h2', () => {
    const { container } = render(<Text h2>Test</Text>);

    const element = container.firstChild?.nodeName;

    expect(element).toBe('H2');
  });

  it('renders a h3', () => {
    const { container } = render(<Text h3>Test</Text>);

    const element = container.firstChild?.nodeName;

    expect(element).toBe('H3');
  });

  it('renders a h4', () => {
    const { container } = render(<Text h4>Test</Text>);

    const element = container.firstChild?.nodeName;

    expect(element).toBe('H4');
  });

  it('renders a h5', () => {
    const { container } = render(<Text h5>Test</Text>);

    const element = container.firstChild?.nodeName;

    expect(element).toBe('H5');
  });

  it('renders a h6', () => {
    const { container } = render(<Text h6>Test</Text>);

    const element = container.firstChild?.nodeName;

    expect(element).toBe('H6');
  });

  it('renders a p', () => {
    const { container } = render(<Text p>Test</Text>);

    const element = container.firstChild?.nodeName;

    expect(element).toBe('P');
  });

  it('renders a b', () => {
    const { container } = render(<Text b>Test</Text>);

    const element = container.firstChild?.nodeName;

    expect(element).toBe('B');
  });

  it('renders a small', () => {
    const { container } = render(<Text small>Test</Text>);

    const element = container.firstChild?.nodeName;

    expect(element).toBe('SMALL');
  });

  it('renders an i', () => {
    const { container } = render(<Text i>Test</Text>);

    const element = container.firstChild?.nodeName;

    expect(element).toBe('I');
  });

  it('renders a span', () => {
    const { container } = render(<Text span>Test</Text>);

    const element = container.firstChild?.nodeName;

    expect(element).toBe('SPAN');
  });

  it('renders a del', () => {
    const { container } = render(<Text del>Test</Text>);

    const element = container.firstChild?.nodeName;

    expect(element).toBe('DEL');
  });

  it('renders an em', () => {
    const { container } = render(<Text em>Test</Text>);

    const element = container.firstChild?.nodeName;

    expect(element).toBe('EM');
  });

  it('renders a blockquote', () => {
    const { container } = render(<Text blockquote>Test</Text>);

    const element = container.firstChild?.nodeName;

    expect(element).toBe('BLOCKQUOTE');
  });

  it('renders a label', () => {
    const { container } = render(<Text label>Test</Text>);

    const element = container.firstChild?.nodeName;

    expect(element).toBe('LABEL');
  });
});
