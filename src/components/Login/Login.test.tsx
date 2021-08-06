import { Err, Ok } from '@hqoss/monads';
import { fireEvent, render, screen } from '@testing-library/react';
import axios from 'axios';
import { act } from 'react-dom/test-utils';
import { login } from '../../services/conduit';
import { store } from '../../state/store';
import { Login } from './Login';
import { startLoginIn, updateEmail, updatePassword } from './Login.slice';

jest.mock('../../services/conduit', () => ({
  login: jest.fn(),
}));

jest.mock('axios');

const mockedLogin = login as jest.Mock<ReturnType<typeof login>>;

it('Should render', () => {
  render(<Login />);
});

it('Should change email', () => {
  const { getByPlaceholderText } = render(<Login />);
  fireEvent.change(getByPlaceholderText('Email'), { target: { value: 'test' } });
  expect(store.getState().login.email).toMatch('test');
});

it('Should change password', async () => {
  render(<Login />);
  fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'test pass' } });
  expect(store.getState().login.password).toMatch('test pass');
});

it('Should initialize on first render', async () => {
  await act(async () => {
    store.dispatch(updateEmail('1234'));
    store.dispatch(updatePassword('34145'));
    await render(<Login />);
  });

  expect(store.getState().login.email.length).toBe(0);
  expect(store.getState().login.password.length).toBe(0);
});

it('Should show errors if login fails and stop disabling the fields', async () => {
  mockedLogin.mockResolvedValueOnce(Err({ 'email or password': ['is invalid', 'is empty'] }));
  render(<Login />);

  await act(async () => {
    fireEvent.click(screen.getByRole('button'));
    expect(store.getState().login.loginIn).toBe(true);
  });

  expect(screen.getByText('email or password is invalid')).toBeInTheDocument();
  expect(screen.getByText('email or password is empty')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('Email')).not.toBeDisabled();
  expect(screen.getByPlaceholderText('Password')).not.toBeDisabled();
});

it('Should disable fields during login', async () => {
  render(<Login />);

  await act(async () => {
    await store.dispatch(startLoginIn());
  });

  expect(screen.getByPlaceholderText('Email')).toBeDisabled();
  expect(screen.getByPlaceholderText('Password')).toBeDisabled();
});

it('Should redirect to home if login is successful and setup auth', async () => {
  mockedLogin.mockResolvedValueOnce(
    Ok({
      email: 'jake@jake.jake',
      token: 'jwt.token.here',
      username: 'jake',
      bio: 'I work at statefarm',
      image: null,
    })
  );
  localStorage.clear();
  render(<Login />);

  await act(async () => {
    fireEvent.click(screen.getByRole('button'));
  });

  expect(location.hash).toMatch('#/');
  expect(localStorage.getItem('token')).toMatch('jwt.token.here');
  expect(axios.defaults.headers.Authorization).toMatch('Token jwt.token.here');
});
