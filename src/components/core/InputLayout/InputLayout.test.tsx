import { getTestPlaceholders } from '@/helpers/tests';
import { render, screen } from '@testing-library/react';
import InputLayout from '.';

describe('InputLayout', () => {
  const error = getTestPlaceholders('error');
  const hint = getTestPlaceholders('hint');
  const name = getTestPlaceholders('name');
  const label = getTestPlaceholders('label');
  const children = getTestPlaceholders('children');

  const renderInputLayout = () =>
    render(
      <InputLayout error={error} hint={hint} label={label} name={name}>
        {children}
      </InputLayout>
    );

  it('should match snapshot', () => {
    const { asFragment } = renderInputLayout();

    expect(asFragment()).toMatchSnapshot();
  });

  it('should have a label with htmlFor', () => {
    renderInputLayout();

    expect(screen.getByText(label)).toHaveAttribute('for', name);
  });
});
