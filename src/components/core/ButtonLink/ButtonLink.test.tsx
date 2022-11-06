import paths from '@/constants/paths';
import { render, screen } from '@testing-library/react';
import ButtonLink from '.';

describe('ButtonLink', () => {
  it('matches snapshot', () => {
    const { asFragment } = render(
      <ButtonLink href={paths.home}>Test</ButtonLink>
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('should have a href', () => {
    const href = '/test';
    render(<ButtonLink href={href}>Test</ButtonLink>);

    const RenderedButtonLink = screen.getByRole('link');

    expect(RenderedButtonLink).toHaveAttribute('href', href);
  });
});
