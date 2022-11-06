import { getTestPlaceholders } from '@/helpers/tests';
import { render, screen } from '@testing-library/react';
import MySwitch from '.';

describe('MySwitch', () => {
  const label = getTestPlaceholders('label');
  const onChange = jest.fn();

  const renderMySwitch = (checked: boolean = false) =>
    render(
      <MySwitch label={label} checked={checked} onChange={() => onChange()} />
    );

  it('should match checked snapshot', () => {
    const { asFragment } = renderMySwitch(true);

    expect(asFragment()).toMatchSnapshot();
  });

  it('should match not checked snapshot', () => {
    const { asFragment } = renderMySwitch();

    expect(asFragment()).toMatchSnapshot();
  });

  it('should be checked', () => {
    renderMySwitch(true);

    expect(screen.getByRole('switch')).toBeChecked();
  });

  it('should not be checked', () => {
    renderMySwitch();

    expect(screen.getByRole('switch')).not.toBeChecked();
  });

  it('should be able to change states', () => {
    renderMySwitch();

    screen.getByRole('switch').click();

    expect(onChange).toHaveBeenCalled();
  });
});
