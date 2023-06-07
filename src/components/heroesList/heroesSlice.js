import { createSlice, createAsyncThunk, createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import {useHttp} from '../../hooks/http.hook';

const heroesAdapter = createEntityAdapter();

export const fetchHeroes = createAsyncThunk(
    'heroes/fetchHeroes',
    async () => {
        const {request} = useHttp();
        return await request('http://localhost:3001/heroes');
    }
)

const heroesSlice = createSlice({
    name: 'heroes',
    initialState: heroesAdapter.getInitialState({
        heroesLoadingStatus: 'idle',
    }),
    reducers: {
        heroCreated: (state, action) => {
            heroesAdapter.addOne(state, action.payload);
        },
        heroDeleted: (state, action) => {
            heroesAdapter.removeOne(state, action.payload);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchHeroes.pending, state => {state.heroesLoadingStatus = 'loading'} )
            .addCase(fetchHeroes.fulfilled, (state, action) => {
                heroesAdapter.setAll(state, action.payload);
                state.heroesLoadingStatus = 'idle';
            })
            .addCase(fetchHeroes.rejected, (state) => {
                state.heroesLoadingStatus = 'error';
            })
            .addCase(() => {})
    }
});

const { actions, reducer } = heroesSlice;

const { selectAll } = heroesAdapter.getSelectors((state) => state.heroes);

export const filteredHeroesSelector = createSelector(
    (state) => state.filters.activeFilter,
    selectAll,
    (filter, heroes) => {
        if (filter === 'all') {
            return heroes;
        }

        return heroes.filter(item => item.element === filter);
    }
)

export default reducer;
export const {
    heroesFetching,
    heroesFetched,
    heroesFetchingError,
    heroCreated,
    heroDeleted
} = actions;