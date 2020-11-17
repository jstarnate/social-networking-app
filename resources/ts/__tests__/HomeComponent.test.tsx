import React from 'react';
import axios from 'axios';
import { Provider } from 'react-redux';
import { render, cleanup, act } from '@testing-library/react';
import HomeComponent from '../components/HomeComponent';
import store from '../data/store';

jest.mock('axios', () => ({
    get: jest.fn(),
}));

describe('Homepage', () => {
    const axiosMock = axios as jest.Mocked<typeof axios>;
    const renderComponent = () =>
        render(
            <Provider store={store}>
                <HomeComponent />
            </Provider>
        );

    afterEach(cleanup);

    test('Display the homepage after loading', () => {
        const { getByTestId } = renderComponent();
        const container = getByTestId('container');

        expect(container).toBeTruthy();
    });

    test('Display 3 random suggested users on rightbar', async () => {
        axiosMock.get.mockResolvedValue({
            users: [
                {
                    id: 1,
                    full_name: 'Jon Snow',
                    username: 'jonsnow123',
                    gender: 'Male',
                    image_url: undefined,
                    url: 'http://localhost:8000/u/jonsnow123',
                },
                {
                    id: 2,
                    full_name: 'Jack Frost',
                    username: 'jackfrost',
                    gender: 'Male',
                    image_url: undefined,
                    url: 'http://localhost:8000/u/jackfrost',
                },
                {
                    id: 3,
                    full_name: 'Jack Sparrow',
                    username: 'sparrow08',
                    gender: 'Male',
                    image_url: undefined,
                    url: 'http://localhost:8000/u/sparrow08',
                },
            ],
        });

        await act(async () => {
            const { queryByTestId } = renderComponent();

            expect(queryByTestId('suggested')?.childElementCount).toBe(3);
        });
    });
});
