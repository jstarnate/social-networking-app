import { cleanup, fireEvent, render, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import axios from 'axios';
import Index from '../components/Index';
import '@testing-library/jest-dom/extend-expect';

jest.mock('axios', () => ({
    post: jest.fn(),
}));

const axiosReject = (message: string) => ({
    response: {
        data: {
            errors: { message },
        },
    },
});

describe('Login Form', () => {
    const axiosMock = axios as jest.Mocked<typeof axios>;

    afterEach(cleanup);

    test('Displaying the login form after loading', () => {
        const { getByTestId } = render(<Index />);
        const loginForm = getByTestId('login-form');

        expect(loginForm).toBeTruthy();
    });

    test('Handling username and password values', () => {
        const { getByTestId } = render(<Index />);
        const username = getByTestId('username-input');
        const password = getByTestId('password-input');

        act(() => {
            fireEvent.change(username, { target: { value: 'username001' } });
            fireEvent.change(password, { target: { value: 'password123' } });
        });

        expect((username as HTMLInputElement).value).toBe('username001');
        expect((password as HTMLInputElement).value).toBe('password123');
    });

    test('Blank username error', async () => {
        axiosMock.post.mockRejectedValueOnce(
            axiosReject('Please enter your username.')
        );

        const { getByTestId, queryByTestId } = render(<Index />);
        const password = getByTestId('password-input');
        const form = getByTestId('login-form');

        act(() => {
            fireEvent.change(password, { target: { value: 'password123' } });
            fireEvent.submit(form);
        });

        await waitFor(() => queryByTestId('error-alert'));

        expect(queryByTestId('error-alert')).toBeTruthy();
        expect(queryByTestId('error-alert')?.textContent).toBe(
            'Please enter your username.'
        );
    });

    test('Blank password error', async () => {
        axiosMock.post.mockRejectedValueOnce(
            axiosReject('Please enter your password.')
        );

        const { getByTestId, queryByTestId } = render(<Index />);
        const username = getByTestId('username-input');
        const form = getByTestId('login-form');

        act(() => {
            fireEvent.change(username, { target: { value: 'username001' } });
            fireEvent.submit(form);
        });

        await waitFor(() => queryByTestId('error-alert'));

        expect(queryByTestId('error-alert')).toBeTruthy();
        expect(queryByTestId('error-alert')?.textContent).toBe(
            'Please enter your password.'
        );
    });

    test('Error on form submission if both username and password are blank', async () => {
        axiosMock.post.mockRejectedValueOnce(
            axiosReject('The combination you entered does not exist.')
        );

        const { getByTestId, queryByTestId } = render(<Index />);

        act(() => {
            fireEvent.submit(getByTestId('login-form'));
        });

        await waitFor(() => queryByTestId('error-alert'));

        expect(queryByTestId('error-alert')).toBeTruthy();
        expect(queryByTestId('error-alert')?.textContent).toBe(
            'The combination you entered does not exist.'
        );
    });
});
