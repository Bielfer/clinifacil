import { render, screen } from '@testing-library/react';
import ConditionalWrapper from '.';

describe('ConditionalWrapper', () => {
  it('wrapper should be on the document', () => {
    render(
      <ConditionalWrapper
        condition
        renderWrapper={(children) => <button type="button">{children}</button>}
      >
        Test
      </ConditionalWrapper>
    );

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('wrapper should not be on the document', () => {
    render(
      <ConditionalWrapper
        condition={false}
        renderWrapper={(children) => <button type="button">{children}</button>}
      >
        Test
      </ConditionalWrapper>
    );

    expect(screen.queryByRole('button')).toBeNull();
  });
});
