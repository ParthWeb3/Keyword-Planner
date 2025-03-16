import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Keyword Planner Tool', () => {
  render(<App />);
  const linkElement = screen.getByText(/Keyword Planner Tool/i);
  expect(linkElement).toBeInTheDocument();
});
