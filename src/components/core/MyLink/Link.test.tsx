import paths from '@/constants/paths';
import { render } from '@testing-library/react';
import Link from '.';

describe('Link', () => {
  it('matches snapshot', () => {
    const { asFragment } = render(<Link href={paths.home}>Test</Link>);

    expect(asFragment()).toMatchSnapshot();
  });
});
